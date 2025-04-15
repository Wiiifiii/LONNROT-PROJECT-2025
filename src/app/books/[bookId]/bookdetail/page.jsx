// Summary: Displays detailed information about a specified book, including its cover image, description, reviews, and other books by the same author. Provides functionality for submitting reviews and adding the book to a reading list.

"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { FaEye, FaBookmark, FaDownload } from "react-icons/fa";
import { BsFillSendPlusFill } from "react-icons/bs";
import StarRating from "../../../components/StarRating";
import ReadingListSelector from "../../../components/ReadingListSelector";

const BookDetailsPage = () => {
  const { bookId } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [showListSelector, setShowListSelector] = useState(false);
  const [listMessage, setListMessage] = useState("");

  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/books/${bookId}`);
      const json = await res.json();
      if (json.success) {
        setBookData(json.data);
      } else {
        setError(json.error || "Error fetching book data");
      }
    } catch (err) {
      setError("Error fetching book data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) fetchBook();
  }, [bookId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewMessage("");
    if (reviewRating === 0 || reviewComment.trim() === "") {
      setReviewMessage("Please provide both a rating and a comment.");
      return;
    }
    try {
      const res = await fetch(`/api/books/${bookId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setReviewMessage(json.error || "Failed to submit review.");
      } else {
        setReviewMessage("Review submitted successfully!");
        fetchBook();
      }
    } catch (err) {
      setReviewMessage("Error submitting review: " + err.message);
    }
  };

  const handleAddToReadingList = () => {
    setListMessage("");
    setShowListSelector((prev) => !prev);
  };

  const handleListSelect = async (selectedListId) => {
    if (selectedListId === "") return;
    try {
      const res = await fetch(`/api/reading-lists/${selectedListId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: bookData.book.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setListMessage(json.error || "Failed to add book to reading list.");
      } else {
        setListMessage("Book added to your reading list successfully!");
        setShowListSelector(false);
      }
    } catch (err) {
      setListMessage("Error: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-center text-white pt-20">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-center text-red-500 pt-20">
        {error}
      </div>
    );
  }

  const { book, otherBooks } = bookData;
  const coverImage = book.cover_url || "/images/lonnrotkey.jpg";

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={coverImage}
              alt="Book Cover"
              className="w-50 max-h-40 object-cover rounded"
            />
            <div className="mt-4">
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <p className="text-xl mt-2">{book.author}</p>
              <p className="mt-4">{book.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`/books/${book.id}/read`}
                className="flex items-center gap-1 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition text-sm"
              >
                <FaEye />
                <span>View/Read</span>
              </a>
              <a
                href={book.file_url ? book.file_url : "#"}
                download
                className="flex items-center gap-1 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition text-sm"
              >
                <FaDownload className="mr-1" />
                <span>Download</span>
              </a>
              <button
                onClick={handleAddToReadingList}
                className="flex items-center gap-1 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition text-sm"
              >
                <FaBookmark />
                <span>Add to Reading List</span>
              </button>
            </div>
            {showListSelector && (
              <div className="mt-2">
                <ReadingListSelector onSelect={handleListSelect} />
                {listMessage && (
                  <p className="mt-1 text-sm text-green-400">{listMessage}</p>
                )}
              </div>
            )}
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Ratings & Reviews</h2>
            {book.reviews && book.reviews.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {book.reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-800 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {review.user?.username ||
                          review.user?.email ||
                          "Anonymous"}
                      </span>
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}
            <div className="mt-4">
              <h3 className="text-xl font-medium">Add a Review</h3>
              <StarRating rating={reviewRating} onChange={setReviewRating} />
              <form onSubmit={handleSubmitReview} className="mt-2">
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full p-2 rounded bg-gray-700"
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition flex items-center text-sm"
                >
                  <BsFillSendPlusFill className="mr-1" />
                  Write a Review
                </button>
              </form>
              {reviewMessage && (
                <p className="mt-1 text-sm text-green-400">{reviewMessage}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Other Books by {book.author}
          </h2>
          {otherBooks && otherBooks.length > 0 ? (
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
};

export default BookDetailsPage;
