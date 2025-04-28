'use client';

import React from 'react';

export default function Spinner({ text = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center space-x-2 text-gray-300">
      {/* simple spinning circle */}
      <div className="w-5 h-5 border-2 border-t-transparent border-gray-300 rounded-full animate-spin" />
      <span>{text}</span>
    </div>
  );
}
