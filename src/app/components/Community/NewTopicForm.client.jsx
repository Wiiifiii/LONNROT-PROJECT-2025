"use client";
import { useState } from "react";

export default function NewTopicForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const create = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/community/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    if (res.ok) {
      setTitle("");
      setBody("");
      onSuccess();
    }
  };
  return (
    <form onSubmit={create} className="space-y-2">
      <input
        required
        placeholder="Topic title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-gray-700 text-white rounded"
      />
      <textarea
        required
        placeholder="What’s on your mind?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full p-2 bg-gray-700 text-white rounded h-24"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 rounded">
        Post Topic
      </button>
    </form>
  );
}
