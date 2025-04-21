// src/app/about/page.jsx
"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Navbar";

// import your new tabs
import RunesofAction from "./tabs/RunesofAction";
import PathsofLore      from "./tabs/PathsofLore";
import EchoesofFame from "./tabs/EchoesofFame";
import VoicesofRunes  from "./tabs/VoicesofRunes";
import LoresKeeper           from "./tabs/LoresKeeper";

export default function AboutPage() {
  const TABS = [
    "Runes of Action",
    "Paths of Lore",
    "Echoes of Fame",
    "Voices of Runes",
    "Lore’s Keeper"
  ];
  const [active, setActive] = useState(TABS[0]);

  return (
      <div
          className="min-h-screen bg-cover bg-center flex flex-col pt-16" 
     style={{ backgroundImage: "url('/images/LogInPage.png')" }}
  >
      <Navbar />
      <div className="flex flex-grow items-start justify-center mt-4">
        <div className="max-w-5xl w-full flex">
          {/* tab list */}
          <ul className="w-1/4 bg-gray-800 rounded-l-lg overflow-hidden">
            {TABS.map(tab => (
              <li key={tab}>
                <button
                  onClick={() => setActive(tab)}
                  className={`w-full px-4 py-3 text-left text-sm ${
                    active === tab
                      ? "bg-gray-700 text-white font-semibold"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
          {/* tab panel */}
          <div className="w-3/4 bg-gray-800 rounded-r-lg p-6 space-y-6 text-white">
            {active === "Runes of Action"     && <RunesofAction />}
            {active === "Paths of Lore" && <PathsofLore />}
            {active === "Echoes of Fame"   && <EchoesofFame />}
            {active === "Voices of Runes"             && <VoicesofRunes />}
            {active === "Lore’s Keeper"              && <LoresKeeper />}
          </div>
        </div>
      </div>
    </div>
  );
}
