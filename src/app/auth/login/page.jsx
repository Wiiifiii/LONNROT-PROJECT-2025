// src/app/auth/login/page.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../../components/Button"; // adjust if your path differs
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (result?.error) {
      setErrorMsg(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Left: Illustration */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/LogInPage.png"
          alt="Welcome illustration"
          fill
          className="object-cover"
        />
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-white">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 pt-6 pb-2 bg-gray-700 text-white rounded-lg border border-gray-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="username"
                className="absolute left-4 top-2 text-gray-400 text-sm transition-all 
                           peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                           peer-focus:top-2 peer-focus:text-sm"
              >
                Username
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 pt-6 pb-2 bg-gray-700 text-white rounded-lg border border-gray-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-2 text-gray-400 text-sm transition-all 
                           peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                           peer-focus:top-2 peer-focus:text-sm"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-3 text-gray-400"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Error */}
            {errorMsg && (
              <p className="text-red-500 text-center text-sm">{errorMsg}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              icon={FiLogIn}
              text="Log In"
              className="w-full justify-center"
            />
          </form>

          {/* Secondary Actions */}
          <div className="text-center mt-4">
            <Button
              onClick={() => router.push("/auth/register")}
              text="Don't have an account? Register"
              className="w-full bg-gray-700 hover:bg-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
