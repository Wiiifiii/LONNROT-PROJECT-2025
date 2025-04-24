"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaPlus, FaTrash, FaEye, FaInfoCircle, FaSignInAlt } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import Button from "@/app/components/Button";
import Tooltip from "@/app/components/Tooltip";
import Notification from "@/app/components/Notification";

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
  const [activeTab, setActiveTab] = useState(null);
  const [listDetails, setListDetails] = useState({});

  useEffect(() => {
    if (status === "authenticated") fetchLists();
  }, [status, currentUserId]);

  async function fetchLists() {
    try {
      const res = await fetch("/api/reading-lists");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      const userLists = json.data.filter((l) => l.userId === Number(currentUserId));
      setLists(userLists);
      if (userLists.length && !activeTab) {
        setActiveTab(userLists[0].id);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function fetchListItems(listId) {
    try {
      const res = await fetch(`/api/reading-lists/${listId}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      setListDetails((prev) => ({ ...prev, [listId]: json.data.items }));
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (activeTab) fetchListItems(activeTab);
  }, [activeTab]);

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
      await fetchLists();
      setActiveTab(json.data.id);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleRemoveBook(listId, bookId) {
    try {
      const res = await fetch(`/api/reading-lists/${listId}/remove-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      if (!res.ok) throw new Error("Failed to remove book");
      fetchListItems(listId);
    } catch (e) {
      setError(e.message);
    }
  }

  if (status === "loading") return <p className="text-white">Loading…</p>;

  if (!session) {
    return (
      <div className="text-center text-white">
        <FiAlertCircle className="text-5xl text-yellow-400 mx-auto mb-4" />
        <p>Please sign in to manage your Saga Lists.</p>
        <Button
          icon={FaSignInAlt}
          text="Login"
          onClick={() => router.push(`/auth/login?callbackUrl=${encodeURIComponent(returnTo)}`)}
          className=""
        />
      </div>
    );
  }

  return (
    <Tooltip>
     
        <div>
          {returnTo && (
            <Button
              text="← Back to book"
              onClick={() => router.push(returnTo)}
              className=""
            />
          )}
  
          <h1 className="text-3xl font-bold mb-4 text-white">My Saga Lists</h1>
          {message && <p className="text-green-500 mb-2">{message}</p>}
          {error && <p className="text-red-400 mb-2">{error}</p>}
  
          <form onSubmit={handleCreateList} className="mb-6 flex items-center space-x-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              required
              placeholder="New list name"
              className="p-2 rounded bg-gray-800 text-white"
            />
            <Button
              type="submit"
              icon={FaPlus}
              text="Create"
              className=""
            />
          </form>
  
          <div className="border-b border-gray-700 mb-4">
            <nav className="flex flex-wrap space-x-2">
              {lists.map((list) => (
                <Button
                  key={list.id}
                  text={list.name}
                  onClick={() => setActiveTab(list.id)}
                  className=""
                />
              ))}
            </nav>
          </div>
  
          <div>
            {(listDetails[activeTab] || []).map((item) => (
              <div key={item.book.id} className="flex justify-between items-center bg-gray-800 p-3 rounded my-2">
                <span className="text-white">{item.book.title} by {item.book.author}</span>
                <div className="flex gap-2">
                  <Button
                    icon={FaEye}
                    text="Read"
                    onClick={() => router.push(`/books/${item.book.id}/read`)}
                    className=""
                  />
                  <Button
                    icon={FaInfoCircle}
                    text="Details"
                    onClick={() => router.push(`/books/${item.book.id}/bookdetail`)}
                    className=""
                  />
                  <Button
                    icon={FaTrash}
                    text="Delete"
                    onClick={() => handleRemoveBook(activeTab, item.book.id)}
                    className=""
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
    </Tooltip>
  );
}
