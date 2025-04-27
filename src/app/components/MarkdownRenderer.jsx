'use client';
import React, { useEffect } from 'react';
import ReactMarkdown      from 'react-markdown';
import remarkGfm          from 'remark-gfm';
import remarkSlug         from 'remark-slug';

export default function MarkdownRenderer({ text, theme, collectHeadings }) {
  // 1) Extract headings via simple regex
  useEffect(() => {
    if (!collectHeadings) return;
    const lines = text.split('\n');
    const heads = lines.reduce((acc, line) => {
      const m = line.match(/^(#{1,6})\s+(.*)/);
      if (m) {
        const level = m[1].length;
        const txt   = m[2].trim();
        const id    = txt.toLowerCase()
                         .replace(/[^a-z0-9]+/g,'-')
                         .replace(/(^-|-$)/g,'');
        acc.push({ id, text: txt, level });
      }
      return acc;
    }, []);
    collectHeadings(heads);
  }, [text]);

  // 2) Render markdown with slugged headings
  const Heading = level => ({node, children}) => {
    const txt = children.join('');
    const id  = txt.toLowerCase()
                   .replace(/[^a-z0-9]+/g,'-')
                   .replace(/(^-|-$)/g,'');
    const Tag = `h${level}`;
    const cls = {
      1: 'text-3xl font-bold my-4',
      2: 'text-2xl font-semibold my-3',
      3: 'text-xl font-semibold my-2'
    }[level] || 'font-semibold my-1';
    return <Tag id={id} className={cls}>{children}</Tag>;
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkSlug]}
      components={{
        h1: Heading(1),
        h2: Heading(2),
        h3: Heading(3),
        // pass through other elements…
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
