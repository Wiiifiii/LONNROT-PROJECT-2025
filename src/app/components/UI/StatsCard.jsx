"use client";
import React from "react";

export default function StatsCard({ title, value, unit }) {
  return (
       <div className="
          bg-[#0b1c2c] bg-opacity-75 backdrop-blur-sm
          p-4 rounded-lg shadow
         "
       >
      <p className="text-3xl font-bold text-white">
        {value}{unit ? ` ${unit}` : ""}
      </p>
      <p className="text-gray-400 mt-1">{title}</p>
    </div>
  );
}
