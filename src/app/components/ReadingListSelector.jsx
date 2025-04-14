// Summary: Renders a selector for reading lists by fetching available reading lists from the API, allowing the user to select one or navigate to create a new list.

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdFormatListBulletedAdd } from "react-icons/md";

export default function ReadingListSelector({ onSelect }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch("/api/reading-lists");
        const json = await res.json();
        if (json.success) {
          setLists(json.data);
        } else {
          setError("Failed to fetch reading lists");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLists();
  }, []);

  const handleChange = (e) => {
    onSelect(e.target.value);
  };

  if (loading) return <div>Loading reading lists...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <select
        className="p-2 rounded bg-gray-700 text-white text-sm"
        onChange={handleChange}
      >
        <option value="">Select a reading list</option>
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>
      <button
        className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#374151] hover:bg-[#111827] transition duration-300 text-white font-semibold rounded-full text-sm"
        onClick={() => router.push("/my-reading-lists")}
      >
        <MdFormatListBulletedAdd />
        <span>Create New List</span>
      </button>
    </>
  );
}


