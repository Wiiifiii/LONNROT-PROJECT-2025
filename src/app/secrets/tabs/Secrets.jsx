'use client';
import React from 'react';

export default function Secrets() {
  const secrets = [
    { name: "Realm's Echo", meaning: "Dashboard", description: "View the library's living statistics: users, reads, downloads." },
    { name: "Kalevala's Gate", meaning: "Home Page", description: "Step into the beginning of your saga. Learn about the quest and the lore." },
    { name: "Saga Haven", meaning: "Bookshelf", description: "Browse the full collection of ancient sagas and tales." },
    { name: "My Saga Lists", meaning: "Reading Lists", description: "Manage your personal scrolls of chosen sagas." },
    { name: "Kantele's Guide", meaning: "About Page", description: "Discover the secrets behind the project and its creators." },
    { name: "Contact", meaning: "Contact Page", description: "Send word across the lands to reach the sages." },
    { name: "Sing the Song of Entry", meaning: "Login", description: "Enter your personal realm by singing the password rune." },
    { name: "Forgot Password", meaning: "Rune Recovery", description: "Recover a forgotten rune to reenter the library." },
    { name: "Forge Your Saga’s Account", meaning: "Create Account", description: "Craft your legend and begin your journey." },
    { name: "Wander the Kalevala's Lore", meaning: "Guest Access", description: "Explore freely without binding oaths." },
    { name: "Rune of Stars", meaning: "Your Rating", description: "Cast a rune of stars to honor or mark the saga's worth." },
    { name: "Whisper Your Saga", meaning: "Your Comment", description: "Leave a whisper behind — your thoughts on the tale." },
    { name: "Forge a New Scroll", meaning: "New List Name", description: "Craft a fresh scroll to organize your favorite sagas." },
    { name: "Rune Weaving", meaning: "Filters", description: "Weave your search by filtering the library's runes." },
    { name: "Gleaming Tomes", meaning: "Highlights", description: "Reveal sagas that shine brightest among the ancient tomes." },
    { name: "Unveil All Runes", meaning: "Show All", description: "Let all runes be seen without veil or limit." },
  ];

  return (
    <section className="p-8 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-300">Secrets of the Lönnrot Library</h1>
      <p className="text-center text-gray-400 mb-12">
        Uncover the hidden meanings behind the runes, buttons, and whispers guiding your journey.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {secrets.map((secret, index) => (
          <div key={index} className="bg-[#1f2937] rounded-lg shadow-md p-6 hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-bold text-blue-400 mb-2">{secret.name}</h2>
            <h3 className="text-md font-semibold text-gray-300 mb-2 italic">{secret.meaning}</h3>
            <p className="text-sm text-gray-400">{secret.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
