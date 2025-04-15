// Summary: Home page that applies global styles, displays a hero section with a background image overlay, and renders the Hero and Navbar components.
"use client";
export const dynamic = "force-dynamic";
import './styles/globals.css';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#1e2328]">
      <div className="relative z-10 container mt-24 mx-auto px-12 py-4">
        <Hero />
        <Navbar />
      </div>
    </main>
  );
}
