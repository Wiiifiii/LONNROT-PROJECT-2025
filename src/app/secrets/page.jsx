// src/app/about/page.jsx
"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Layout/Navbar";

// Import the tab components that show different content sections
import Secrets from "./tabs/Secrets";
import RunesofAction from "./tabs/RunesofAction";
import PathsofLore from "./tabs/PathsofLore";
import EchoesofFame from "./tabs/EchoesofFame";
import VoicesofRunes from "./tabs/VoicesofRunes";
import LoresKeeper from "./tabs/LoresKeeper";

export default function AboutPage() {
  // Define the tab names that appear in the sidebar.
  const TABS = [
    "Secrets of the Lönnrot Library",
    "Runes of Action",
    "Paths of Lore",
    "Echoes of Fame",
    "Voices of Runes",
    "Lore’s Keeper"
  ];

  // Manage which tab is currently active. The default is the first tab.
  const [active, setActive] = useState(TABS[0]);

  return (
    // Main container with a background image and minimum full screen height
    <div
      className="min-h-screen bg-cover bg-center flex flex-col pt-16" 
      style={{ backgroundImage: "url('/images/baseImage.png')" }}
    >
      {/* Render the Navbar at the top */}
      <Navbar />

      {/* Container for the content: sidebar with tabs and main content area */}
      <div className="flex flex-grow items-start justify-center mt-4">
        <div className="max-w-5xl w-full flex">
          {/* Sidebar Panel */}
          <ul className="w-1/4 bg-[#111827] rounded-l-lg overflow-hidden">
            {
              // Create a list of buttons for each tab.
              TABS.map(tab => (
                <li key={tab}>
                  <button
                    onClick={() => setActive(tab)}
                    className={`w-full px-4 py-3 text-left text-sm ${
                      // Highlight the active tab with different background and text styles.
                      active === tab
                        ? "bg-gray-700 text-white font-semibold"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                </li>
              ))
            }
          </ul>
          
          {/* Main Content Area */}
          <div className="w-3/4 bg-[#111827] rounded-r-lg p-6 space-y-6 text-white">
            {/* Render the appropriate component depending on the active tab */}
            {active === "Secrets of the Lönnrot Library" && <Secrets />}
            {active === "Runes of Action" && <RunesofAction />}
            {active === "Paths of Lore" && <PathsofLore />}
            {active === "Echoes of Fame" && <EchoesofFame />}
            {active === "Voices of Runes" && <VoicesofRunes />}
            {active === "Lore’s Keeper" && <LoresKeeper />}
          </div>
        </div>
      </div>
    </div>
  );
}
