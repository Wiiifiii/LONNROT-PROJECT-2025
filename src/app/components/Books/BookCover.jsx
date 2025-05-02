'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';

import { GiLion} from "react-icons/gi";
// Helper to safely truncate text
const truncate = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
};

// Helper to pick a background color matching the fantasy theme
const pickBackground = (title) => {
  const backgrounds = [
    'from-blue-900 to-blue-700',
    'from-gray-800 to-gray-600',
    'from-indigo-900 to-indigo-700',
    'from-cyan-900 to-cyan-700',
    'from-slate-800 to-slate-600',
    'from-teal-900 to-teal-700',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % backgrounds.length;
  return backgrounds[index];
};


function Sparkle() {
  const left = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 5 + Math.random() * 5, []);
  const delay = useMemo(() => Math.random() * 5, []);
  const size = useMemo(() => 1 + Math.random() * 2, []);

  return (
    <div
      className="absolute rounded-full bg-white opacity-20"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `floatUp ${duration}s ease-in infinite`,
        animationDelay: `${delay}s`
      }}
    ></div>
  );
}

export default function BookCover({ title, author }) {
  const background = pickBackground(title);
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/magic-hover.mp3');
    audioRef.current.volume = 0.2;

    // Load user preference from localStorage
    const savedMute = localStorage.getItem('magicSoundMuted');
    if (savedMute === 'true') {
      setMuted(true);
    }
  }, []);

  const playHoverSound = () => {
    if (!muted && audioRef.current) {
      audioRef.current.currentTime = 0;
      setTimeout(() => {
        audioRef.current.play().catch(() => {
          console.warn("Hover sound not allowed yet (user interaction needed).");
        });
      }, 100);
    }
  };

  const toggleMute = () => {
    setMuted((prev) => {
      const newMuted = !prev;
      localStorage.setItem('magicSoundMuted', newMuted.toString());
      return newMuted;
    });
  };

  return (
    <div 
      className="relative h-40 w-36 rounded-md shadow-lg flex flex-col justify-between p-2 text-white transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden group"
      onMouseEnter={playHoverSound}
    >
      {/* Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, idx) => (
          <Sparkle key={idx} />
        ))}
      </div>

      {/* Background */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br ${background} rounded-md pointer-events-none`}></div>

      {/* Rune */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10 animate-pulse-slow">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="white" className="opacity-50">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2v20m0 0l6-6m-6 6l-6-6" />
        </svg>
      </div>

      {/* Mute Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        className="absolute top-1 right-1 bg-[#1f2937] bg-opacity-70 rounded-full p-1 text-xs hover:bg-gray-600 z-20"
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top: Project Lönnrot and Icon */}
        <GiLion className="mx-auto text-xl text-gray-300" />
          <div className="text-[8px] font-semibold text-center text-gray-300">PROJECT LÖNNROT</div>
         

          {/* Middle: Title and Author */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <h3 className="text-sm font-bold text-center leading-tight">{truncate(title, 24)}</h3>
          <p className="text-xs text-center mt-1">{truncate(author, 18)}</p>
        </div>

        {/* Bottom: Your Name */}
        <div className="text-[7px] text-center text-gray-400">Wiiifiii</div>
      </div>
    </div>
  );
}
