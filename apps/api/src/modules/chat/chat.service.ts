import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { RedisService } from '../../infrastructure/cache/redis.service';
import { AIService } from '../ai/ai.service';
import { REDIS_KEYS, REDIS_TTL } from '@ai-platform/shared-config';
import { MessageRole } from '@ai-platform/shared-types';
import type { ChatRequest, ChatResponse, Conversation, PaginatedResult } from '@ai-platform/shared-types';
import { createLogger } from '@ai-platform/logger';
import { v4 as uuid } from 'uuid';

const logger = createLogger('api:chat-service');

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly aiService: AIService,
  ) {}

  async chat(userId: string, dto: ChatRequest): Promise<ChatResponse> {
    // Get or create conversation
    let conversationId = dto.conversationId;
    if (!conversationId) {
      const conv = await this.prisma.conversation.create({
        data: {
          userId,
          title: dto.message.slice(0, 80),
          model: dto.model ?? 'gpt-4o',
        },
      });
      conversationId = conv.id;
    }

    // Save user message
    await this.prisma.message.create({
      data: { conversationId, role: 'USER', content: dto.message },
    });

    // Get conversation history (from Redis cache first)
    const cacheKey = REDIS_KEYS.chat(userId, conversationId);
    let history = await this.redis.getJson<Array<{ role: MessageRole; content: string }>>(cacheKey);

    if (!history) {
      const messages = await this.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });
      history = messages.map((m) => ({ role: m.role as MessageRole, content: m.content }));
    }

    // Build prompt and call AI
    const compiled = dto.systemPrompt
      ? { system: dto.systemPrompt, user: dto.message }
      : this.aiService.compilePrompt('chat.default', { message: dto.message });

    const allMessages = [
      { role: MessageRole.SYSTEM, content: compiled.system },
      ...history,
    ];

    const aiResponse = await this.aiService.chat(allMessages, {
      model: dto.model,
      provider: dto.provider,
    });

    // Save assistant message
    const saved = await this.prisma.message.create({
      data: {
        conversationId,
        role: 'ASSISTANT',
        content: aiResponse.content,
        model: aiResponse.model,
        tokens: aiResponse.usage.totalTokens,
      },
    });

    // Update Redis cache
    history.push({ role: MessageRole.USER, content: dto.message });
    history.push({ role: MessageRole.ASSISTANT, content: aiResponse.content });
    await this.redis.setJson(cacheKey, history, REDIS_TTL.CONVERSATION_HISTORY);

    logger.info({ conversationId, tokens: aiResponse.usage.totalTokens }, 'chat completed');

    return {
      conversationId,
      messageId: saved.id,
      content: aiResponse.content,
      model: aiResponse.model,
      usage: aiResponse.usage,
    };
  }

  async listConversations(userId: string, page = 1, limit = 20): Promise<PaginatedResult<Conversation>> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where: { userId, status: 'ACTIVE' },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: { _count: { select: { messages: true } } },
      }),
      this.prisma.conversation.count({ where: { userId, status: 'ACTIVE' } }),
    ]);

    return {
      items: items.map((c) => ({
        id: c.id,
        userId: c.userId,
        title: c.title,
        status: c.status as never,
        model: c.model,
        messageCount: c._count.messages,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getConversationWithMessages(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId, status: 'ACTIVE' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      id: conversation.id,
      title: conversation.title,
      model: conversation.model,
      createdAt: conversation.createdAt,
      messages: conversation.messages.map((m) => ({
        id: m.id,
        role: m.role.toLowerCase(),
        content: m.content,
        createdAt: m.createdAt,
      })),
    };
  }
}
