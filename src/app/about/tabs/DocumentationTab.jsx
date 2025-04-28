"use client";

import { useState } from "react";
import Image from "next/image";

export default function DocumentationTab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold text-white">Architecture Overview</h2>
      <p className="text-white">
        This chart provides a high-level, hand-drawn style overview of the two main
        phases of Project LÖNNROT:
      </p>
      <ul className="list-disc list-inside text-white">
        <li>
          <strong>Import Pipeline</strong> – Scripts that fetch and parse raw book
          archives, generate PDF/TXT versions, upload them to Supabase Storage, and
          populate the database via Prisma.
        </li>
        <li>
          <strong>Runtime App Flow</strong> – NextAuth authentication, Next.js API
          routes (Prisma-powered), and the React frontend that powers browsing,
          reading, lists, reviews, and all user interactions.
        </li>
      </ul>

      {/* Thumbnail opens lightbox */}
      <div
        className="overflow-auto rounded-lg shadow-md cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src="/images/Import Pipeline-Runtime App Flow.png"
          alt="Hand-drawn flowcharts showing Import Pipeline and Runtime App Flow"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>

      {/* Modal/lightbox overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white text-2xl z-10"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            <Image
              src="/images/RuntimeAppFlow.png"
              alt="Detailed flowcharts"
              fill
              style={{ objectFit: "contain" }}
              sizes="80vw"
            />
          </div>
        </div>
      )}

      <p className="text-sm text-white">
        Maintenance and housekeeping scripts (e.g. backfills, cleanups) are not shown
        here for clarity. See the <code>scripts/</code> folder for full details.
      </p>
    </div>
  );
}
