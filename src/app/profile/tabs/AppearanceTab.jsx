// "use client";
// import { useEffect, useState } from "react";

// export default function AppearanceTab() {
//   // State to manage the current theme mode
//   const [mode, setMode] = useState("dark");

//   // On component mount, read the stored theme from localStorage and update the HTML document class
//   useEffect(() => {
//     const storedMode = localStorage.getItem("theme") || "dark";
//     setMode(storedMode);
//     document.documentElement.classList.toggle("dark", storedMode === "dark");
//   }, []);

//   // Toggle function to switch between dark and light modes
//   const toggle = () => {
//     const next = mode === "dark" ? "light" : "dark";
//     localStorage.setItem("theme", next);
//     document.documentElement.classList.toggle("dark", next === "dark");
//     setMode(next);
//   };

//   return (
//     <div className="space-y-4">
//       {/* Section heading */}
//       <h3 className="text-xl font-semibold text-white">Appearance</h3>
//       {/* Button to toggle theme mode */}
//       <button
//         onClick={toggle}
//         className="flex items-center bg-[#374151] hover:bg-[#111827] text-white py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//       >
//         Switch to {mode === "dark" ? "Light" : "Dark"} Mode
//       </button>
//     </div>
//   );
// }

"use client";


import ComingSoon from "@/app/components/ComingSoon";

export default function FooBarPage() {
  return <ComingSoon featureName="Foo / Bar" />;
}