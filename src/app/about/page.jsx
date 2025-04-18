// src/app/about/page.jsx
"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";

// import your new tabs
import IntroductionTab from "./tabs/IntroductionTab";
import ProjectTab      from "./tabs/ProjectTab";
import CollaborationsTab from "./tabs/CollaborationsTab";
import DocumentationTab  from "./tabs/DocumentationTab";
import ApiTab           from "./tabs/ApiTab";

export default function AboutPage() {
  const TABS = [
    "Introduction",
    "About the Project",
    "Collaborations",
    "Docs",
    "API"
  ];
  const [active, setActive] = useState(TABS[0]);

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col" style={{ backgroundImage: "url('/images/LogInPage.png')" }}>
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
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
            {active === "Introduction"     && <IntroductionTab />}
            {active === "About the Project" && <ProjectTab />}
            {active === "Collaborations"   && <CollaborationsTab />}
            {active === "Docs"             && <DocumentationTab />}
            {active === "API"              && <ApiTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
