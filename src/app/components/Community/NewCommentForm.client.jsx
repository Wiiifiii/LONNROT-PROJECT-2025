"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NewCommentForm({ topicId, onSuccess }) {
  const { data: session } = useSession();
  const [body, setBody] = useState("");

  if (!session) {
    return (
      <p className="text-center">
        <Link href="/auth/login" className="text-blue-400">
          Log in
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/community/${topicId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",         // ← send your NextAuth cookie
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      setBody("");
      onSuccess();                   // tells the parent to re-fetch the list
    } else {
      console.error("Failed to post comment", await res.text());
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
      <button type="submit" className="px-4 py-2 bg-green-600 rounded">
        Post Comment
      </button>
    </form>
  );
}
