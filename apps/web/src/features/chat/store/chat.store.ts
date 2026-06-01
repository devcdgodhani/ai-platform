import { create } from 'zustand';

interface ChatStore {
  activeConversationId: string | null;
  streamBuffer: string;
  isStreaming: boolean;
  setActiveConversation: (id: string | null) => void;
  appendStreamChunk: (delta: string) => void;
  setStreaming: (streaming: boolean) => void;
  clearStreamBuffer: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeConversationId: null,
  streamBuffer: '',
  isStreaming: false,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  appendStreamChunk: (delta) => set((s) => ({ streamBuffer: s.streamBuffer + delta })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  clearStreamBuffer: () => set({ streamBuffer: '' }),
}));
