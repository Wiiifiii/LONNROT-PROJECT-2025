"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/app/components/StatsCard";

export default function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/users/me/stats")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        return response.json();
      })
      .then(setStats)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!stats) {
    return <p className="text-gray-300">Loading stats…</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Your Reading Stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Books Read" value={stats.booksRead} />
        <StatsCard title="Bookmarks" value={stats.bookmarks} />
        <StatsCard title="Time Saved" value={stats.timeSaved} unit="hrs" />
      </div>
    </div>
  );
}
