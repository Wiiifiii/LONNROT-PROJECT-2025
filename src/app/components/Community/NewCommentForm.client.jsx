"use client";

import { useState, useContext } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { NotificationContext } from "@/app/components/Layout/NotificationProvider.client";
import Button from "@/app/components/UI/Button";

export default function NewCommentForm({ topicId, onSuccess }) {
  const { data: session } = useSession();
  const { showNotification } = useContext(NotificationContext);
  const [body, setBody] = useState("");

  if (!session) {
    return (
      <p className="text-center">
        <Link href="/auth/login" className="text-blue-400 hover:underline">
          Log in
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/community/${topicId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || res.statusText);
      }
      setBody("");
      showNotification("success", "Comment posted");
      onSuccess();
    } catch (err) {
      showNotification("error", `Post failed: ${err.message}`);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-2">
      <textarea
        required
        placeholder="Write your comment…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full p-3 bg-gray-700 text-white rounded h-24"
      />
      <Button
        type="submit"
        text="Post Comment"
        tooltip="Submit your comment"
      />
    </form>
  );
}
