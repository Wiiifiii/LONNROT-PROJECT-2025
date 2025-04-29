"use client";

import { useState } from "react";

export default function SecurityTab() {
  // State variables for current password, new password, success message, and error message
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Function to handle password change form submission
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous success message
    setError(""); // Clear previous error message
    try {
      // Send a PUT request to update the user's password
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }
      setMessage("Password changed successfully.");
      // Clear input fields after successful update
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Render the Security tab UI with password change form and any messages
  return (
    <div className="space-y-4 text-white">
      <h3 className="text-xl font-semibold">Security</h3>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        {/* Current Password Input */}
        <div>
          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 rounded bg-[#0b1c2c] text-white"
            required
          />
        </div>
        {/* New Password Input */}
        <div>
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded bg-[#0b1c2c] text-white"
            required
          />
        </div>
        {/* Submit button for changing password */}
        <button
          type="submit"
          className="flex items-center bg-[#374151] hover:bg-[#0b1c2c] text-white py-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          Change Password
        </button>
        {/* Display success or error messages */}
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
