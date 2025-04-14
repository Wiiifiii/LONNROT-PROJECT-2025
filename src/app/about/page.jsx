// Summary: Displays the About page including project overview, Elias Lönnrot info,
// historical references, and collaborations.

import React from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="bg-[#1f2937] text-white">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-8">

        {/* Page Title and Table of Contents */}
        <section className="mb-8">
          <h1 className="text-4xl font-extrabold mb-4">About the Project</h1>
          <p className="text-2xl mb-4">
            The Lönnrot project is a free digital library dedicated to preserving 
            and sharing Finnish and Swedish public domain literary works. Our 
            mission is to ensure that Finland’s cultural heritage remains accessible for all.
          </p>
          <div className="bg-[#1f2937] shadow rounded p-4 mb-8">
            <h2 className="text-3xl font-semibold mb-2 text-white">Contents</h2>
            <ul className="list-disc list-inside space-y-2 text-white">
              <li>
                <a href="#overview" className="text-blue-400 hover:underline">
                  Project Overview
                </a>
              </li>
              <li>
                <a href="#lonnrot" className="text-blue-400 hover:underline">
                  Elias Lönnrot –The Man Behind the Kalevala
                </a>
              </li>
              <li>
                <a href="#lonnrotNet" className="text-blue-400 hover:underline">
                  Old Lönnrot.net
                </a>
              </li>
              <li>
                <a href="#projectGutenberg" className="text-blue-400 hover:underline">
                  Project Gutenberg
                </a>
              </li>
              <li>
                <a href="#dpProject" className="text-blue-400 hover:underline">
                  The DP Project
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Project Overview */}
        <section id="overview" className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="space-y-4">
              <p className="text-2xl">
                We have modernized a digital platform to preserve over 3,000 Finnish 
                and Swedish public domain texts. Our enhanced backend infrastructure, 
                built with Next.js, JavaScript, and PostgreSQL hosted on Azure, ensures 
                that rare and hard-to-find literary works are organized, accessible, 
                and interactive.
              </p>
              <p className="text-2xl">
                Collaborations with Project Gutenberg and the DP Project have further 
                enriched our collection, making it one of the most comprehensive digital 
                libraries focused on cultural heritage. Our efforts also include improved 
                search functionality and a responsive interface, setting the stage for 
                future enhancements.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Image
                src="/images/ProjectOverview.png"
                alt="Lönnrot Hero"
                width={400}
                height={400}
                className="rounded shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Elias Lönnrot */}
        <section id="lonnrot" className="mb-12 bg-[#1f2937] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">
            Elias Lönnrot –The Man Behind the Kalevala
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="flex justify-center md:justify-start">
              <Image
                src="/images/EliasLönnrotkuva.jpg"
                alt="Elias Lönnrot"
                width={400}
                height={400}
                className="rounded shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-2xl">
                Elias Lönnrot (1802–1884) was a Finnish physician, philologist, 
                and folklorist renowned for compiling the Kalevala—the Finnish 
                national epic. His lifelong commitment to gathering and preserving 
                Finland's oral traditions laid the foundation for the country’s 
                rich literary heritage and embodies the enduring power of traditional 
                folk wisdom.
              </p>
              <p className="text-2xl">
                Lönnrot once said, “The ancient songs are the mirror 
                of our soul,” highlighting how these narratives capture the 
                essence of Finnish heritage. Inspired by his legacy, our digital 
                library project strives to make historical literature accessible 
                for modern audiences, continuing his commitment to safeguard 
                culture and history for future generations.
              </p>
            </div>
          </div>
        </section>

        {/* Old Lönnrot.net */}
        <section id="lonnrotNet" className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">Old Lönnrot.net</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="space-y-4">
              <p className="text-2xl">
                Lönnrot.net was a pioneering digital platform dedicated to preserving 
                Finnish public domain literature. As one of the earliest attempts to 
                bring historical texts online, it has paved the way for subsequent 
                digital initiatives.
              </p>
              <p className="text-2xl">
                Explore its evolution and learn how early digital preservation set 
                the stage for modern platforms like ours. Visit
                <a 
                  href="http://www.lonnrot.net/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ml-1 text-blue-400 hover:underline"
                >
                  Lönnrot.net
                </a>
                for more details.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Image
                src="/images/OldLönnrot.jpg"
                alt="Old Lönnrot.net representation"
                width={400}
                height={400}
                className="rounded shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Project Gutenberg */}
        <section id="projectGutenberg" className="mb-12 bg-[#1f2937] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">Project Gutenberg</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="flex justify-center md:justify-start">
              <Image
                src="/images/Project_Gutenberg_logo.png"
                alt="Project Gutenberg Logo"
                width={400}
                height={400}
                className="rounded shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-2xl">
                Project Gutenberg is one of the largest and oldest digital libraries, 
                committed to digitizing and distributing cultural works for free. With 
                over 60,000 eBooks, it continues to serve as an invaluable resource 
                for literature lovers around the world.
              </p>
              <p className="text-2xl">
                Visit
                <a 
                  href="https://www.gutenberg.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ml-1 text-blue-400 hover:underline"
                >
                  Project Gutenberg
                </a>
                to explore their extensive collection.
              </p>
            </div>
          </div>
        </section>

        {/* The DP Project */}
        <section id="dpProject" className="mb-12 bg-[#111827] text-white p-6 rounded">
          <h2 className="text-3xl font-semibold mb-4">The DP Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="space-y-4">
              <p className="text-2xl">
                Distributed Proofreaders (DP) is a community-driven initiative that 
                works to proofread and prepare public domain texts for digitization. 
                Their collective efforts ensure that the digital editions are accurate, 
                readable, and of high quality.
              </p>
              <p className="text-2xl">
                Our collaboration with DP helps maintain consistent formatting and 
                reliability across our collection. Learn more at
                <a 
                  href="https://www.pgdp.net/c/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ml-1 text-blue-400 hover:underline"
                >
                  https://www.pgdp.net/c/
                </a>.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Image
                src="/images/dp-mark-120px.png"
                alt="DP Project Logo"
                width={400}
                height={400}
                className="rounded shadow-lg"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
