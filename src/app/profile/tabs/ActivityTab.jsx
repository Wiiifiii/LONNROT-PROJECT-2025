"use client";
import { useEffect, useState } from "react";

export default function ActivityTab() {
  // State to store activity logs
  const [logs, setLogs] = useState(null);
  // State to store any error message
  const [error, setError] = useState(null);

  // Fetch activity logs on component mount
  useEffect(() => {
    fetch("/api/users/me/activity")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch activity logs");
        }
        return response.json();
      })
      .then(setLogs)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  // Display error message if fetch failed
  if (error) return <p className="text-red-500">Error: {error}</p>;
  // Display loading state until logs are fetched
  if (logs === null) return <p className="text-gray-300">Loading activity…</p>;
  // Display message if no activity logs exist
  if (logs.length === 0) return <p className="text-gray-300">No activity yet.</p>;

  // Render activity logs if available
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
      <ul className="space-y-2 text-gray-300">
        {logs.map((a) => (
          <li key={a.id}>
            {/* Format the timestamp and display the action */}
            [{new Date(a.timestamp).toLocaleString()}] {a.action}
          </li>
        ))}
      </ul>
    </div>
  );
}
