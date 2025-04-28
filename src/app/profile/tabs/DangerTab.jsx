"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DangerTab() {
  // State to store any error messages
  const [error, setError] = useState("");
  // State to store success message after deletion
  const [message, setMessage] = useState("");
  // Next.js router for navigating pages
  const router = useRouter();

  // Function to handle account deletion
  const handleDelete = async () => {
    // Ask for confirmation from the user before deletion
    const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmation) return;
    try {
      // Make a DELETE request to the user's API endpoint
      const res = await fetch("/api/users/me", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }
      // If deletion is successful, set a success message and redirect
      setMessage("Account deleted successfully.");
      router.push("/goodbye");
    } catch (err) {
      // Set an error message if the deletion fails
      setError(err.message);
    }
  };

  // Render the Danger Zone UI with delete button and any messages
  return (
    <div className="space-y-4 text-white">
      <h3 className="text-xl font-semibold">Danger Zone</h3>
      <button onClick={handleDelete} className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded">
        Delete Account
      </button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
