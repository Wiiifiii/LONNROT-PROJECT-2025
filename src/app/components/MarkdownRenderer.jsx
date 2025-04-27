// src/app/components/MarkdownRenderer.jsx
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default function MarkdownRenderer({
  text,
  fontSize,
  theme,
  collectHeadings
}) {
  const proseClass =
    theme === 'dark'
      ? 'prose prose-lg dark:prose-invert'
      : theme === 'sepia'
      ? 'prose prose-lg text-gray-900 bg-[#f4ecd8]'
      : 'prose prose-lg text-gray-800';

  return (
    <div style={{ fontSize: `${fontSize}px` }} className={`${proseClass} leading-relaxed tracking-wide`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
        components={{
          h1: props => <h1 className="text-4xl font-bold mt-8 mb-4" {...props}/>,
          h2: props => <h2 className="text-3xl font-semibold mt-6 mb-3" {...props}/>,
          h3: props => <h3 className="text-2xl font-semibold mt-4 mb-2" {...props}/>,
          strong: props => <strong className="font-semibold" {...props}/>,
          em:     props => <em className="italic" {...props}/>,
          a:      props => <a className="text-accent hover:underline" {...props}/>,
          ul:     props => <ul className="list-disc list-inside space-y-1" {...props}/>,
          ol:     props => <ol className="list-decimal list-inside space-y-1" {...props}/>,
          blockquote: props => (
            <blockquote className="border-l-4 border-gray-400 pl-4 italic my-6" {...props}/>
          ),
          code({ inline, children, ...props }) {
            return inline ? (
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded" {...props}>
                {children}
              </code>
            ) : (
              <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-auto" {...props}>
                <code>{children}</code>
              </pre>
            );
          }
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
