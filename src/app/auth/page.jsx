"use client";

export const dynamic = "force-dynamic";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "username") setUsername(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isRegistering) {
      if (password !== confirmPassword) {
        setMessage("Error: Passwords do not match");
        return;
      }
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(`Error: ${data.error || "Registration failed"}`);
        } else {
          setMessage("User registered successfully! You can now log in.");
        }
      } catch (error) {
        setMessage(`Request failed: ${error.message}`);
      }
    } else {
      const result = await signIn("credentials", {
        username,
        password,
        remember
      });
      if (result.error) {
        setMessage("Login failed: " + result.error);
      } else {
        router.push("/profile");
      }
    }
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setMessage("");
  };

  const continueWithoutSigningIn = () => {
    router.push("/books");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center py-12">
      <div className="max-w-md w-full bg-gray-800 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">
          {isRegistering ? "Register" : "Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleChange}
              required
            />
          )}
          <input
            className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
          />
          {isRegistering && (
            <input
              className="w-full mb-6 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          <button
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-red-400 hover:bg-gray-500 rounded-full transition duration-300 text-white font-semibold text-sm"
            type="submit"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        {message && (
          <p className="text-red-500 text-center mt-4">
            {message}
          </p>
        )}
        <div className="mt-4">
          <button
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-full transition duration-300 text-white font-semibold text-sm"
            onClick={toggleForm}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
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
