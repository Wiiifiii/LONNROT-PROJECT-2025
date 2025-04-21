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
                            Step into Kalevala’s Realm
                        </h1>
                        <p className="text-lg mb-4">
                            Tales for All, Woven by Lönnrot’s Quill – A mythical library where ancient stories breathe anew.
                        </p>
                        <p className="mb-6">
                            Projekti Lönnrot – A quest to summon Finnish and Swedish tales from the shadows, preserving their magic before they fade into the mists of time.
                        </p>
                        <p className="mb-6">
                            Here, Väinämöinen’s songs echo through the ages, offering Finnish lore to all who seek the Sampo’s wisdom.
                        </p>
                        <Link
                          href="/secrets"
                          className="inline-flex items-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-sm"
                        >
                          Unveil the Runes <FiArrowRight className="ml-2" size={20} />
                        </Link>
                    </div>
                    <div className="p-6">
                        <img src="/images/el.jpg" alt="Elias Lönnrot" className="rounded shadow-lg" />
                    </div>
                </div>
            </section>
            <section className="py-8 bg-gray-800 bg-opacity-75 text-white">
                <div className="container mx-auto p-4">
                    <h2 className="text-3xl font-semibold mb-4">Our Sacred Quest</h2>
                    <p>
                        We weave old tales into eternity, summoning their runes for all to hear. Seek deeper lore in the Kantele’s Guide, Lönnrot’s Tale, and the Sampo’s Codex.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;