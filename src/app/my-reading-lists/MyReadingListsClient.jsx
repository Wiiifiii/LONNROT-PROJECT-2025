// src/app/my-reading-lists/MyReadingListsClient.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function MyReadingListsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/books";

  const currentUserId = session?.user?.id;
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const [expandedListId, setExpandedListId] = useState(null);
  const [listDetails, setListDetails] = useState({});

  // Fetch only after we know the user
  useEffect(() => {
    if (status === "authenticated") fetchLists();
  }, [status, currentUserId]);

  async function fetchLists() {
    try {
      const res = await fetch("/api/reading-lists");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      setLists(json.data.filter(l => l.userId === Number(currentUserId)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleCreateList(e) {
    e.preventDefault();
    setMessage(""); setError("");
    try {
      const res = await fetch("/api/reading-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName, userId: currentUserId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      setMessage("List created successfully!");
      setNewListName("");
      // if we were called with returnTo, go back immediately
      if (returnTo) {
        return setTimeout(() => router.push(returnTo), 800);
      }
      fetchLists();
    } catch (e) {
      setError(e.message);
    }
  }

  // ... handleEditList, handleSaveList, handleDeleteList omitted for brevity ...
  // ... toggleShowItems, handleRemoveBook likewise ...

  // Loading / no session states
  if (status === "loading") return <p className="text-white">Loading…</p>;
  if (!session) {
    return (
      <div className="text-center text-white">
        <FiAlertCircle className="text-5xl text-yellow-400 mx-auto mb-4" />
        <p>Please sign in to manage your Saga Lists.</p>
        <button
          onClick={() => router.push(`/auth/login?callbackUrl=${encodeURIComponent(returnTo)}`)}
          className="mt-4 px-4 py-2 bg-[#374151] hover:bg-[#111827] rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <>
      {returnTo && (
        <button
          onClick={() => router.push(returnTo)}
          className="mb-4 px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
        >
          ← Back to book
        </button>
      )}

      <h1 className="text-3xl font-bold mb-4">My Saga Lists</h1>
      {message && <p className="text-green-500 mb-2">{message}</p>}
      {error && <p className="text-red-400 mb-2">{error}</p>}

      <form onSubmit={handleCreateList} className="mb-6 flex items-center space-x-2">
        <input
          type="text"
          value={newListName}
          onChange={e => setNewListName(e.target.value)}
          required
          placeholder="New list name"
          className="p-2 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#374151] hover:bg-[#111827] text-white rounded-full"
        >
          <FaPlus className="mr-1" /> Create
        </button>
      </form>

      {/* …render each list with edit/delete/toggle items, exactly as before… */}
    </>
  );
}
