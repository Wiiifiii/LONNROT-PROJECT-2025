"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Notification from "@/app/components/Notification";
import NewListForm  from "@/app/components/NewListForm";
import SidebarTabs   from "@/app/components/SidebarTabs";
import ListGrid      from "@/app/components/ListGrid";
import Button        from "@/app/components/Button";
import ConfirmDialog from "@/app/components/ConfirmDialog";

export default function MyReadingListsClient() {
  const { data: session, status } = useSession();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const returnTo     = searchParams.get("returnTo") || "/books";
  const userId       = session?.user?.id;

  const [lists,      setLists]    = useState([]);
  const [activeId,   setActiveId] = useState(null);
  const [details,    setDetails]  = useState({});
  const [newName,    setNewName]  = useState("");
  const [creating,   setCreating] = useState(false);
  const [msg,        setMsg]      = useState("");
  const [err,        setErr]      = useState("");
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    listId: null,
    listName: ""
  });

  // Fetch all lists for the user
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/reading-lists")
      .then(r => r.json())
      .then(json => {
        if (!json.success) throw new Error(json.error);
        const mine = json.data.filter(l => l.userId === +userId);
        setLists(mine);
        if (!activeId && mine.length) setActiveId(mine[0].id);
      })
      .catch(e => setErr(e.message));
  }, [status]);

  // Fetch items for the active list
  useEffect(() => {
    if (!activeId) return;
    fetch(`/api/reading-lists/${activeId}`)
      .then(r => r.json())
      .then(json => {
        if (!json.success) throw new Error(json.error);
        setDetails(d => ({ ...d, [activeId]: json.data.items }));
      })
      .catch(e => setErr(e.message));
  }, [activeId]);

  // Create a new list
  const createList = async e => {
    e.preventDefault();
    setCreating(true);
    setErr("");
    setMsg("");

    try {
      const res  = await fetch("/api/reading-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, userId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setLists(l => [...l, json.data]);
      setActiveId(json.data.id);
      setNewName("");
      setMsg("List created!");
    } catch (e) {
      setErr(e.message);
    } finally {
      setCreating(false);
    }
  };

  // Remove a book from the active list
  const removeBook = async bookId => {
    try {
      const res = await fetch(
        `/api/reading-lists/${activeId}/remove-book`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId }),
        }
      );
      if (!res.ok) throw new Error("Could not remove book");
      // re-fetch details
      const r2 = await fetch(`/api/reading-lists/${activeId}`);
      const j2 = await r2.json();
      setDetails(d => ({ ...d, [activeId]: j2.data.items }));
    } catch (e) {
      setErr(e.message);
    }
  };

  // Add this renameList function
  const renameList = async (listId, newName) => {
    try {
      const res = await fetch(`/api/reading-lists/${listId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setLists(prev =>
        prev.map(list => (list.id === listId ? { ...list, name: newName } : list))
      );
      setMsg("List renamed!");
    } catch (error) {
      setErr(error.message);
    }
  };

  // Handlers for read/details buttons
  const goRead    = id => router.push(`/books/${id}/read`);
  const goDetails = id => router.push(`/books/${id}/bookdetail`);

  // actual deleteList() hits the API
  const deleteList = async listId => {
    try {
      const res  = await fetch(`/api/reading-lists/${listId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setLists(l => l.filter(x => x.id !== listId));
      setMsg("List Unsing the Rune!");
      // adjust active tab
      if (activeId === listId) {
        const rem = lists.filter(x => x.id !== listId);
        setActiveId(rem[0]?.id || null);
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  // open dialog
  const requestDelete = (listId, listName) => {
    setConfirmDelete({ isOpen: true, listId, listName });
  };

  // cancel dialog
  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, listId: null, listName: "" });
  };

  // when user confirms
  const confirmDeleteList = async () => {
    await deleteList(confirmDelete.listId);
    cancelDelete();
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

  return (
    <>
      {msg && <Notification type="success" message={msg} onClose={() => setMsg("")} />}
      {err && <Notification type="error"   message={err} onClose={() => setErr("")} />}

      <div className="flex flex-col md:flex-row min-h-[60vh]">
        <SidebarTabs
          lists={lists}
          activeId={activeId}
          onChange={setActiveId}
          onRename={renameList}
          onDeleteRequested={requestDelete}
        />

        <main className="w-full md:w-3/4 p-4">
          <div className="mb-6">
            {returnTo && (
              <Button
                text="← Back to book"
                onClick={() => router.push(returnTo)}
              />
            )}
            <h1 className="text-2xl font-bold text-white mt-4">My Saga Lists</h1>
          </div>

          <NewListForm
            value={newName}
            onChange={setNewName}
            onSubmit={createList}
            loading={creating}
          />

          <ListGrid
            items={details[activeId] || []}
            onRead={goRead}
            onDetails={goDetails}
            onRemove={removeBook}
          />
        </main>
      </div>

      {/* globally render our confirmation modal */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Delete list?"
        message={`Delete “${confirmDelete.listName}”? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Fade the Song"
        onConfirm={confirmDeleteList}
        onCancel={cancelDelete}
      />
    </>
  );
}
