import { useState, useRef, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useChat } from '../hooks/useChat';
import { useChatStore } from '../store/chat.store';
import { useConversation } from '../hooks/useConversations';
import { MessageMarkdown } from './MessageMarkdown';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { clsx } from 'clsx';
import { Spinner, MessageBubble, StreamingDots } from '@ai-platform/ui';

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function ChatWindow({ conversationId }: { conversationId?: string | null }) {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  
  const { data: conversation, isLoading, error } = useConversation(conversationId ?? undefined);
  const { sendStreamMessage } = useChat();
  const { streamBuffer, isStreaming } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevStreamBuffer = useRef('');

  const isFetching = useQueryClient().isFetching({ queryKey: ['conversations', conversationId] }) > 0;

  // Reset local messages when conversation changes
  useEffect(() => {
    setLocalMessages([]);
    prevStreamBuffer.current = '';
  }, [conversationId]);

  // Sync stream buffer into local message list
  useEffect(() => {
    if (!isStreaming && streamBuffer && streamBuffer !== prevStreamBuffer.current) {
      prevStreamBuffer.current = streamBuffer;
      setLocalMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '…') {
          return [...prev.slice(0, -1), { ...last, content: streamBuffer }];
        }
        return prev;
      });
    }
  }, [isStreaming, streamBuffer]);

  // Safely clear local optimistic messages only after the backend fetch completes
  useEffect(() => {
    if (!isStreaming && !isLoading && !isFetching) {
       setLocalMessages([]);
    }
  }, [isStreaming, isLoading, isFetching, conversationId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, streamBuffer, conversation?.messages, isStreaming]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: LocalMessage = { id: crypto.randomUUID(), role: 'user', content: input };
    const aiMsg: LocalMessage = { id: crypto.randomUUID(), role: 'assistant', content: '…' };
    setLocalMessages((prev) => [...prev, userMsg, aiMsg]);
    
    // Conditionally pass conversationId
    const cId = conversationId ? conversationId : undefined;
    sendStreamMessage(input, cId);
    setInput('');
  };

  const allMessages = useMemo(() => {
    const serverMsgs = conversation?.messages || [];
    return [...serverMsgs, ...localMessages];
  }, [conversation?.messages, localMessages]);

  if (isLoading && conversationId) {
    return <div className="flex-1 flex items-center justify-center text-white/50">Loading history...</div>;
  }
  
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-red-400">
        <p>Failed to load conversation.</p>
        <p className="text-xs opacity-70 mt-2">{String(error)}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {allMessages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mb-4">
              <span className="text-3xl">✦</span>
            </div>
            <h2 className="text-xl font-semibold text-white/80">AI Platform</h2>
            <p className="text-sm text-white/40 mt-2">Start a conversation</p>
          </div>
        )}

        {allMessages.map((msg, idx) => {
          const isLastAndStreaming = msg.role === 'assistant' && idx === allMessages.length - 1 && isStreaming;
          
          return (
            <MessageBubble 
              key={msg.id}
              role={msg.role} 
              isStreaming={isLastAndStreaming}
              bubbleClassName={clsx(
                'animate-slide-up',
                msg.role === 'user' ? 'bg-brand-600/80 text-white' : 'glass text-white/90'
              )}
            >
              {isLastAndStreaming && streamBuffer ? (
                <ErrorBoundary fallback={<div className="text-red-400">Failed to render message format.</div>}>
                  <MessageMarkdown content={streamBuffer} />
                </ErrorBoundary>
              ) : msg.role === 'user' ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : !isLastAndStreaming ? (
                <ErrorBoundary fallback={<div className="text-red-400">Failed to render message format.</div>}>
                  <MessageMarkdown content={msg.content} />
                </ErrorBoundary>
              ) : null}
            </MessageBubble>
          );
        })}
        
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message AI Platform..."
            className="input-base flex-1 bg-white/5 border-white/10"
            disabled={isStreaming}
          />
          <button
            id="chat-send"
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="btn-primary px-6 shrink-0"
          >
            {isStreaming ? (
              <Spinner size="sm" className="border-white/30 border-t-white block" />
            ) : (
              '↑'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


