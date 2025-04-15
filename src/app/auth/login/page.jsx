
// Summary: Handles user login using NextAuth credentials provider. On successful login, the user is redirected to the home page.
"use client";

export const dynamic = "force-dynamic";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FiArrowRight, FiUserPlus, FiLogIn } from "react-icons/fi";
import { SiCodeproject } from "react-icons/si";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.ok) {
      router.push("/");
    } else {
      console.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="mb-8">
        <div className="flex-shrink-0 flex items-center">
          <SiCodeproject className="text-blue-400 mr-2" size={24} />
          <Link
            href="/"
            className="text-2xl md:text-4xl font-semibold text-white hover:text-blue-400"
          >
            PROJECT LÖNNROT
          </Link>
        </div>
      </div>
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full mb-6 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-white font-semibold text-sm"
            type="submit"
          >
            <FiLogIn className="mr-2" size={18} />
            Login
          </button>
        </form>
      </div>
      <div className="mt-6 space-y-4">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-white font-semibold text-sm"
        >
          Continue without signing in <FiArrowRight className="ml-2" size={20} />
        </Link>
        <Link
          href="/auth/register"
          className="inline-flex items-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-white font-semibold text-sm"
        >
          Create Account <FiUserPlus className="ml-2" size={20} />
        </Link>
      </div>
    </div>
  );
}
