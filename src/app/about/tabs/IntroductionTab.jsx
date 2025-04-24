"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function IntroductionTab() {
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
          Our sacred vow is to guard the songs of old, ensuring the *Kalevala*’s whispers live on for generations yet to come.
        </p>
      </div>
      <div className="flex justify-center">
        <Image
          src="/images/IntroductionTab.png"
          alt="Elias Lönnrot"
          width={300}
          height={300}
          className="rounded shadow-lg"
        />
      </div>
    </div>
  );
}