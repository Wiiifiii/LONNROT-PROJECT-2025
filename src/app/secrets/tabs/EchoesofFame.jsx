"use client";
import React, { useState } from "react";

export default function EchoesofFame() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="p-4 text-white">
        In the Kalevala, tales of glory spread like wildfire. Our echoes mark the favored: ‘Sampo’s Chosen’ names the most claimed treasures, books taken as the Sampo’s gifts. ‘Fresh Tales’ are newly woven runes, fresh from the bard’s breath. ‘Kantele’s Echo’ sings of tales trending this week, their fame resounding like the kantele’s notes. ‘Lönnrot’s Runes’ honors the master’s works, the Kalevala and more, sung through the ages.
      </div>
      <div className="p-4">
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <img
            src="/images/EchoesofFame.png"
            alt="Echoes of Fame"
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
              src="/images/EchoesofFame.png"
              alt="Echoes of Fame"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
}



