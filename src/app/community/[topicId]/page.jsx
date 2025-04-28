// src/app/community/[topicId]/page.client.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession }          from "next-auth/react";
import CommentList             from "@/app/components/Community/CommentList.client";
import NewCommentForm          from "@/app/components/Community/NewCommentForm.client";
import Link                    from "next/link";

export default function TopicPage({ params }) {
  const { topicId }       = params;
  const { data: session } = useSession();

  // --- state
  const [topic, setTopic]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  // edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle]         = useState("");
  const [body, setBody]           = useState("");

  // --- fetch topic
  useEffect(() => {
    setLoading(true);
    fetch(`/api/community/topics/${topicId}`)
      .then((r) => r.json())
      .then((t) => {
        setTopic(t);
        setTitle(t.title);
        setBody(t.body);
      })
      .finally(() => setLoading(false));
  }, [topicId, refresh]);

  if (loading) return <p>Loading topic…</p>;
  if (!topic)  return <p>Topic not found.</p>;

  const isAuthor = session?.user?.email === topic.author.email;

  // --- topic actions ---
  const handleDelete = async () => {
    if (!confirm("Delete this topic?")) return;
    await fetch(`/api/community/topics/${topicId}`, {
      method: "DELETE",
      credentials: "include",
    });
    // go back to list
    window.location.href = "/community";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch(`/api/community/topics/${topicId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    setIsEditing(false);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <Link href="/community" className="text-blue-400 hover:underline">
        ← Back to topics
      </Link>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded h-32"
          />
          <div className="space-x-2">
            <button type="submit" className="px-4 py-2 bg-green-600 rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="text-3xl font-semibold">{topic.title}</h1>
          <p className="prose">{topic.body}</p>

          {isAuthor && (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}

      <hr />

      <CommentList
        key={refresh}
        topicId={topicId}
        onCommentDeleted={() => setRefresh((r) => r + 1)}
      />

      <NewCommentForm
        topicId={topicId}
        onSuccess={() => setRefresh((r) => r + 1)}
      />
    </div>
  );
}
