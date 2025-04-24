"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DangerTab() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    const confirmation = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmation) return;

    try {
      const res = await fetch("/api/users/me", {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }
      setMessage("Account deleted successfully.");
      // Optionally, log the user out or redirect to a goodbye page.
      router.push("/goodbye");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4 text-white">
      <h3 className="text-xl font-semibold">Danger Zone</h3>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded"
      >
        Delete Account
      </button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
