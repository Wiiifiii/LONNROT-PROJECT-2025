"use client";
import React from "react";
import Image from "next/image";

export default function CollaborationsTab() {
  return (
    <div className="space-y-8">
      {/* Elias Lönnrot */}
      <section className="bg-[#1f2937] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">
          Elias Lönnrot – The Man Behind the Kalevala
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/images/EliasLönnrotkuva.jpg"
              alt="Elias Lönnrot"
              width={250}
              height={250}
              className="rounded shadow-lg cursor-pointer"
            />
          </div>
          <div className="space-y-4 text-lg">
            <p>
              Elias Lönnrot (1802–1884) was a Finnish physician, philologist,
              and folklorist who compiled the Kalevala—the Finnish national
              epic.
            </p>
            <p>
              “The ancient songs are the mirror of our soul.” Inspired by his
              legacy, we strive to make historical literature accessible to
              modern audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Old Lönnrot.net */}
      <section className="bg-[#111827] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">Old Lönnrot.net</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 text-lg">
            <p>
              Lönnrot.net was one of the first platforms preserving Finnish
              public‑domain texts online, paving the way for modern digital
              libraries.
            </p>
            <p>
              Explore its evolution at{" "}
              <a
                href="http://www.lonnrot.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Lönnrot.net
              </a>
              .
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/images/OldLönnrot.jpg"
              alt="Old Lönnrot.net"
              width={250}
              height={250}
              className="rounded shadow-lg cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Project Gutenberg */}
      <section className="bg-[#1f2937] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">Project Gutenberg</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/images/Project_Gutenberg_logo.png"
              alt="Project Gutenberg Logo"
              width={200}
              height={200}
              className="rounded shadow-lg cursor-pointer"
            />
          </div>
          <div className="space-y-4 text-lg">
            <p>
              Project Gutenberg is one of the largest digital libraries,
              offering over 60,000 free eBooks to the world.
            </p>
            <p>
              Visit{" "}
              <a
                href="https://www.gutenberg.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Project Gutenberg
              </a>{" "}
              to explore their collection.
            </p>
          </div>
        </div>
      </section>

      {/* The DP Project */}
      <section className="bg-[#111827] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">The DP Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 text-lg">
            <p>
              Distributed Proofreaders is a community that proofreads
              public‑domain texts to ensure high‑quality digital editions.
            </p>
            <p>
              Learn more at{" "}
              <a
                href="https://www.pgdp.net/c/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                pgdp.net
              </a>
              .
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/images/dp-mark-120px.png"
              alt="DP Project Logo"
              width={200}
              height={200}
              className="rounded shadow-lg cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
