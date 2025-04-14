// Summary: Client-rendered documentation page that displays detailed information about the project (including table of contents, technology stack, system architecture, frontend roadmap, API/backend structure, development details, future plans, and team credits) with an integrated lightbox for viewing images.

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";

export default function Documentation() {
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const openLightbox = (imageSrc) => {
    setLightboxImage(imageSrc);
    setReloadKey(Date.now());
    setLightboxIsOpen(true);
  };

  return (
    <div className="bg-[#1f2937] text-white">
      <Navbar />
      {lightboxIsOpen && (
        <Lightbox
          open={lightboxIsOpen}
          close={() => setLightboxIsOpen(false)}
          slides={[{ src: lightboxImage }]}
        />
      )}
      <div className="pt-24 container mx-auto px-4 py-8 text-2xl">
        <section className="mb-8">
          <h1 className="text-4xl font-extrabold mb-4">Project Documentation</h1>
          <div className="bg-[#1f2937] shadow rounded p-4 mb-8">
            <h2 className="text-3xl font-semibold mb-2 text-white">Contents</h2>
            <ul className="list-disc list-inside space-y-2 text-white">
              <li>
                <a href="#overview" className="text-blue-400 hover:underline">
                  Introduction &amp; Overview
                </a>
              </li>
              <li>
                <a href="#techstack" className="text-blue-400 hover:underline">
                  Technology Stack &amp; Tools
                </a>
              </li>
              <li>
                <a href="#architecture" className="text-blue-400 hover:underline">
                  System Architecture &amp; Diagrams
                </a>
              </li>
              <li>
                <a href="#frontend" className="text-blue-400 hover:underline">
                  Frontend Roadmap &amp; Design
                </a>
              </li>
              <li>
                <a href="#api-backend" className="text-blue-400 hover:underline">
                  API &amp; Backend Structure
                </a>
              </li>
              <li>
                <a href="#development" className="text-blue-400 hover:underline">
                  Development, Testing, and Results
                </a>
              </li>
              <li>
                <a href="#future" className="text-blue-400 hover:underline">
                  Future Plans &amp; Roadmap
                </a>
              </li>
              <li>
                <a href="#team" className="text-blue-400 hover:underline">
                  Team &amp; Credits
                </a>
              </li>
            </ul>
          </div>
        </section>
        <section id="overview" className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="font-semibold mb-4">Introduction &amp; Project Overview</h2>
          <p className="mb-4">
            The Lönnrot project is a modern digital platform focused on preserving and sharing Finnish and Swedish public domain literary works.
            Our mission is to gather and digitize hard-to-find texts and ensure that Finland’s rich cultural heritage remains accessible to everyone.
          </p>
          <p>
            Leveraging a state-of-the-art tech stack, our solution is designed to be scalable, secure, and high performance — eliminating the need for cumbersome local database setups.
          </p>
        </section>
        <section id="techstack" className="mb-12 bg-[#1f2937] text-white p-6 rounded">
          <h2 className="font-semibold mb-4">Technology Stack &amp; Tools</h2>
          <p className="mb-4">
            Our platform is built with a modern stack that provides both power and versatility. Here’s why we chose each component:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-6">
            <div className="flex flex-col items-center">
              <Image src="/images/JS.png" alt="JavaScript Logo" width={100} height={100} className="object-contain" />
              <span className="mt-2 text-sm">JavaScript</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/images/Next.png" alt="Next.js Logo" width={100} height={100} className="object-contain" />
              <span className="mt-2 text-sm">Next.js</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/images/React.png" alt="React Logo" width={100} height={100} className="object-contain" />
              <span className="mt-2 text-sm">React</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/images/Prisma.png" alt="Prisma Logo" width={100} height={100} className="object-contain" />
              <span className="mt-2 text-sm">Prisma ORM</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/images/Azure.jpg" alt="Azure Cloud Logo" width={100} height={100} className="object-contain" />
              <span className="mt-2 text-sm">Azure Cloud</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/images/Postgresql.jpg" alt="PostgreSQL Logo" width={100} height={100} className="object-contain" />
              <span className="mt-2 text-sm">PostgreSQL</span>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">JavaScript:</h3>
              <p>
                JavaScript is the lingua franca of web development. Its versatility enables us to write code that runs on both the client and server, streamlining our development process and ensuring consistency across the entire stack...
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Next.js:</h3>
              <p>
                Next.js is our choice for its powerful features such as server-side rendering, static-site generation, and efficient routing. It enhances SEO and performance while providing an excellent developer experience...
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">React:</h3>
              <p>
                React allows us to build dynamic, component-based user interfaces with a declarative approach that greatly simplifies complex UI logic...
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Prisma ORM:</h3>
              <p>
                We use Prisma ORM to interact with our PostgreSQL database in a type-safe manner. Its intuitive API and built-in type safety reduce boilerplate code and minimize potential runtime errors...
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Azure Cloud:</h3>
              <p>
                Hosting PostgreSQL on Azure ensures high availability, scalability, and robust security without the need for a local setup. This fully managed service not only provides seamless performance and automated backups...
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">PostgreSQL:</h3>
              <p>
                PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development. It provides reliability, extensibility, and performance for our data needs.
              </p>
            </div>
          </div>
        </section>
        <section id="architecture" className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="font-semibold mb-4">System Architecture &amp; Diagrams</h2>
          <p className="mb-4">
            Our platform’s modular architecture integrates a robust backend, an interactive frontend, and a comprehensive API layer.
          </p>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Entity-Relationship Diagram (ERD)</h3>
            <div onClick={() => openLightbox("/images/ERD-Entity-RelationshipDiagram.png")} className="cursor-pointer flex justify-center">
              <Image src="/images/ERD-Entity-RelationshipDiagram.png" alt="ERD Diagram" width={600} height={400} className="rounded shadow-lg" />
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Project Architecture Diagram</h3>
            <div onClick={() => openLightbox("/images/LönnrotProjectArchitectureDiagram.png")} className="cursor-pointer flex justify-center">
              <Image src="/images/LönnrotProjectArchitectureDiagram.png" alt="Project Architecture Diagram" width={600} height={400} className="rounded shadow-lg" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Flowchart: User &amp; Admin Interaction</h3>
            <div onClick={() => openLightbox("images/FlowchartUser&AdminInteraction.png")} className="cursor-pointer flex justify-center">
              <Image src="/images/FlowchartUser&AdminInteraction.png" alt="User & Admin Interaction Flowchart" width={600} height={400} className="rounded shadow-lg" />
            </div>
          </div>
        </section>
        <section id="frontend" className="mb-12 bg-[#1f2937] text-white p-6 rounded">
          <h2 className="font-semibold mb-4">Frontend Roadmap &amp; Design</h2>
          <p className="mb-4">
            Our frontend, developed with Next.js and React, is built for responsiveness, accessibility, and intuitive interaction.
          </p>
          <div onClick={() => openLightbox("/images/FrontendRoadmap.png")} className="cursor-pointer flex justify-center">
            <Image src="/images/FrontendRoadmap.png" alt="Frontend Roadmap" width={600} height={400} className="rounded shadow-lg" />
          </div>
        </section>
        <section id="api-backend" className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="font-semibold mb-4">API &amp; Backend Structure</h2>
          <p className="mb-4">
            Our backend is powered by Next.js API routes, integrated with Prisma ORM and a PostgreSQL database hosted on Azure.
          </p>
          <p className="mb-4">
            We have implemented modern authentication and robust API endpoint designs that facilitate seamless communication between the frontend and backend.
          </p>
          <p>
            For a detailed view of our API structure, please refer to our&nbsp;
            <a href="/documentation/api-doc" className="text-blue-400 hover:underline">API Documentation</a>
            &nbsp;
          </p>
        </section>
        <section id="development" className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="font-semibold mb-4">Development, Testing, and Results</h2>
          <p className="mb-4">
            Our agile development process combined iterative improvements with rigorous testing across a collection of over 3,000 digitized texts.
          </p>
          <p>
            The enhanced performance and reliability underline the success of our modernization efforts.
          </p>
        </section>
        <section id="future" className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="font-semibold mb-4">Future Plans &amp; Roadmap</h2>
          <p className="mb-4">
            Our future initiatives include:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Introducing advanced search and filtering capabilities.</li>
            <li>Enhancing interactive features and further refining UI/UX based on user feedback.</li>
            <li>Expanding our digital library to include additional literary works and languages.</li>
            <li>Implementing user-driven features and continuous performance improvements.</li>
          </ul>
          <p>
            We remain committed to evolving the platform to meet and exceed user expectations.
          </p>
        </section>
      </div>
    </div>
  );
}
