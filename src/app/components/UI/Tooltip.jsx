// src/app/components/Tooltip.jsx

import React from "react";

export default function Tooltip({ content, position = "top", children }) {
  // Map positions to Tailwind absolute positioning classes
  const posClasses = {
    top: "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 transform -translate-x-1/2",
    left: "right-full mr-2 top-1/2 transform -translate-y-1/2",
    right: "left-full ml-2 top-1/2 transform -translate-y-1/2",
  };

  return (
    <div className="group relative inline-block">
      {children}
      {content && (
        <div
          className={`pointer-events-none absolute ${posClasses[position]} z-50 w-max max-w-xs whitespace-nowrap rounded bg-[#0b1c2c]  px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 shadow-md`}
        >
          {content}
        </div>
      )}
    </div>
  );
}