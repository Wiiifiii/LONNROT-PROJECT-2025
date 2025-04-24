"use client";

import { useEffect, useState } from "react";

export default function ActivityTab() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState(null);

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

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (logs === null) {
    return <p className="text-gray-300">Loading activity…</p>;
  }

  if (logs.length === 0) {
    return <p className="text-gray-300">No activity yet.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
      <ul className="space-y-2 text-gray-300">
        {logs.map((a) => (
          <li key={a.id}>
            [{new Date(a.timestamp).toLocaleString()}] {a.action}
          </li>
        ))}
      </ul>
    </div>
  );
}
