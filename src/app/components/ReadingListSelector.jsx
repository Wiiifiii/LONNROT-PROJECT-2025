"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { GiMagicGate,GiMagicTrident } from "react-icons/gi";

export default function ReadingListSelector({ bookId, onClose, onAddSuccess }) {
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
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to add book");
      }
      onAddSuccess();
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-[#111827] p-6 rounded-2xl w-[450px] space-y-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/baseImage.png')" }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">
            Add to Saga Lists
          </h2>
          <button
            onClick={onClose}
            className="text-white text-xl"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading lists…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : lists.length === 0 ? (
          <p className="text-gray-300">You don’t have any Saga Lists yet.</p>
        ) : (
          <select
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-lg"
          >
            <option value="">— Select a list —</option>
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        )}

        <div className="flex justify-between items-center space-x-4 mt-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedList}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300 ${
              !selectedList && "cursor-not-allowed opacity-50"
            }`}
          >
            <FaPlus /> Add
          </button>
        </div>

        <div className="text-center mt-4">
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
