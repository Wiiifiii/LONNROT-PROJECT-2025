"use client";
import React, { useState } from "react";

export default function LoresKeeper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar and background images remain intact via global layout */}
      <div className="p-4 text-white">
        The Kalevala’s magic lies in its keeper, Elias Lönnrot, who gathered its runes. ‘Join Lönnrot’s Lore’ binds you to his legacy, a fellowship of tale-weavers. ‘Our Sacred Quest’ mirrors his mission, preserving tales before they fade into the mists. ‘Sampo’s Codex’ guards the library’s craft, a tome of secrets for those who build with its magic. Together, we keep the Kalevala’s spirit alive, a beacon for all who seek its wonders.
      </div>
      <div className="p-4">
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <img
            src="/images/LoresKeeper.png"
            alt="LoresKeeper"
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
              src="/images/Lore’s Keeper.png"
              alt="Lore’s Keeper"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
}



