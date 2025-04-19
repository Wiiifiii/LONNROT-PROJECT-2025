// src/app/components/ReadingListSelector.jsx
"use client";
import React, { useState, useEffect } from "react";

export default function ReadingListSelector({ bookId, onClose }) {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/reading-lists");
        const json = await res.json();
        if (res.ok && json.success) {
          setLists(json.data);
        } else {
          throw new Error(json.error || "Failed to fetch lists");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async () => {
    if (!selectedList) return;
    try {
      const res = await fetch(
        `/api/reading-lists/${selectedList}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId }),
        }
      );
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-80 space-y-4">
        <h2 className="text-white text-xl font-semibold">
          Add to Saga List
        </h2>

        {loading ? (
          <p className="text-gray-300">Loading lists…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <select
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded"
          >
            <option value="">— Select a list —</option>
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedList}
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 text-white disabled:opacity-50"
          >
            Add
          </button>
        </div>

        <div className="text-center">
          <a
            href={`/my-reading-lists?returnTo=${encodeURIComponent(
              `/books/${bookId}/read`
            )}`}
            className="text-sm text-blue-400 hover:underline"
          >
            Manage Saga Lists
          </a>
        </div>
      </div>
    </div>
  );
}
