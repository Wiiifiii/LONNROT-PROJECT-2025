
"use client";
// src/app/community/[topicId]/edit/page.jsx
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { NotificationContext } from "@/app/components/Layout/NotificationProvider.client";
import Button from "@/app/components/UI/Button";

export default function EditTopicPage({ params }) {
  const { topicId } = params;
  const { data: session } = useSession();
  const { showNotification } = useContext(NotificationContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch topic data and verify author
  useEffect(() => {
    async function fetchTopic() {
      setLoading(true);
      try {
        const res = await fetch(`/api/community/topics/${topicId}`);
        if (!res.ok) throw new Error("Failed to load topic");
        const data = await res.json();
        // If not the author, redirect back immediately
        if (session?.user?.email !== data.author.email) {
          showNotification("error", "You’re not authorized to edit this topic");
          return router.push(`/community/${topicId}`);
        }
        setTitle(data.title);
        setBody(data.body);
      } catch (err) {
        showNotification("error", err.message);
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchTopic();
  }, [topicId, session, router, showNotification]);

  if (loading) return <p>Loading…</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/community/topics/${topicId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || res.statusText);
      }
      showNotification("success", "Topic updated");
      router.push(`/community/${topicId}`);
    } catch (err) {
      showNotification("error", `Update failed: ${err.message}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <Link href={`/community/${topicId}`} className="text-blue-400 hover:underline">
        ← Back to topic
      </Link>

      <h1 className="text-3xl font-semibold">Edit Topic</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 bg-gray-700 text-white rounded"
          placeholder="Topic title"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="w-full p-2 bg-gray-700 text-white rounded h-32"
          placeholder="Topic body"
        />
        <div className="flex space-x-2">
          <Button type="submit" text="Save" tooltip="Save changes" />
          <Button
            type="button"
            text="Cancel"
            tooltip="Cancel editing"
            onClick={() => router.push(`/community/${topicId}`)}
          />
        </div>
      </form>
    </div>
  );
}
