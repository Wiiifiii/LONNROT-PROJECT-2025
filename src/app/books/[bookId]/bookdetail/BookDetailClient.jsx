"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import StarRating from "../../../components/StarRating";
import Notification from "../../../components/Notification";
import ReviewForm from "./ReviewForm";
import { SiMagic } from "react-icons/si";
import { FaEye, FaDownload, FaBookOpen } from "react-icons/fa";
import { GiMagicGate, GiMagicAxe } from "react-icons/gi";
import ReadingListSelector from "../../../components/ReadingListSelector";
import BookCover from "../../../components/BookCover";

export default function BookDetailClient({ book, otherBooks, reviews: initialReviews }) {
  const router = useRouter();

  const [reviews, setReviews] = useState(initialReviews || []);
  const [notif, setNotif] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showReadingListSelector, setShowReadingListSelector] = useState(false);

  const [stats, setStats] = useState({ DOWNLOAD: 0, READ_START: 0, READ_FINISH: 0 });

  useEffect(() => {
    fetch(`/api/books/${book.id}/stats`)
      .then((res) => res.ok ? res.json() : {})
      .then(setStats)
      .catch(() => {});
  }, [book.id]);

  const handleNewReview = (review) => {
    setReviews([review, ...reviews]);
    setNotif({ type: "success", message: "Review added!" });
  };

  return (
    <div className="container mx-auto bg-transparent pt-24">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Stars & Sagas</h2>
          <Button
            text={showForm ? "Fade" : "Carve Your Rune"}
            onClick={() => setShowForm(f => !f)}
            className="mb-4 px-4 py-2"
          />

          {notif && (
            <Notification
              type={notif.type}
              message={notif.message}
              onClose={() => setNotif(null)}
            />
          )}

          {showForm && (
            <ReviewForm
              bookId={book.id}
              onNewReview={handleNewReview}
            />
          )}

          {reviews?.length ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-[#111827]  rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">
                      {r.user?.username || r.user?.email || "Anonymous"}
                    </span>
                    <StarRating rating={r.rating} readOnly />
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Empty Saga Yet.</p>
          )}
        </div>

        <div className="md:w-1/2">
        {book.cover_url ? (
  <div className="h-40 w-36 rounded-md overflow-hidden bg-[#111827] ">
    <img
      src={book.cover_url}
      alt="Book cover"
      className="h-full w-full object-cover"
    />
  </div>
) : (
  <BookCover title={book.title} author={book.author} />
)}


          <div className="flex items-center gap-4 text-sm text-gray-300 mt-2">
            <span className="flex items-center gap-1"><FaDownload /> {stats.DOWNLOAD}</span>
            <span className="flex items-center gap-1"><FaBookOpen /> {stats.READ_START}</span>
          </div>

          <h1 className="text-3xl font-bold mt-4">{book.title}</h1>
          <p className="text-xl mt-1">{book.author}</p>
          <p className="mt-4">{book.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              icon={FaEye}
              text="Open the Saga"
              tooltip="Open reader"
              onClick={async () => {
                await fetch(`/api/books/${book.id}/read-start`, { method: 'POST' });
                await fetch(`/api/books/${book.id}/stats`)
                  .then((r) => r.json())
                  .then(setStats)
                  .catch(() => {});
                router.push(`/books/${book.id}/read`);
              }}
              className="flex-1 justify-center"
            />

            <Button
              icon={FaDownload}
              text="Keep the Sampo TXT"
              tooltip="Download original TXT"
              onClick={async () => {
                window.open(`/api/books/${book.id}/download?format=txt`, "_blank", "noopener");
                await fetch(`/api/books/${book.id}/stats`)
                  .then((r) => r.json())
                  .then(setStats)
                  .catch(() => {});
              }}
              className="flex-1 justify-center"
            />

            <Button
              icon={FaDownload}
              text="Keep the Rune PDF"
              tooltip={book.pdf_url ? "Download generated PDF" : "PDF not available yet"}
              onClick={async () => {
                window.open(`/api/books/${book.id}/download?format=pdf`, "_blank", "noopener");
                await fetch(`/api/books/${book.id}/stats`)
                  .then((r) => r.json())
                  .then(setStats)
                  .catch(() => {});
              }}
              className="flex-1 justify-center"
            />

            <Button
              icon={SiMagic}
              text="Add to Saga lists"
              tooltip="Add to your reading list"
              onClick={() => setShowReadingListSelector(true)}
              className="flex-1 justify-center"
            />
            <Button
              icon={GiMagicGate}
              text="To Saga Haven"
              tooltip="Back to all books"
              onClick={() => router.push("/books")}
              className="flex-1 justify-center"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          More by the Bard: {book.author}
        </h2>
        {otherBooks?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {otherBooks.map((other) => (
              <Card key={other.id} book={other} stats={{}} />
            ))}
          </div>
        ) : (
          <p>No other books found.</p>
        )}
      </div>

      {showReadingListSelector && (
        <ReadingListSelector
          bookId={book.id}
          onClose={() => setShowReadingListSelector(false)}
          onAddSuccess={() => {
            console.log("Book added to the reading list successfully");
          }}
        />
      )}
    </div>
  );
}
