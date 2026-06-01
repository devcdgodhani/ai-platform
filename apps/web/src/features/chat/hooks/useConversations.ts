import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';

export function useConversations(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['conversations', page, limit],
    queryFn: () => chatApi.getConversations(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useConversation(id?: string) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => chatApi.getConversation(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
