"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function TopicList({ onTopicDeleted }) {
  const { data: session } = useSession();
  const [topics, setTopics] = useState([]);

  const fetchTopics = () =>
    fetch("/api/community/topics")
      .then((r) => r.json())
      .then(setTopics);

  useEffect(fetchTopics, []);

  const deleteTopic = async (id) => {
    if (!confirm("Delete this topic?")) return;
    await fetch(`/api/community/topics/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchTopics();
    onTopicDeleted?.();
  };

  return (
    <ul className="space-y-4">
      {topics.map((t) => (
        <li key={t.id} className="p-4 bg-gray-800 rounded flex justify-between items-center">
          <div>
            <Link href={`/community/${t.id}`} className="text-xl font-semibold">
              {t.title}
            </Link>
            <p className="text-sm text-gray-400">
              by {t.author.username} · {t.comments.length} comments
            </p>
          </div>
          {session?.user?.email === t.author.email && (
            <button
              onClick={() => deleteTopic(t.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
