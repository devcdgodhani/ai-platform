import { clsx } from 'clsx';

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
}

export function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  return (
    <div className={clsx('flex', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          role === 'user'
            ? 'bg-indigo-600/80 text-white rounded-tr-sm'
            : 'bg-white/5 border border-white/8 text-white/90 rounded-tl-sm',
        )}
      >
        {isStreaming && !content ? <StreamingDots /> : content}
      </div>
    </div>
  );
}

function StreamingDots() {
  return (
    <span className="flex gap-1 items-center h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
