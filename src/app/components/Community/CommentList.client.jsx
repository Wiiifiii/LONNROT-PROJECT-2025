"use client";
import { useEffect, useState } from "react";
import { useSession }           from "next-auth/react";

export default function CommentList({ topicId, onCommentDeleted }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);

  const fetchComments = () =>
    fetch(`/api/community/${topicId}/comments`)
      .then(r => r.json())
      .then(setComments);

  useEffect(fetchComments, [topicId]);

  // DELETE
  const deleteComment = async (id) => {
    if (!confirm("Delete this comment?")) return;
    await fetch(`/api/community/${topicId}/comments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchComments();
    onCommentDeleted?.();
  };

  // EDIT
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody]   = useState("");

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditBody(c.body);
  };
  const saveEdit = async (id) => {
    await fetch(`/api/community/${topicId}/comments/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: editBody }),
    });
    setEditingId(null);
    fetchComments();
    onCommentDeleted?.();
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
                  onChange={e => setEditBody(e.target.value)}
                  className="w-full p-2 bg-gray-600 text-white rounded"
                />
                <button
                  onClick={() => saveEdit(c.id)}
                  className="px-3 py-1 bg-green-600 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-600 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>{c.body}</p>
                <p className="text-xs text-gray-400">
                  — {c.author.username} on{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </p>
                {isAuthor && (
                  <div className="space-x-2 mt-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
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
