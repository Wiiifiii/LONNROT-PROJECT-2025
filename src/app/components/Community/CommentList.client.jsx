"use client";

import { useState, useEffect, useContext } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "@/app/components/UI/Button";
import ConfirmDialog from "@/app/components/UI/ConfirmDialog.client";
import { NotificationContext } from "@/app/components/Layout/NotificationProvider.client";

export default function CommentList({ topicId, session, onCommentDeleted }) {
  const [comments, setComments] = useState([]);
  const { showNotification } = useContext(NotificationContext);
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    if (!topicId) return;
    async function load() {
      try {
        const res = await fetch(
          `/api/community/topics/${topicId}/comments`
        );
        if (!res.ok) throw new Error(await res.text());
        setComments(await res.json());
      } catch (err) {
        showNotification("error", err.message);
      }
    }
    load();
  }, [topicId, showNotification]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `/api/community/topics/${topicId}/comments/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error(await res.text());
      showNotification("success", "Comment deleted");
      setComments((cs) => cs.filter((c) => c.id !== id));
      onCommentDeleted?.();
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditBody(c.body);
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(
        `/api/community/topics/${topicId}/comments/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: editBody }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      showNotification("success", "Comment updated");
      setEditingId(null);
      onCommentDeleted?.();
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  return (
    <ul className="space-y-4">
      {comments.map((c) => {
        const isAuthor = session?.user?.email === c.author.email;
        return (
          <li key={c.id} className="p-4 bg-[#1f2937] rounded">
            {editingId === c.id ? (
              <>
                <textarea
                  className="w-full p-2 bg-[#1f2937] text-white rounded"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
                <div className="mt-2 space-x-2">
                  <Button text="Save" onClick={() => saveEdit(c.id)} />
                  <Button text="Cancel" onClick={() => setEditingId(null)} />
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-100">{c.body}</p>
                <p className="text-xs text-gray-400 mt-1">
                  — {c.author.username} on{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </p>
                {isAuthor && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      icon={FiEdit2}
                      tooltip="Edit comment"
                      onClick={() => startEdit(c)}
                    />
                    <ConfirmDialog
                      title="Delete comment?"
                      description="This cannot be undone."
                      onConfirm={() => handleDelete(c.id)}
                    >
                      <Button icon={FiTrash2} tooltip="Delete comment" />
                    </ConfirmDialog>
                  </div>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
