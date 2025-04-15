"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { FaBook, FaUsers, FaCommentAlt } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="max-w-md w-full bg-gray-800 text-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Please log in to access the admin dashboard.
          </h2>
          <Link
            href="/auth/login"
            className="w-full inline-block p-3 bg-[#374151] hover:bg-[#111827] rounded-full transition text-white font-semibold text-sm"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <p className="text-red-500 text-2xl text-center">
          403 Forbidden: Admins only
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 py-8">
      <div className="relative z-10 container mt-20 mx-auto px-12">
        <Navbar />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
        <h1 className="flex justify-center items-center space-x-2 text-4xl font-extrabold text-white mb-6">
          <AiOutlineDashboard size={28} />
          <span>Admin Dashboard</span>
        </h1>
        <p className="text-center text-lg text-gray-300 mb-8">
          Welcome, <span className="font-semibold">{session.user.email}</span> (Role: {session.user.role})
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-[#1f2937] p-4 rounded-full shadow-lg hover:bg-[#111827] transition-all">
            <Link
              href="/admin/books"
              className="block text-xl text-white font-semibold text-center inline-flex items-center justify-center space-x-2 text-sm"
            >
              <FaBook size={20} />
              <span>Manage Books</span>
            </Link>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-full shadow-lg hover:bg-[#111827] transition-all">
            <Link
              href="/admin/users"
              className="block text-xl text-white font-semibold text-center inline-flex items-center justify-center space-x-2 text-sm"
            >
              <FaUsers size={20} />
              <span>Manage Users</span>
            </Link>
          </div>
          <div className="bg-[#1f2937] p-4 rounded-full shadow-lg hover:bg-[#111827] transition-all">
            <Link
              href="/admin/Reviews"
              className="block text-xl text-white font-semibold text-center inline-flex items-center justify-center space-x-2 text-sm"
            >
              <FaCommentAlt size={20} />
              <span>Manage Reviews</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
