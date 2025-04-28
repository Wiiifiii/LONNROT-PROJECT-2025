"use client";
import { useEffect, useState } from "react";
import StatsCard from "@/app/components/UI/StatsCard";

export default function OverviewTab() {
  // State to hold reading stats fetched from the API
  const [stats, setStats] = useState(null);
  // State to hold any error messages
  const [error, setError] = useState(null);

  // Fetch reading stats when the component mounts
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

  // If there's an error, display it
  if (error) return <p className="text-red-500">Error: {error}</p>;
  // If stats have not yet loaded, show a loading message
  if (!stats) return <p className="text-gray-300">Loading stats…</p>;

  // Render the user's reading stats
  return (
    <div className="space-y-4">
      {/* Section heading */}
      <h3 className="text-xl font-semibold text-white">Your Reading Stats</h3>
      {/* Stats grid: Books Read, Bookmarks, and Time Saved */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Books Read" value={stats.booksRead} />
        <StatsCard title="Bookmarks" value={stats.bookmarks} />
        <StatsCard title="Time Saved" value={stats.timeSaved} unit="hrs" />
      </div>
    </div>
  );
}
