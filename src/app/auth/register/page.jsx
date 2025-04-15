// Summary: Handles user registration by rendering a registration form, processing user inputs, and providing feedback upon submission.

"use client";

export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiCodeproject } from "react-icons/si";
import { FiArrowRight } from "react-icons/fi";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (formData.password !== formData.confirmPassword) {
      setMessage("Error: Passwords do not match");
      setMessageType("error");
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessageType("error");
        setMessage(`Error: ${data.error || "Registration failed"}`);
      } else {
        setMessageType("success");
        setMessage("User registered successfully! You can now log in.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage(`Request failed: ${error.message}`);
    }
  };

  const continueWithoutSigningIn = () => {
    router.push("/");
  };

  const goToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <div className="flex-shrink-0 flex items-center justify-center">
          <SiCodeproject className="text-blue-400 mr-2" size={24} />
          <Link
            href="/"
            className="text-2xl md:text-4xl font-semibold text-white hover:text-blue-400"
          >
            PROJECT LÖNNROT
          </Link>
        </div>
        <h3 className="mt-4 text-xl md:text-2xl font-semibold">
          Welcome to Joining Lönnrot
        </h3>
      </div>
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            className="w-full mb-6 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-white font-semibold text-sm"
            type="submit"
          >
            Register
          </button>
        </form>
        {message && (
          <p
            className={`text-center mt-4 ${
              messageType === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        {messageType === "success" && (
          <div className="mt-4 text-center">
            <button
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-white font-semibold text-sm"
              onClick={goToLogin}
            >
              Go to Login
            </button>
          </div>
        )}
        <div className="mt-4">
          <button
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#374151] hover:bg-[#111827] rounded-full transition duration-300 text-white font-semibold text-sm"
            onClick={continueWithoutSigningIn}
          >
            Continue without signing in
            <FiArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
