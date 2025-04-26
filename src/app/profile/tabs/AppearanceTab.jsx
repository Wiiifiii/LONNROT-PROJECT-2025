"use client";

import { useEffect, useState } from "react";

export default function AppearanceTab() {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    const storedMode = localStorage.getItem("theme") || "dark";
    setMode(storedMode);
    document.documentElement.classList.toggle("dark", storedMode === "dark");
  }, []);

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setMode(next);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Appearance</h3>
      <button
        onClick={toggle}
        className="flex items-center bg-[#374151] hover:bg-[#111827] text-white py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"

      >
        Switch to {mode === "dark" ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
