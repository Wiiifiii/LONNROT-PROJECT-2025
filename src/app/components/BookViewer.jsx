// src/app/components/BookViewer.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaListUl,
  FaInfoCircle,
  FaBook,
  FaDownload,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import Button from "./Button";
import ReadingListSelector from "./ReadingListSelector";
import Notification from "./Notification";
import Tooltip from "./Tooltip";

export default function BookViewer({ bookId, pdfUrl, txtUrl, book }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showListSelector, setShowListSelector] = useState(false);
  const [notification, setNotification] = useState(null);

  // restore last page
  useEffect(() => {
    const saved = localStorage.getItem(`page:book:${bookId}`);
    if (saved) setPage(Number(saved));
  }, [bookId]);

  // save on change
  useEffect(() => {
    localStorage.setItem(`page:book:${bookId}`, page);
  }, [bookId, page]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => p + 1);

  const handleDownload = (format) => {
    const url = format === "pdf" ? pdfUrl : txtUrl;
    if (!url) {
      setNotification({ type: "error", message: `${format.toUpperCase()} not available` });
      return;
    }
    window.open(url, "_blank", "noopener");
    fetch(`/api/books/${bookId}/stats`).catch(() => {});
    setNotification({ type: "success", message: `Download started!` });
  };

  // simple iOS detector
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  // embed URL with fragment
  const urlWithPage = `${pdfUrl}#page=${page}`;

  return (
    <div className="flex flex-col h-full relative">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}

      {/* Toolbar */}
      <div className="flex items-center bg-gray-900 text-white p-3 space-x-2 shadow">
        <Button icon={FaArrowLeft} onClick={goPrev} tooltip="Previous Page" />
        <span>Page {page}</span>
        <Button icon={FaArrowRight} onClick={goNext} tooltip="Next Page" />

        <div className="flex-1" />

        <Tooltip content="Add to Saga lists">
          <Button icon={FaListUl} onClick={() => setShowListSelector(true)} />
        </Tooltip>
        <Tooltip content="View details">
          <Button
            icon={FaInfoCircle}
            onClick={() => router.push(`/books/${bookId}/bookdetail`)}
          />
        </Tooltip>
        <Tooltip content="Back to Saga Haven">
          <Button icon={FaBook} onClick={() => router.push("/books")} />
        </Tooltip>
        <Tooltip content="Download PDF">
          <Button icon={FaDownload} onClick={() => handleDownload("pdf")} />
        </Tooltip>
      </div>

      {/* PDF display */}
      <div className="flex-1 bg-gray-800">
        {pdfUrl ? (
          isIOS ? (
            <object
              data={urlWithPage}
              type="application/pdf"
              className="w-full h-full"
            >
              <p className="p-4 text-center text-gray-400">
                Cannot display inline.{" "}
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener"
                  className="underline"
                >
                  Download PDF
                </a>
              </p>
            </object>
          ) : (
            <iframe
              src={urlWithPage}
              className="w-full h-full border-none"
              title={`${book.title} – page ${page}`}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-red-500">
            No PDF available.
          </div>
        )}
      </div>

      {/* Reading‐List Selector */}
      {showListSelector && (
        <ReadingListSelector
          bookId={bookId}
          onClose={() => setShowListSelector(false)}
          onAddSuccess={() =>
            setNotification({ type: "success", message: "Added to list!" })
          }
        />
      )}
    </div>
  );
}
