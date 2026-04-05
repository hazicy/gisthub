'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-renderer prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className;

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-default-100 text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return match ? (
              <div className="rounded-lg overflow-hidden my-4">
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-default-200">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="my-3 leading-7">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="my-1">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-default-300 pl-4 my-4 italic text-default-600">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-default-200">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-default-200 px-4 py-2 bg-default-100 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-default-200 px-4 py-2">{children}</td>
          ),
          hr: () => <hr className="my-6 border-default-200" />,
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="max-w-full rounded-lg my-4" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}