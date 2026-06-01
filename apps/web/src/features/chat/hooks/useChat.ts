import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketClient } from '@/lib/socket/socket.client';
import { useChatStore } from '../store/chat.store';
import { useAuthStore } from '@/features/auth/store/auth.store';
import toast from 'react-hot-toast';

export function useChat() {
  const queryClient = useQueryClient();
  const { appendStreamChunk, setStreaming, clearStreamBuffer } = useChatStore();
  const { tokens } = useAuthStore();

  useEffect(() => {
    if (!tokens?.accessToken) return;
    const socket = socketClient.connect(tokens.accessToken);

    socket.on('stream:chunk', ({ delta }) => {
      appendStreamChunk(delta);
    });

    socket.on('stream:done', ({ conversationId }) => {
      setStreaming(false);
      // Invalidate the cache to refresh history
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] });
        
        // If this was a new conversation, automatically select it!
        const { activeConversationId, setActiveConversation } = useChatStore.getState();
        if (!activeConversationId) {
          setActiveConversation(conversationId);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    socket.on('stream:error', ({ message }) => {
      setStreaming(false);
      console.error('Stream error:', message);
      toast.error(message || 'Failed to generate response');
    });

    return () => {
      socket.off('stream:chunk');
      socket.off('stream:done');
      socket.off('stream:error');
    };
  }, [appendStreamChunk, setStreaming, queryClient, tokens?.accessToken]);

  const sendStreamMessage = useCallback(
    (message: string, conversationId?: string) => {
      clearStreamBuffer();
      setStreaming(true);
      socketClient.emit('chat:stream', { message, conversationId });
    },
    [clearStreamBuffer, setStreaming]
  );

  return { sendStreamMessage };
}
