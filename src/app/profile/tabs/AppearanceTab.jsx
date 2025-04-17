"use client";
import { useEffect, useState } from "react";

export default function AppearanceTab() {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    const m = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.toggle("dark", m === "dark");
    setMode(m);
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
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
      >
        Switch to {mode === "dark" ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
