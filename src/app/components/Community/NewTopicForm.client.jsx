"use client";

import { useState, useContext } from "react";
import { NotificationContext } from "@/app/components/Layout/NotificationProvider.client";
import Button from "@/app/components/UI/Button";

export default function NewTopicForm({ onSuccess }) {
  const { showNotification } = useContext(NotificationContext);
  const [title, setTitle] = useState("");
  const [body, setBody]   = useState("");

  const create = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/community/topics", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || res.statusText);
      }
      setTitle("");
      setBody("");
      showNotification("success", "Topic posted");
      onSuccess();
    } catch (err) {
      showNotification("error", `Post failed: ${err.message}`);
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
      <Button
        type="submit"
        text="Post Topic"
        tooltip="Create new topic"
      />
    </form>
  );
}
