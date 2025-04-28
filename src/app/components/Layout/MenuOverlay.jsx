// src/app/components/MenuOverlay.jsx
"use client";
import React from 'react';
import Link from 'next/link';

export default function MenuOverlay({ links }) {
  return (
    <ul className="flex flex-col py-4 items-center space-y-2 bg-[#111827]">
      {links.map(({ href, title, Icon, action }, idx) => (
        <li key={idx} className="w-full">
          {action ? (
            <button
              onClick={action}
              className="flex w-full items-center justify-center gap-2 px-4 py-2 text-white hover:text-blue-400"
            >
              {Icon && <Icon />}
              <span>{title}</span>
            </button>
          ) : (
            <Link
              href={href}
              className="flex w-full items-center justify-center gap-2 px-4 py-2 text-white hover:text-blue-400"
            >
              {Icon && <Icon />}
              <span>{title}</span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
