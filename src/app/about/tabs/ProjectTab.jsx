"use client";
import React from "react";
import Image from "next/image";

export default function ProjectTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold">About the Project</h2>
      <p>
        The Lönnrot project is a free digital library dedicated to preserving
        and sharing Finnish and Swedish public‑domain literary works. Our
        mission is to ensure that Finland’s cultural heritage remains
        accessible for all.
      </p>

      <section className="bg-[#111827] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">Project Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 text-lg">
            <p>
              We’ve modernized a platform to preserve over 3,000 Finnish and
              Swedish public‑domain texts. Our backend (Next.js + PostgreSQL on
              Azure) makes rare works organized, accessible, and interactive.
            </p>
            <p>
              Collaborations with Project Gutenberg and the DP Project have
              enriched our collection, making it one of the most comprehensive
              digital libraries of cultural heritage.
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
      </section>
    </div>
  );
}
