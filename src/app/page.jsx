"use client";
export const dynamic = "force-dynamic";
import './styles/globals.css';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main
      className="relative flex min-h-screen flex-col bg-cover bg-center"
      //style={{ backgroundImage: "url('/images/ep.png')" }}
    >
      <div className="relative z-10 container mt-24 mx-auto px-12 py-4">
        <Hero />
        <Navbar />
      </div>
    </main>
  );
}

