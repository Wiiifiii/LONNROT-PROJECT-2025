'use client';
import React from 'react';

// Helper to truncate text
const truncate = (text, maxLength) => {
    if (!text) return ""; // <-- if text is undefined, return empty
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '…';
  };
  

// Helper to pick a background color
const pickBackground = (title) => {
  const backgrounds = [
    'from-gray-800 to-gray-600',
    'from-indigo-900 to-indigo-700',
    'from-green-900 to-green-700',
    'from-purple-900 to-purple-700',
    'from-blue-900 to-blue-700',
    'from-yellow-900 to-yellow-700',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % backgrounds.length;
  return backgrounds[index];
};

export default function BookCover({ title, author }) {
  const background = pickBackground(title);

  return (
    <div className={`h-40 w-36 bg-gradient-to-br ${background} rounded-md shadow-lg flex flex-col justify-between p-2 text-white`}>
      {/* Top: Project Name */}
      <div className="text-[8px] font-semibold text-center text-gray-300">Lönnrot Project</div>

      {/* Middle: Title and Author */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h3 className="text-sm font-bold text-center leading-tight">{truncate(title, 24)}</h3>
        <p className="text-xs text-center mt-1">{truncate(author, 18)}</p>
      </div>

      {/* Bottom: Your Name */}
      <div className="text-[7px] text-center text-gray-400">by Wiiifiii</div>
    </div>
  );
}
