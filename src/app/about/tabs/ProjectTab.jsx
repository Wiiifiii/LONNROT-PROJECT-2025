"use client";
import React from "react";
import Image from "next/image";

export default function ProjectTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold">Lönnrot’s Sacred Quest</h2>
      <p>
        Projekti Lönnrot weaves a free mythical library, where Finnish and Swedish tales, sung in the public domain, are preserved for eternity. Our sacred quest mirrors Väinämöinen’s song, ensuring the lore of Finland echoes for all who seek its magic.
      </p>

      <h3 className="text-2xl font-semibold">Runes of the Realm</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 text-lg">
          <p>
            We’ve forged a kantele of light to cradle over 3,000 Finnish and Swedish tales, their runes glowing in the public domain. Our enchanted forge (Next.js + PostgreSQL on Azure) summons rare lore, weaving it into an accessible tapestry of wonder.
          </p>
          <p>
            Through sacred bonds with Project Gutenberg and the DP Project, our trove grows, a vast realm of lore unrivaled in its depth.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/images/ProjectOverview.png"
            alt="Lönnrot Hero"
            width={300}
            height={300}
            className="rounded shadow-lg cursor-pointer"
            // user can hook up onClick → Lightbox if desired
          />
        </div>
      </div>

      <h3 className="text-2xl font-semibold">Tales Yet to Sing</h3>
      <p>
        Soon, our library shall hold nearly 4,000 tales, their runes ready to sing through the ages.
      </p>
    </div>
  );
}