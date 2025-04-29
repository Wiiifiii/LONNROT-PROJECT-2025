"use client";
import React, { useState } from "react";

export default function PathsofLore() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="p-4 text-white">
        The Kalevala’s bards wandered far, their songs mapping realms of wonder. Our paths guide you through this library: ‘Kalevala’s Gateway’ opens the realm, a portal to mythic tales. ‘My Tale Lists’ gathers your cherished stories, a bard’s collection of sung verses. ‘Kantele’s Guide’ offers wisdom, as Väinämöinen’s kantele led heroes with its melodies. ‘Lönnrot’s Tale’ shares our origins, a saga of the scribe who wove the Kalevala’s runes.
      </div>
      <div className="p-4">
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <img
            src="/images/PathsofLore.png"
            alt="Paths of Lore"
            className="w-full max-w-xs object-cover rounded-md mx-auto"
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
              src="/images/Paths of Lore.png"
              alt="Paths of Lore"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
}



