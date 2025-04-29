// src/app/admin/reviews/page.jsx
"use client";
export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import Navbar from "@/app/components/Layout/Navbar";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaFastBackward } from "react-icons/fa";

export default function AdminReviews() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20">
        <AiOutlineClockCircle size={100} className="text-gray-500 mb-4" />
        <h1 className="text-5xl font-bold mb-4">Coming Soon</h1>
        <p className="text-xl text-gray-400 text-center">
          The Admin Reviews page is currently under development. Stay tuned for updates!
        </p>
        <Link
          href="/admin"
          className="mt-4 inline-flex items-center bg-[#0b1c2c] hover:bg-[#0b1c2c] text-white py-2 px-6 rounded-full"
        >
          <FaFastBackward className="mr-2" size={18} />
          Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
