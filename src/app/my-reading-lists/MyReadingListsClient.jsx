"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

import Notification from "@/app/components/UI/Notification";
import Button from "@/app/components/UI/Button";
import ConfirmDialog from "@/app/components/UI/ConfirmDialog";
import Card from "@/app/components/Books/Card";

export default function MyReadingListsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/books";

  const [lists, setLists] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [details, setDetails] = useState({});
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, listId: null, listName: "" });

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Fetch lists
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/reading-lists")
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error);
        setLists(json.data);
        if (!activeId && json.data.length) {
          setActiveId(json.data[0].id);
        }
      })
      .catch((e) => setErr(e.message));
  }, [status]);

  // Fetch items for active list
  useEffect(() => {
    if (!activeId) return;
    fetch(`/api/reading-lists/${activeId}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error);
        setDetails((d) => ({ ...d, [activeId]: json.data.items }));
      })
      .catch((e) => setErr(e.message));
  }, [activeId]);

  const createList = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setErr("");
    setMsg("");

    try {
      const res = await fetch("/api/reading-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setLists((l) => [...l, json.data]);
      setActiveId(json.data.id);
      setNewName("");
      setMsg("List created!");
    } catch (e) {
      setErr(e.message);
    } finally {
      setCreating(false);
    }
  };

  const removeBook = async (bookId) => {
    try {
      const res = await fetch(`/api/reading-lists/${activeId}/remove-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      if (!res.ok) throw new Error("Could not remove book");

      const r2 = await fetch(`/api/reading-lists/${activeId}`);
      const j2 = await r2.json();
      setDetails((d) => ({ ...d, [activeId]: j2.data.items }));
      setMsg("Book removed from list");
    } catch (e) {
      setErr(e.message);
    }
  };

  const requestDelete = (listId, listName) => {
    setConfirmDelete({ isOpen: true, listId, listName });
  };
  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, listId: null, listName: "" });
  };
  const confirmDeleteList = async () => {
    await fetch(`/api/reading-lists/${confirmDelete.listId}`, { method: "DELETE" });
    setLists((l) => l.filter((x) => x.id !== confirmDelete.listId));
    setConfirmDelete({ isOpen: false, listId: null, listName: "" });
    setActiveId(lists[0]?.id || null);
    setMsg("List deleted");
  };

  // Start inline edit
  const startEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };
  // Save inline edit
  const saveEdit = async (listId) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      const res = await fetch(`/api/reading-lists/${listId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to rename list");
      setLists((l) => l.map((item) => (item.id === listId ? { ...item, name } : item)));
      setMsg("List renamed!");
      cancelEdit();
    } catch (e) {
      setErr(e.message);
    }
  };

  if (status === "loading") return <p className="text-white">Loading…</p>;
  if (!session) {
    return (
      <div className="text-center text-white">
        <p>Please sign in to view your Saga Lists.</p>
        <Button
          text="Login"
          onClick={() =>
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(returnTo)}`)
          }
        />
      </div>
    );
  }

  const activeList = lists.find((l) => l.id === activeId);

  return (
    <>
      {msg && <Notification type="success" message={msg} onClose={() => setMsg("")} />}
      {err && <Notification type="error" message={err} onClose={() => setErr("")} />}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar of list tabs */}
        <aside className="md:w-1/4 bg-[#111827] bg-opacity-50 backdrop-blur-sm p-4 rounded-lg">
          <h2 className="mb-4 text-white font-semibold">Your Saga Lists</h2>
          <nav className="space-y-2 overflow-auto">
            {lists.length === 0 && <p className="text-gray-400 italic">No lists yet.</p>}
            {lists.map((list) => (
              <div key={list.id} className="flex items-center gap-2">
                {editingId === list.id ? (
                  <>
                    <input
                      className="flex-1 px-2 py-1 bg-gray-700 text-white rounded"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(list.id)}
                    />
                    <button
                      onClick={() => saveEdit(list.id)}
                      className="p-1 text-green-400 hover:text-green-600"
                      title="Save"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveId(list.id)}
                      className={`flex-1 text-left px-3 py-2 rounded ${
                        activeId === list.id
                          ? "bg-gray-700 text-white"
                          : "bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {list.name}
                    </button>
                    <button
                      onClick={() => startEdit(list.id, list.name)}
                      className="p-1 text-yellow-400 hover:text-yellow-600"
                      title="Rename list"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => requestDelete(list.id, list.name)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete list"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="mb-6">
            {returnTo && (
              <Button text="← Back to Saga Haven" onClick={() => router.push(returnTo)} className="mb-2" />
            )}
            {activeList && <h1 className="text-2xl font-bold text-white mt-2">{activeList.name}</h1>}
          </div>

          {/* New list form */}
          <form onSubmit={createList} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Forge a New Scroll"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              ＋
            </button>
          </form>

          {/* Grid of cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {details[activeId]?.map((item) => (
              <div key={item.id} className="relative">
                <Card book={item.book} />
                <button
                  onClick={() => removeBook(item.book.id)}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white"
                  title="Remove from list"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Delete‐list confirmation */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Delete list?"
        message={`Delete “${confirmDelete.listName}”? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteList}
        onCancel={cancelDelete}
      />
    </>
  );
}
