import { Controller, Post, Get, Body, Query, Param, UseGuards, Version } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { ChatRequest, UserProfile } from '@ai-platform/shared-types';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @Version('1')
  async chat(@CurrentUser() user: UserProfile, @Body() dto: ChatRequest) {
    return this.chatService.chat(user.id, dto);
  }

  @Get('conversations')
  @Version('1')
  async listConversations(
    @CurrentUser() user: UserProfile,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.chatService.listConversations(user.id, +page, +limit);
  }

  @Get('conversations/:id')
  @Version('1')
  async getConversation(
    @CurrentUser() user: UserProfile,
    @Param('id') id: string,
  ) {
    return this.chatService.getConversationWithMessages(user.id, id);
  }
}
