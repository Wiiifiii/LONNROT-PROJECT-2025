"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Button from "../../../components/Button";
import BookCardCompact from "../../../components/BooksCardCompact";
import { SiMagic } from "react-icons/si";
import { FaEye, FaDownload, FaBookmark } from "react-icons/fa";
import { BsFillSendPlusFill } from "react-icons/bs";
import { GiMagicGate, GiMagicAxe } from "react-icons/gi";
import StarRating from "../../../components/StarRating";
import ReadingListSelector from "../../../components/ReadingListSelector";

export default function BookDetailsPage() {
  const { bookId } = useParams();
  const router = useRouter();
  const [bookData, setBookData] = useState(null);
  const [stats, setStats] = useState(null);
  const [otherStats, setOtherStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  /* ------------- fetch stats for main book ------------- */
  const loadStats = () =>
    fetch(`/api/books/${bookId}/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));

  useEffect(() => {
    if (bookId) loadStats();
  }, [bookId]);

  /* ------------- bulk‑fetch stats for otherBooks ------------- */
  useEffect(() => {
    if (!bookData?.otherBooks?.length) return;
    const ids = bookData.otherBooks.map((b) => b.id).join(",");
    fetch(`/api/books/stats?ids=${ids}`)
      .then((r) => r.json())
      .then(setOtherStats)
      .catch(() => setOtherStats({}));
  }, [bookData]);

  /* ------------- refresh after download ------------- */
  const handleDownloadClick = () => {
    setTimeout(loadStats, 1000);
  };

  /* ------------- reading list ------------- */
  const [showListSelector, setShowListSelector] = useState(false);
  const [listMessage, setListMessage] = useState("");

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
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");

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
      <div className="min-h-screen text-center text-white pt-20">
        Loading…
      </div>
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
    // Outer wrapper with the background image applied only here.
    <div
      className="min-h-screen text-white bg-cover bg-repeat bg-center"
      style={{ backgroundImage: "url('/images/LogInPage.png')" }}
    >
      <Navbar />
      {/* Container without any padding except top padding for the navbar */}
      <div className="container mx-auto bg-transparent pt-24">
        <div className="flex flex-col md:flex-row gap-8">
          {/* -------- left column -------- */}
          <div className="md:w-1/2">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt="Book cover"
                className="w-50 max-h-40 object-cover rounded"
              />
            ) : (
              <div className="w-50 h-40 flex items-center justify-center bg-gray-700 rounded">
                <GiMagicAxe className="text-white text-5xl" />
              </div>
            )}
            <h1 className="text-3xl font-bold mt-4">{book.title}</h1>
            <p className="text-xl mt-1">{book.author}</p>
            <p className="mt-4">{book.description}</p>

            {/* actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                icon={FaEye}
                text="Open the Saga"
                tooltip="Open reader"
                onClick={() => router.push(`/books/${book.id}/read`)}
                className="flex-1 justify-center"
              />
              <Button
                icon={FaDownload}
                text="Take the Sampo TXT"
                tooltip="Download original txt"
                onClick={() => {
                  window.open(
                    `/api/books/${book.id}/download?format=txt`,
                    "_blank",
                    "noopener"
                  );
                  handleDownloadClick();
                }}
                className="flex-1 justify-center"
              />
              <Button
                icon={FaDownload}
                text="Keep the Rune PDF"
                tooltip={
                  book.pdf_url
                    ? "Download generated PDF"
                    : "PDF not available yet"
                }
                onClick={(e) => {
                  if (!book.pdf_url) {
                    e.preventDefault();
                    return;
                  }
                  window.open(
                    `/api/books/${book.id}/download?format=pdf`,
                    "_blank",
                    "noopener"
                  );
                  handleDownloadClick();
                }}
                className={`flex-1 justify-center ${
                  book.pdf_url ? "" : ""
                }`}
              />
              <Button
                icon={SiMagic}
                text="Add to Saga Lists"
                tooltip="Add to your reading list"
                onClick={handleAddToReadingList}
                className="flex-1 justify-center"
              />
              <Button
                icon={GiMagicGate}
                text="To Saga Haven"
                onClick={() => router.push("/books")}
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

            {/* reading‐list selector */}
            {showListSelector && (
              <div className="mt-2">
                <ReadingListSelector onSelect={handleListSelect} />
                {listMessage && (
                  <p className="mt-1 text-sm text-green-400">
                    {listMessage}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* -------- right column (reviews) -------- */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">
              Stars & Sagas
            </h2>

            {reviews?.length ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-gray-800 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {r.user?.username ||
                          r.user?.email ||
                          "Anonymous"}
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
              <p>Empty Saga Yet.</p>
            )}

            {/* add review */}
            <h3 className="text-xl font-medium mt-6">
              Sing Your Verse
            </h3>
            <StarRating
              rating={reviewRating}
              onChange={setReviewRating}
            />
            <form onSubmit={handleSubmitReview} className="mt-2">
              <textarea
                value={reviewComment}
                onChange={(e) =>
                  setReviewComment(e.target.value)
                }
                placeholder="Write your review…"
                className="w-full p-2 rounded bg-gray-700"
              />
              <Button
                icon={BsFillSendPlusFill}
                text="Pen Your Lore"
                tooltip="Submit"
                className="mt-2"
              />
            </form>
            {reviewMessage && (
              <p className="mt-1 text-sm text-green-400">
                {reviewMessage}
              </p>
            )}
          </div>
        </div>

        {/* other books */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            More by the Bard:  {book.author}
          </h2>
          {otherBooks?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {otherBooks.map((other) => (
                <BookCardCompact
                  key={other.id}
                  book={other}
                  stats={otherStats[other.id]}
                />
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
