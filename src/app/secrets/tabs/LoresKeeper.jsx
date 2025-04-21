"use client";
import React from "react";

export default function LoresKeeper() {
  return (
    <>
      {/* Navbar and background images remain intact via global layout */}
      <div className="p-4 text-white">
        The Kalevala’s magic lies in its keeper, Elias Lönnrot, who gathered its runes. ‘Join Lönnrot’s Lore’ binds you to his legacy, a fellowship of tale-weavers. ‘Our Sacred Quest’ mirrors his mission, preserving tales before they fade into the mists. ‘Sampo’s Codex’ guards the library’s craft, a tome of secrets for those who build with its magic. Together, we keep the Kalevala’s spirit alive, a beacon for all who seek its wonders.
      </div>
      <div className="p-4">
        <img
          src="/images/Lore’s Keeper.png"
          alt="Lore’s Keeper"
          className="mx-auto"
        />
      </div>
    </>
  );
}



