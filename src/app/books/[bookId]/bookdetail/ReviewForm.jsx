// app/books/[bookId]/bookdetail/ReviewForm.jsx
"use client";

import React, { useState } from "react";
import StarRating from "../../../components/StarRating";
import Notification from "../../../components/Notification";
import Button from "../../../components/Button";
import { FaPaperPlane } from "react-icons/fa";

export default function ReviewForm({ bookId, onNewReview }) {
  const [rating, setRating]     = useState(0);
  const [comment, setComment]   = useState("");
  const [notif, setNotif]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/books/${bookId}/reviews`, {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to post review");
      }

      onNewReview({
        ...json.data,
        user: { username: "You" } // or pull from your session API
      });
      setRating(0);
      setComment("");
    } catch (err) {
      setNotif({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded">
      {notif && (
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">Your Rating</label>
          <StarRating
            rating={rating}
            onChange={setRating}
          />
        </div>
        <div>
          <label className="block mb-1">Your Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white"
            rows={4}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          icon={FaPaperPlane}
          text={submitting ? "Submitting…" : "Submit Review"}
          className="self-start"
        />
      </form>
    </div>
  );
}
