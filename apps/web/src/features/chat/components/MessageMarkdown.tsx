import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { clsx } from 'clsx';

interface MessageMarkdownProps {
  content: string;
  className?: string;
}

export function MessageMarkdown({ content, className }: MessageMarkdownProps) {
  return (
    <div className={clsx('prose prose-invert max-w-none text-sm', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className, node, ref, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={vscDarkPlus as any}
                className="rounded-lg !my-4 !bg-black/40 border border-white/10 text-xs"
              />
            ) : (
              <code {...rest} className={clsx('bg-black/30 rounded px-1.5 py-0.5 text-brand-200', className)}>
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
          },
          a({ children, href }) {
            return (
              <a href={href} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                {children}
              </a>
            );
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mt-6 mb-4">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-bold mt-5 mb-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-md font-bold mt-4 mb-2">{children}</h3>;
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                <table className="w-full text-left border-collapse">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return <th className="bg-white/5 border-b border-white/10 p-3 font-semibold">{children}</th>;
          },
          td({ children }) {
            return <td className="p-3 border-b border-white/5">{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
