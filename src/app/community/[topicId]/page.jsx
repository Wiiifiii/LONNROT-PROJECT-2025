"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NotificationContext } from "@/app/components/Layout/NotificationProvider.client";
import CommentList    from "@/app/components/Community/CommentList.client";
import NewCommentForm from "@/app/components/Community/NewCommentForm.client";
import Link           from "next/link";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Button         from "@/app/components/UI/Button";
import ConfirmDialog  from "@/app/components/UI/ConfirmDialog.client";

export default function TopicPage() {
  const { topicId } = useParams();
  const router      = useRouter();
  const { data: session } = useSession();
  const { showNotification } = useContext(NotificationContext);

  const [topic, setTopic]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle]         = useState("");
  const [body, setBody]           = useState("");

  // Fetch the topic from the API
  useEffect(() => {
    setLoading(true);
    fetch(`/api/community/topics/${topicId}`)
      .then((r) => r.json())
      .then((t) => {
        setTopic(t);
        setTitle(t.title);
        setBody(t.body);
      })
      .catch((err) => showNotification("error", `Load failed: ${err.message}`))
      .finally(() => setLoading(false));
  }, [topicId, refresh, showNotification]);

  if (loading) return <p>Loading…</p>;
  if (!topic)  return <p>Topic not found.</p>;

  const isAuthor = session?.user?.email === topic.author.email;

  // Delete the topic
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/community/topics/${topicId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || res.statusText);
      }
      showNotification("success", "Topic deleted");
      router.push("/community");
    } catch (err) {
      showNotification("error", `Delete failed: ${err.message}`);
    }
  };

  // Save edits
  const handleSave = async (e) => {
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
      setIsEditing(false);
      setRefresh((r) => r + 1);
    } catch (err) {
      showNotification("error", `Update failed: ${err.message}`);
    }
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
          <div className="flex space-x-2">
            <Button type="submit" text="Save" tooltip="Save changes" />
            <Button
              type="button"
              text="Cancel"
              tooltip="Cancel"
              onClick={() => setIsEditing(false)}
            />
          </div>
        </form>
      ) : (
        <>
          <h1 className="text-3xl font-semibold">{topic.title}</h1>
          <p className="prose">{topic.body}</p>

          {isAuthor && (
            <div className="flex space-x-2">
              <Button
                icon={FiEdit2}
                tooltip="Edit topic"
                onClick={() => setIsEditing(true)}
              />
              <ConfirmDialog
                title="Delete topic?"
                description="This action cannot be undone."
                onConfirm={handleDelete}
              >
                <Button icon={FiTrash2} tooltip="Delete topic" />
              </ConfirmDialog>
            </div>
          )}
        </>
      )}

      <hr />

      <CommentList
        key={refresh}
        topicId={topicId}
        session={session}
        onCommentDeleted={() => setRefresh((r) => r + 1)}
      />

      <NewCommentForm
        topicId={topicId}
        onSuccess={() => {
          showNotification("success", "Comment posted");
          setRefresh((r) => r + 1);
        }}
      />
    </div>
  );
}
