"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function IntroductionTab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold">Enter Lönnrot’s Mythic Hall</h2>
        <p>
          Tales for All, Sung in Eternity – a sacred library where the runes of public lore breathe anew.
        </p>
        <p>
          Projekti Lönnrot, a quest born of learning, weaves Finnish and Swedish runes into the eternal tapestry, guided by Wiiifiii, scribe of the Nile and North, to summon lore for all to hear.
        </p>
        <p>
          Our sacred vow is to guard the songs of old, ensuring the <em>Kalevala</em>’s whispers live on for generations yet to come.
        </p>
      </div>
      <div className="flex justify-center">
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <Image
            src="/images/IntroductionTab.png"
            alt="Elias Lönnrot"
            width={300}
            height={300}
            className="rounded shadow-lg"
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
            <Image
              src="/images/IntroductionTab.png"
              alt="Elias Lönnrot"
              fill
              style={{ objectFit: "contain" }}
              sizes="80vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}