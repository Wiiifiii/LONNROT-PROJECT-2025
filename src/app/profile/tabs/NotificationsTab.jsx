"use client";

import { useEffect, useState } from "react";

export default function NotificationsTab() {
  // State to store notification preferences fetched from the API
  const [prefs, setPrefs] = useState(null);
  // State to store any error messages from fetching preferences
  const [error, setError] = useState(null);

  // Fetch user notification settings when component mounts
  useEffect(() => {
    fetch("/api/users/me/settings")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch settings");
        return r.json();
      })
      .then((data) => {
        // Set notification preferences from the response
        setPrefs(data.notifications);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message); // Set error message if fetch fails
      });
  }, []);

  // If there was an error fetching settings, display an error message
  if (error) return <p className="text-red-500">Error: {error}</p>;
  // If settings are still loading, display a loading message
  if (!prefs) return <p className="text-gray-300">Loading settings…</p>;

  // Function to toggle a specific notification setting
  const toggle = (field) => {
    // Create an updated preferences object with the toggled field
    const updated = { ...prefs, [field]: !prefs[field] };
    setPrefs(updated);
    // Send the updated preferences to the server
    fetch("/api/users/me/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifications: updated }),
    }).catch(console.error);
  };

  // Render the Notification Settings UI
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Notification Settings</h3>
      {/* Checkbox for Email Digest preference */}
      <label className="flex items-center gap-2 text-gray-300">
        <input type="checkbox" checked={prefs.emailDigest} onChange={() => toggle("emailDigest")} />
        Email Digest
      </label>
      {/* Checkbox for New Book Alerts preference */}
      <label className="flex items-center gap-2 text-gray-300">
        <input type="checkbox" checked={prefs.newBookAlerts} onChange={() => toggle("newBookAlerts")} />
        New‑Book Alerts
      </label>
    </div>
  );
}
