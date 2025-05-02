"use client";

import { useState, useContext } from "react";
import { NotificationContext }  from "@/app/components/Layout/NotificationProvider.client";
import Button                   from "@/app/components/UI/Button";

export default function NewTopicForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [body, setBody]   = useState("");
  const { showNotification } = useContext(NotificationContext);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/community/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (!res.ok) throw new Error("Create failed");
      setTitle("");
      setBody("");
      showNotification("success", "Topic created");
      onSuccess();
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        required
        placeholder="Verse’s Rune"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-[#1f2937] text-white rounded"
      />
      <textarea
        required
        placeholder="Sing Your Verse’s Echo"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full p-2 bg-[#1f2937] text-white rounded h-24"
      />
      <Button type="submit" text="Create Topic" />
    </form>
  );
}
