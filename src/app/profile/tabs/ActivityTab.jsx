// src/app/profile/tabs/ActivityTab.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

const actionLabels = {
  DOWNLOAD:    "Downloaded",
  READ_START:  "Started reading",
  READ_FINISH: "Finished reading",
  REVIEW:      "Added a review",
};

export default function ActivityTab() {
  const [logs, setLogs]   = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/users/me/activity")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch activity");
        return res.json();
      })
      .then(setLogs)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  // GROUP identical action/book pairs into one entry with a count
  const grouped = useMemo(() => {
    if (!Array.isArray(logs)) return [];
    const map = {};
    logs.forEach((log) => {
      const key = `${log.action}-${log.bookId}`;
      if (!map[key]) {
        map[key] = { ...log, count: 0 };
      }
      map[key].count++;
      // always keep the latest timestamp
      if (log.timestamp > map[key].timestamp) {
        map[key].timestamp = log.timestamp;
      }
    });
    // sort by timestamp descending
    return Object.values(map).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [logs]);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (logs === null) return <p className="text-gray-300">Loading activity…</p>;
  if (logs.length === 0) return <p className="text-gray-300">No activity yet.</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
      <ul className="space-y-2 text-gray-300">
        {grouped.map((log) => (
          <li key={`${log.action}-${log.bookId}`}>
            [{new Date(log.timestamp).toLocaleString()}]{" "}
            {actionLabels[log.action] || log.action}{" "}
            <Link
              href={`/books/${log.bookId}/bookdetail`}
              className="underline hover:text-white"
            >
              Book #{log.bookId}
            </Link>
            {log.count > 1 && (
              <span className="ml-1 text-sm text-gray-400">
                (×{log.count})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
