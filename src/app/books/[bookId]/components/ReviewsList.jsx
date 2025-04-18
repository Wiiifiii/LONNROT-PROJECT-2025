// Summary: Displays a list of reviews for a given book by fetching review data from the API. Handles error states and displays messages accordingly.

"use client";
import React, { useEffect, useState } from "react";

export default function ReviewsList({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/books/${bookId}/reviews`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data.data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchReviews();
  }, [bookId]);

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }
  if (!reviews.length) {
    return <div>Empty Saga Yet.</div>;
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Reviews</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {reviews.map((review) => (
          <li key={review.id} style={{ marginBottom: "1rem" }}>
            <strong>{review.user?.username || "User " + review.userId}</strong> rated{" "}
            {review.rating} star(s)
            {review.comment && (
              <>
                <br />
                <em>{review.comment}</em>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
