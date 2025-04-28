"use client";
import React, { useState } from "react";

export default function VoicesofRunes() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="p-4 text-white">
        Bards in the Kalevala shared their songs, weaving a chorus of voices. Here, you add yours: ‘Carve Your Rune’ lets you etch your thoughts, a new verse in the library’s saga. ‘Scribe Your Tale’ invites your story, as Lönnrot scribed the Kalevala’s songs. ‘Runes & Voices’ gathers your ratings and reviews, a choir of praise for each tale. When ‘Silent Runes’ linger, no voices have yet sung—will you be the first?
      </div>
      <div className="p-4">
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <img
            src="/images/VoicesofRunes.png"
            alt="Voices of Runes"
            className="max-w-xs object-cover rounded-md"
          />
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white text-2xl z-10"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            <img
              src="/images/VoicesofRunes.png"
              alt="Voices of Runes"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
}



