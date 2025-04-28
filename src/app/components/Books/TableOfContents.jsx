'use client';
import React from 'react';

export default function TableOfContents({
  headings,
  rawText,
  containerRef,
  panelBg,
  panelText,
  panelBorder
}) {
  const scrollTo = id => {
    const node = containerRef.current?.querySelector(`#${id}`);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // detect lines separated by two blank lines before and after
  const extraHeadings = [];
  if (typeof rawText === 'string') {
    const lines = rawText.split('\n');
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      if (
        line.trim() &&
        idx >= 2 && lines[idx - 1].trim() === '' && lines[idx - 2].trim() === '' &&
        idx + 2 < lines.length && lines[idx + 1].trim() === '' && lines[idx + 2].trim() === ''
      ) {
        const id = line.trim().toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\-]/g, '');
        extraHeadings.push({ id, text: line.trim(), level: 2 });
      }
    }
  }

  const allHeadings = [...headings, ...extraHeadings];

  return (
    <aside className="hidden lg:block w-60 sticky top-20 self-start">
      <div className={`${panelBg} ${panelText} border ${panelBorder} p-4 rounded shadow-lg`}>
        <h2 className="font-semibold mb-2">Contents</h2>
        <ul className="space-y-1">
          {allHeadings.map(({ id, text, level }) => (
            <li key={id} style={{ marginLeft: `${(level - 1) * 0.75}rem` }}>
              <button
                onClick={() => scrollTo(id)}
                className={`w-full text-left hover:text-accent ${
                  level === 1 ? 'font-bold' : level === 2 ? 'italic' : ''
                }`}
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
