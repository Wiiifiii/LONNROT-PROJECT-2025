"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function IntroductionTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold">Welcome to Projekti Lönnrot</h2>
        <p>
          Vapaita e‑kirjoja kaikille – a free digital library dedicated to
          preserving and sharing public‑domain literature.
        </p>
        <p>
          Project LÖNNROT is a school project digitizing Finnish and
          Swedish‑language public‑domain works to preserve them and make them
          accessible to everyone.
        </p>
        <p>
          Our mission is to safeguard literary heritage and ensure our cultural
          stories remain alive for future generations.
        </p>
        <Link
          href="/documentation"
          className="inline-flex items-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full text-base transition"
        >
          Learn More
        </Link>
      </div>
      <div className="flex justify-center">
        <Image
          src="/images/el.jpg"
          alt="Elias Lönnrot"
          width={300}
          height={300}
          className="rounded shadow-lg"
        />
      </div>
    </div>
  );
}
