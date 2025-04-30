"use client";

import { useState, useEffect, useContext } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { NotificationContext } from "@/app/components/Layout/NotificationProvider.client";
import Button from "@/app/components/UI/Button";
import ConfirmDialog from "@/app/components/UI/ConfirmDialog.client";

export default function CommentList({ topicId, session, onCommentDeleted }) {
  const [comments, setComments] = useState([]);
  const { showNotification } = useContext(NotificationContext);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/community/${topicId}/comments`);
      if (!res.ok) throw new Error(res.statusText);
      setComments(await res.json());
    } catch (err) {
      showNotification("error", `Failed to load comments: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [topicId]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/community/${topicId}/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || res.statusText);
      }
      showNotification("success", "Comment deleted");
      fetchComments();
      onCommentDeleted?.();
    } catch (err) {
      showNotification("error", `Delete failed: ${err.message}`);
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState("");

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditBody(c.body);
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/api/community/${topicId}/comments/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: editBody }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || res.statusText);
      }
      showNotification("success", "Comment updated");
      setEditingId(null);
      fetchComments();
      onCommentDeleted?.();
    } catch (err) {
      showNotification("error", `Update failed: ${err.message}`);
    }
  };

  return (
    <ul className="space-y-4">
      {comments.map((c) => {
        const isAuthor = session?.user?.email === c.author.email;
        return (
          <li key={c.id} className="p-4 bg-gray-700 rounded">
            {editingId === c.id ? (
              <>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full p-2 bg-gray-600 text-white rounded"
                />
                <div className="mt-2 space-x-2">
                  <Button
                    text="Save"
                    tooltip="Save changes"
                    onClick={() => saveEdit(c.id)}
                  />
                  <Button
                    text="Cancel"
                    tooltip="Cancel editing"
                    onClick={() => setEditingId(null)}
                  />
                </div>
              </>
            ) : (
              <>
                <p>{c.body}</p>
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
                      description="This action cannot be undone."
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
