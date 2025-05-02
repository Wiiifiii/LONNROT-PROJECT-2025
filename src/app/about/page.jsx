// src/app/about/page.jsx
"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Layout/Navbar";

// import your new tabs
import IntroductionTab   from "./tabs/IntroductionTab";
import ProjectTab        from "./tabs/ProjectTab";
import CollaborationsTab from "./tabs/CollaborationsTab";
import DocumentationTab  from "./tabs/DocumentationTab";
import ApiTab            from "./tabs/ApiTab";

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
    <div
      className="
        min-h-screen
        bg-[url('/images/baseImage.png')]
        bg-cover bg-center
        flex flex-col pt-16
      "
    >
      <Navbar />

      <div className="flex flex-grow items-start justify-center mt-4 px-4">
        <div className="max-w-5xl w-full flex">
          {/* Tab list */}
          <ul className="
              w-1/4
              bg-[#0b1c2c] bg-opacity-75 backdrop-blur-sm
              rounded-l-lg overflow-hidden
            "
          >
            {TABS.map(tab => (
              <li key={tab}>
                <button
                  onClick={() => setActive(tab)}
                  className={`
                    w-full px-4 py-3 text-left text-sm
                    ${active === tab
                      ? "bg-[#1f2937] text-white font-semibold"
                      : "text-gray-300 hover:bg-[#1f2937] hover:bg-opacity-50"}
                  `}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab panel */}
          <div className="
              w-3/4
              bg-[#0b1c2c] bg-opacity-75 backdrop-blur-sm
              rounded-r-lg p-6 space-y-6 text-white
            "
          >
            {active === "Introduction"       && <IntroductionTab />}
            {active === "About the Project"  && <ProjectTab />}
            {active === "Collaborations"     && <CollaborationsTab />}
            {active === "Docs"               && <DocumentationTab />}
            {active === "API"                && <ApiTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
