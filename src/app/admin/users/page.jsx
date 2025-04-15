// Summary: Admin Users page placeholder indicating that the users management section is under development.
"use client";
export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { FaFastBackward } from "react-icons/fa";

export default function AdminUsers() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8"></div>
      <div className="flex flex-col items-center justify-center py-20">
        <AiOutlineClockCircle size={100} className="text-gray-500 mb-4" />
        <h1 className="text-5xl font-bold mb-4">Coming Soon</h1>
        <p className="text-xl text-gray-400">
          The Admin Users page is currently under development. Stay tuned for updates!
        </p>
        <Link
          href="/admin"
          className="mt-4 flex items-center bg-[#1f2937] hover:bg-[#111827] text-white py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <FaFastBackward className="mr-2" size={18} />
          Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}