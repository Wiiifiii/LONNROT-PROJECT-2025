"use client";

import { useState, useContext } from "react";
import { NotificationContext }  from "@/app/components/Layout/NotificationProvider.client";
import Button                   from "@/app/components/UI/Button";

export default function NewCommentForm({ topicId, onSuccess }) {
  const [body, setBody] = useState("");
  const { showNotification } = useContext(NotificationContext);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/community/topics/${topicId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
        }
      );
      if (!res.ok) throw new Error("Post failed");
      setBody("");
      showNotification("success", "Comment posted");
      onSuccess();
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-2">
      <textarea
        required
        placeholder="Write your comment…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full p-3 bg-[#1f2937] text-white rounded h-24"
      />
      <Button type="submit" text="Post Comment" />
    </form>
  );
}
