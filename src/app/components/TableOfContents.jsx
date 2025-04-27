'use client';
import React from 'react';

export default function TableOfContents({
  headings,
  containerRef,
  panelBg,
  panelText,
  panelBorder
}) {
  const scrollTo = id => {
    const node = containerRef.current?.querySelector(`#${id}`);
    if (node) node.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  return (
    <aside className="hidden lg:block w-60 sticky top-20 self-start">
      <div className={`${panelBg} ${panelText} border ${panelBorder} p-4 rounded shadow-lg`}>
        <h2 className="font-semibold mb-2">Contents</h2>
        <ul className="space-y-1">
          {headings.map(({id,text,level}) => (
            <li key={id} style={{ marginLeft:`${(level-1)*0.75}rem` }}>
              <button
                onClick={()=>scrollTo(id)}
                className="w-full text-left hover:text-accent"
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
