// Summary: Client-rendered page for managing a user's reading lists. It provides functionality to create, edit, delete, and view reading list items while handling session state and global messages.

"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar";
import { FiAlertCircle } from "react-icons/fi";
import { FaPlus, FaTrash, FaEdit, FaChevronDown, FaChevronUp, FaSave, FaTimes } from "react-icons/fa";

export default function MyReadingListsPage() {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const [expandedListId, setExpandedListId] = useState(null);
  const [listDetails, setListDetails] = useState({});

  const fetchLists = async () => {
    try {
      const res = await fetch("/api/reading-lists");
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to fetch reading lists");
      } else {
        const numericUserId = Number(currentUserId);
        const userLists = data.data.filter((list) => list.userId === numericUserId);
        setLists(userLists);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && currentUserId) {
      fetchLists();
    }
  }, [status, currentUserId]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/reading-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName, userId: currentUserId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to create list");
      } else {
        setMessage("List created successfully!");
        setNewListName("");
        fetchLists();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditList = (list) => {
    setEditingListId(list.id);
    setEditingListName(list.name);
    setMessage("");
    setError("");
  };

  const handleSaveList = async (listId) => {
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/reading-lists/${listId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingListName }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to update list");
      } else {
        setMessage("List updated successfully!");
        setEditingListId(null);
        setEditingListName("");
        fetchLists();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingListId(null);
    setEditingListName("");
  };

  const handleDeleteList = async (listId) => {
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/reading-lists/${listId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to delete list");
      } else {
        setMessage("List deleted successfully!");
        if (expandedListId === listId) {
          setExpandedListId(null);
          setListDetails({});
        }
        fetchLists();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleShowItems = async (listId) => {
    setMessage("");
    setError("");
    if (expandedListId === listId) {
      setExpandedListId(null);
      setListDetails({});
    } else {
      try {
        const res = await fetch(`/api/reading-lists/${listId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || "Failed to fetch list details");
        } else {
          setExpandedListId(listId);
          setListDetails((prev) => ({ ...prev, [listId]: data.data }));
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (status === "loading") {
    return <p className="text-white p-4">Loading session...</p>;
  }
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded shadow-md text-center">
          <div className="flex justify-center mb-4">
            <FiAlertCircle className="text-5xl text-yellow-400" />
          </div>
          <h1 className="text-3xl text-white font-bold mb-2">Oops!</h1>
          <p className="text-white mb-6">
            It seems you're not signed in. Sign in to manage your reading lists, or continue browsing without an account.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/auth/login"
              className="px-4 py-2 bg-[#374151] hover:bg-[#111827] text-white rounded transition text-sm"
            >
              Login
            </a>
            <a
              href="/books"
              className="px-4 py-2 bg-[#374151] hover:bg-[#111827] text-white rounded transition text-sm"
            >
              Continue Browsing
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/LogInPage.png')" }}
    >
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-3xl font-bold mb-4">My Saga Lists</h1>
        {message && <p className="text-green-500 mb-2">{message}</p>}
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <form onSubmit={handleCreateList} className="mb-6 flex items-center space-x-2">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            required
            className="p-2 rounded bg-gray-800 text-white focus:outline-none"
            placeholder="New list name"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#374151] hover:bg-[#111827] text-white rounded-full transition duration-300 flex items-center text-sm"
          >
            <FaPlus className="mr-1" />
            Create
          </button>
        </form>
        {lists.length === 0 ? (
          <p>No reading lists found.</p>
        ) : (
          <div className="space-y-4">
            {lists.map((list) => (
              <div key={list.id} className="border border-gray-700 p-4 rounded">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  {editingListId === list.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editingListName}
                        onChange={(e) => setEditingListName(e.target.value)}
                        className="p-2 rounded bg-gray-800 text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveList(list.id)}
                        className="px-3 py-2 bg-[#374151] hover:bg-[#111827] text-white rounded-full transition duration-300 flex items-center text-sm"
                      >
                        <FaSave className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-2 bg-[#374151] hover:bg-[#111827] text-white rounded-full transition duration-300 flex items-center text-sm"
                      >
                        <FaTimes className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">{list.name}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleEditList(list)}
                          className="px-3 py-2 bg-[#374151] hover:bg-[#111827] text-white rounded-full transition duration-300 flex items-center text-sm"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteList(list.id)}
                          className="px-3 py-2 bg-[#374151] hover:bg-[#111827] text-white rounded-full transition duration-300 flex items-center text-sm"
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </button>
                        <button
                          onClick={() => toggleShowItems(list.id)}
                          className="px-3 py-2 bg-[#374151] hover:bg-[#111827] text-white rounded-full transition duration-300 flex items-center text-sm"
                        >
                          {expandedListId === list.id ? (
                            <>
                              <FaChevronUp className="mr-1" />
                              Hide Items
                            </>
                          ) : (
                            <>
                              <FaChevronDown className="mr-1" />
                              Show Items
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {expandedListId === list.id &&
                  listDetails[list.id] &&
                  listDetails[list.id].items && (
                    <ul className="list-none mt-4">
                      {listDetails[list.id].items.length === 0 ? (
                        <li>No books in this list.</li>
                      ) : (
                        listDetails[list.id].items.map((item) => (
                          <li key={item.id} className="flex justify-between items-center mb-2">
                            <span>
                              {item.book
                                ? `${item.book.title} by ${item.book.author}`
                                : "Book details not available"}
                            </span>
                            <button
                              onClick={() => handleRemoveBook(list.id, item.bookId)}
                              className="px-2 py-1 bg-[#374151] hover:bg-[#111827] text-white rounded-full transition duration-300 flex items-center text-sm"
                            >
                              <FaTrash className="mr-1" />
                              Remove
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}