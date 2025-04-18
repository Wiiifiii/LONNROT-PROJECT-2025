"use client";
import React from "react";
import Image from "next/image";

export default function DocumentationTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold">Project Documentation</h2>

      {/* Introduction */}
      <section className="bg-[#111827] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">Introduction &amp; Overview</h3>
        <p>
          The Lönnrot project is a modern digital platform for preserving and
          sharing Finnish and Swedish public‑domain literary works. Our mission
          is to digitize hard‑to‑find texts and make Finland’s heritage
          accessible to everyone.
        </p>
        <p>
          Built on Next.js with a PostgreSQL database on Azure, our solution is
          designed for scalability, security, and top performance.
        </p>
      </section>

      {/* Tech Stack */}
      <section className="bg-[#1f2937] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">Technology Stack &amp; Tools</h3>
        <p>We chose each component for reliability, developer velocity, and performance:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-6">
          {[
            ["/images/JS.png", "JavaScript"],
            ["/images/Next.png", "Next.js"],
            ["/images/React.png", "React"],
            ["/images/Prisma.png", "Prisma ORM"],
            ["/images/Azure.jpg", "Azure Cloud"],
            ["/images/Postgresql.jpg", "PostgreSQL"],
          ].map(([src, label]) => (
            <div key={label} className="flex flex-col items-center">
              <Image
                src={src}
                alt={label + " Logo"}
                width={80}
                height={80}
                className="object-contain cursor-pointer"
              />
              <span className="mt-2">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="bg-[#111827] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">System Architecture &amp; Diagrams</h3>
        <p>Our modular backend, interactive frontend, and robust API form the core of the platform.</p>
        <div className="space-y-6">
          {[
            ["Entity‑Relationship Diagram (ERD)", "/images/ERD-Entity-RelationshipDiagram.png"],
            ["Project Architecture Diagram", "/images/LönnrotProjectArchitectureDiagram.png"],
            ["User & Admin Interaction Flowchart", "/images/FlowchartUser&AdminInteraction.png"],
          ].map(([title, img]) => (
            <div key={title}>
              <h4 className="font-semibold mb-2">{title}</h4>
              <div className="flex justify-center">
                <Image
                  src={img}
                  alt={title}
                  width={400}
                  height={250}
                  className="rounded shadow-lg cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frontend Roadmap */}
      <section className="bg-[#1f2937] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">Frontend Roadmap &amp; Design</h3>
        <p>
          Built with Next.js and React for responsiveness, accessibility, and an intuitive UX.
        </p>
        <div className="flex justify-center">
          <Image
            src="/images/FrontendRoadmap.png"
            alt="Frontend Roadmap"
            width={400}
            height={250}
            className="rounded shadow-lg cursor-pointer"
          />
        </div>
      </section>

      {/* API & Backend */}
      <section className="bg-[#111827] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">API &amp; Backend Structure</h3>
        <p>
          Next.js API routes + Prisma + PostgreSQL on Azure power our backend.
          Modern authentication and RESTful endpoints ensure secure, performant
          data flows.
        </p>
        <p>
          See the <span className="font-semibold">API</span> tab for full
          details.
        </p>
      </section>

      {/* Development & Future */}
      <section className="bg-[#111827] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">Development, Testing &amp; Results</h3>
        <p>
          Agile sprints + rigorous testing across 3,000+ texts delivered
          enhanced performance and reliability.
        </p>
      </section>
      <section className="bg-[#111827] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">Future Plans &amp; Roadmap</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Advanced search &amp; filtering</li>
          <li>Interactive UX refinements</li>
          <li>Expanded multilingual collections</li>
          <li>User‑driven feature rollouts</li>
        </ul>
      </section>

      {/* Team & Credits */}
      <section className="bg-[#111827] p-6 rounded-lg space-y-4">
        <h3 className="text-2xl font-semibold">Team &amp; Credits</h3>
        <p>
          Built by [Your Team Name], in collaboration with Project Gutenberg and
          Distributed Proofreaders.
        </p>
      </section>
    </div>
  );
}
