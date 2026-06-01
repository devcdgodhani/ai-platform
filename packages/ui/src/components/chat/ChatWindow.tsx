import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  streamBuffer?: string;
  isStreaming?: boolean;
}

export function ChatWindow({ messages, streamBuffer, isStreaming }: ChatWindowProps) {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}
      {isStreaming && (
        <MessageBubble role="assistant" content={streamBuffer ?? ''} isStreaming />
      )}
    </div>
  );
}
