// Summary: Hero component that displays a welcome section with promotional text, a navigation link, and an "Our Mission" section.

"use client";
import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
    return (
        <div
          className="min-h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/images/LogInPage.png')" }}
        >
            <section className="py-5 bg-gray-900 bg-opacity-75">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
                    <div className="text-white p-6">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                            Welcome to Projekti Lönnrot
                        </h1>
                        <p className="text-lg mb-4">
                            Vapaita e-kirjoja kaikille – A free digital library dedicated to preserving and sharing public domain literature.
                        </p>
                        <p className="mb-6">
                            Project LÖNNROT – This school project digitizes Finnish and Swedish-language works that are in the public domain.
                            Its goal is to preserve and make accessible old literature that is hard to find and at risk of disappearing.
                        </p>
                        <p className="mb-6">
                            Projekti Lönnrot is a free digital library dedicated to preserving and sharing literary works in the public domain.
                            Our mission is to make Finnish and other literary heritage accessible to everyone.
                        </p>
                        <Link
                          href="/about"
                          className="inline-flex items-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-sm"
                        >
                          Learn More <FiArrowRight className="ml-2" size={20} />
                        </Link>
                    </div>
                    <div className="p-6">
                        <img src="/images/el.jpg" alt="Elias Lönnrot" className="rounded shadow-lg" />
                    </div>
                </div>
            </section>
            <section className="py-8 bg-gray-800 bg-opacity-75 text-white">
                <div className="container mx-auto p-4">
                    <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
                    <p>
                        Our goal is to preserve old literary works by digitizing and making them available for everyone.
                        Dive deeper into our project details by exploring the About, Deciomintaions, and API documentation pages.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;