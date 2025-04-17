// src/app/books/[bookId]/bookdetail/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Button from "../../../components/Button";
import {
  FaEye,
  FaDownload,
  FaBookmark,
} from "react-icons/fa";
import { BsFillSendPlusFill } from "react-icons/bs";
import StarRating from "../../../components/StarRating";
import ReadingListSelector from "../../../components/ReadingListSelector";

export default function BookDetailsPage() {
  const { bookId } = useParams();
  const [bookData, setBookData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* review form */
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");

  /* reading‑list */
  const [showListSelector, setShowListSelector] = useState(false);
  const [listMessage, setListMessage] = useState("");

  /* ------------- fetch book ------------- */
  useEffect(() => {
    if (!bookId) return;
    (async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setBookData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [bookId]);

  /* ------------- fetch stats ------------- */
  const loadStats = () =>
    fetch(`/api/books/${bookId}/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));

  useEffect(() => {
    if (bookId) loadStats();
  }, [bookId]);

  /* ------------- refresh after download ------------- */
  const handleDownloadClick = () => {
    /** wait 1 s so BookInteraction row is inserted, then refresh counts */
    setTimeout(loadStats, 1000);
  };

  /* ------------- reading list ------------- */
  const handleAddToReadingList = () => {
    setShowListSelector((p) => !p);
    setListMessage("");
  };
  const handleListSelect = async (listId) => {
    if (!listId) return;
    try {
      const res = await fetch(`/api/reading-lists/${listId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to add book");
      setListMessage("Book added to your reading list!");
      setShowListSelector(false);
    } catch (err) {
      setListMessage(err.message);
    }
  };

  /* ------------- review submit ------------- */
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewMessage("");
    if (!reviewRating || !reviewComment.trim()) {
      setReviewMessage("Please provide both a rating and a comment.");
      return;
    }
    try {
      const res = await fetch(`/api/books/${bookId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to submit review");
      setReviewMessage("Review submitted successfully!");
      /* re‑append review locally */
      setBookData((b) => ({
        ...b,
        reviews: [json.data, ...b.reviews],
      }));
    } catch (err) {
      setReviewMessage(err.message);
    }
  };

  /* ------------- render states ------------- */
  if (loading)
    return (
      <div className="min-h-screen text-center text-white pt-20">Loading…</div>
    );
  if (error)
    return (
      <div className="min-h-screen text-center text-red-500 pt-20">
        {error}
      </div>
    );

  const { book, otherBooks, reviews } = bookData;
  const coverImage = book.cover_url || "/images/lonnrotkey.jpg";

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* -------- left column -------- */}
          <div className="md:w-1/2">
            <img
              src={coverImage}
              alt="Book cover"
              className="w-50 max-h-40 object-cover rounded"
            />
            <h1 className="text-3xl font-bold mt-4">{book.title}</h1>
            <p className="text-xl mt-1">{book.author}</p>
            <p className="mt-4">{book.description}</p>

            {/* actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                icon={FaEye}
                text="View / Read"
                tooltip="Open reader"
                onClick={() => (window.location.href = `/books/${book.id}/read`)}
                className="flex-1 justify-center"
              />
              <Button
                icon={FaDownload}
                text="Download TXT"
                tooltip="Download original txt"
                onClick={handleDownloadClick}
                className="flex-1 justify-center"
              />
              {/* actual link hidden behind button */}
              <a
                href={`/api/books/${book.id}/download?format=txt`}
                className="sr-only"
              >
                txt
              </a>

              <Button
                icon={FaDownload}
                text="Download PDF"
                tooltip={
                  book.pdf_url
                    ? "Download generated PDF"
                    : "PDF not available yet"
                }
                onClick={
                  book.pdf_url
                    ? handleDownloadClick
                    : (e) => e.preventDefault()
                }
                className={`flex-1 justify-center ${
                  book.pdf_url ? "" : "opacity-50 cursor-not-allowed"
                }`}
              />
              {book.pdf_url && (
                <a
                  href={`/api/books/${book.id}/download?format=pdf`}
                  className="sr-only"
                >
                  pdf
                </a>
              )}

              <Button
                icon={FaBookmark}
                text="Add to List"
                tooltip="Add to your reading list"
                onClick={handleAddToReadingList}
                className="flex-1 justify-center"
              />
            </div>

            {/* stats */}
            {stats && (
              <div className="mt-2 text-xs text-gray-400 space-x-4">
                <span>Downloads: {stats.DOWNLOAD}</span>
                <span>Reads: {stats.READ_START}</span>
              </div>
            )}

            {/* list selector */}
            {showListSelector && (
              <div className="mt-2">
                <ReadingListSelector onSelect={handleListSelect} />
                {listMessage && (
                  <p className="mt-1 text-sm text-green-400">{listMessage}</p>
                )}
              </div>
            )}
          </div>

          {/* -------- right column (reviews) -------- */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Ratings & Reviews</h2>

            {reviews?.length ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-gray-800 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {r.user?.username || r.user?.email || "Anonymous"}
                      </span>
                      <span className="text-yellow-400">
                        {"★".repeat(r.rating)}
                      </span>
                    </div>
                    <p>{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}

            {/* add review */}
            <h3 className="text-xl font-medium mt-6">Add a Review</h3>
            <StarRating rating={reviewRating} onChange={setReviewRating} />
            <form onSubmit={handleSubmitReview} className="mt-2">
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review…"
                className="w-full p-2 rounded bg-gray-700"
              />
              <Button
                icon={BsFillSendPlusFill}
                text="Write a Review"
                tooltip="Submit"
                className="mt-2"
              />
            </form>
            {reviewMessage && (
              <p className="mt-1 text-sm text-green-400">{reviewMessage}</p>
            )}
          </div>
        </div>

        {/* other books */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Other books by {book.author}
          </h2>
          {otherBooks?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {otherBooks.map((other) => (
                <a
                  key={other.id}
                  href={`/books/${other.id}`}
                  className="block p-4 bg-gray-800 rounded hover:bg-gray-700 transition text-sm"
                >
                  <h3 className="font-bold">{other.title}</h3>
                </a>
              ))}
            </div>
          ) : (
            <p>No other books found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

