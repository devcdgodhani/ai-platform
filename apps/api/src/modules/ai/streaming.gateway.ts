import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AIService } from './ai.service';
import { createLogger } from '@ai-platform/logger';
import { MessageRole } from '@ai-platform/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { getApiEnv } from '@ai-platform/shared-config';
import { AIProviderFactory } from '@ai-platform/ai-core';
import type { JWTPayload } from '@ai-platform/shared-types';

const logger = createLogger('api:streaming-gateway');

interface StreamChatPayload {
  conversationId?: string;
  message: string;
  model?: string;
  provider?: string;
  systemPrompt?: string;
}

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/chat',
})
export class StreamingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly aiService: AIService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth?.token;
      if (!token) throw new Error('No token provided');

      const payload = this.jwtService.verify<JWTPayload>(token, {
        secret: getApiEnv().JWT_SECRET,
      });

      client.data.userId = payload.sub;
      logger.info({ socketId: client.id, userId: payload.sub }, 'Client connected');
    } catch (err) {
      logger.warn({ socketId: client.id }, 'Unauthorized socket connection');
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    logger.info({ socketId: client.id }, 'Client disconnected');
  }

  @SubscribeMessage('chat:stream')
  async handleStream(
    @MessageBody() payload: StreamChatPayload,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.data.userId;
    if (!userId) {
      client.emit('stream:error', { message: 'Unauthorized' });
      return;
    }

    logger.info({ socketId: client.id, provider: payload.provider }, 'stream request received');

    try {
      // 1. Resolve Provider and exact Model
      const providerName = payload.provider ?? getApiEnv().DEFAULT_AI_PROVIDER;
      const provider = AIProviderFactory.get(providerName);
      const exactModel = payload.model ?? provider.modelName;

      // 2. Get or create conversation
      let conversationId = payload.conversationId;
      if (!conversationId) {
        const conv = await this.prisma.conversation.create({
          data: {
            userId,
            title: payload.message.slice(0, 80),
            model: exactModel,
          },
        });
        conversationId = conv.id;
      }

      // 3. Save user message
      await this.prisma.message.create({
        data: { conversationId, role: 'USER', content: payload.message },
      });

      // 4. Load history
      const historyMsgs = await this.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });

      const compiled = payload.systemPrompt
        ? { system: payload.systemPrompt, user: payload.message }
        : this.aiService.compilePrompt('chat.default', { message: payload.message });

      const messages = [
        { role: MessageRole.SYSTEM, content: compiled.system },
        ...historyMsgs.map((m) => ({ role: m.role as MessageRole, content: m.content })),
      ];

      // 5. Stream from AI
      let totalChunks = 0;
      let assistantContent = '';

      for await (const chunk of this.aiService.stream(messages, {
        model: payload.model,
        provider: payload.provider,
      })) {
        if (chunk.done) break;

        assistantContent += chunk.delta;
        client.emit('stream:chunk', { delta: chunk.delta, index: chunk.index });
        totalChunks++;
      }

      // 6. Save assistant message
      await this.prisma.message.create({
        data: {
          conversationId,
          role: 'ASSISTANT',
          content: assistantContent,
          model: exactModel,
          tokens: 0, // Streaming often doesn't return exact token counts natively, could estimate in future
        },
      });

      client.emit('stream:done', {
        conversationId,
        totalChunks,
      });
    } catch (err) {
      logger.error({ err, socketId: client.id }, 'Stream error');
      client.emit('stream:error', {
        message: err instanceof Error ? err.message : 'Stream failed',
      });
    }
  }
}
