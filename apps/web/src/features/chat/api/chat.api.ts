import { apiClient } from '@/lib/api/client';
import type { Conversation, PaginatedResult } from '@ai-platform/shared-types';

export interface MessageHistory {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface ConversationHistory extends Conversation {
  messages: MessageHistory[];
}

export const chatApi = {
  getConversations: async (page = 1, limit = 20) => {
    const { data } = await apiClient.get<PaginatedResult<Conversation>>('/chat/conversations', {
      params: { page, limit },
    });
    return data;
  },

  getConversation: async (id: string) => {
    const { data } = await apiClient.get<ConversationHistory>(`/chat/conversations/${id}`);
    return data;
  },

  sendMessage: async (payload: { message: string; conversationId?: string; model?: string; provider?: string; systemPrompt?: string }) => {
    const { data } = await apiClient.post('/chat', payload);
    return data;
  },
};
