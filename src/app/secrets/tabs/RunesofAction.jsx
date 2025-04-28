"use client";
import React, { useState } from "react";

export default function RunesofAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar and background images remain intact via global layout */}
      <div className="p-4 text-white">
        In the Kalevala’s ancient songs, heroes wielded magic through deeds. Here, our runes of action guide your journey: ‘Read the Tale’ summons a story’s spirit, as Väinämöinen sang tales to life. ‘Take the Sampo’ claims a treasure, for the Sampo forged endless riches—here, it gifts you a book to keep. ‘Hold the Tale’ seals your place, preserving your path through lore’s vast tapestry. ‘Seek the Lore’ unveils hidden wisdom, like Ilmarinen seeking the Sampo’s secrets.
      </div>
      <div className="p-4">
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <img
            src="/images/RunesofAction.png"
            alt="Runes of Action"
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
              src="/images/Runes of Action.png"
              alt="Runes of Action"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
}



