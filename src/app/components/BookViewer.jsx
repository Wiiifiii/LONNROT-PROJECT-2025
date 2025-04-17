// src/app/components/BookViewer.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import ReadingListSelector from "./ReadingListSelector";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBookmark,
  FaListUl,
  FaInfoCircle,
} from "react-icons/fa";

export default function BookViewer({ bookId, pdfUrl }) {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [showListSelector, setShowListSelector] = useState(false);

  useEffect(() => {
    const saved = parseInt(
      localStorage.getItem(`progress:book:${bookId}`),
      10
    );
    if (saved) setPageNumber(saved);
  }, [bookId]);

  const markPage = () => {
    localStorage.setItem(`progress:book:${bookId}`, pageNumber);
    alert(`Page ${pageNumber} saved`);
  };
  const goPrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const goNext = () => setPageNumber((p) => p + 1);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-wrap items-center space-x-2 bg-gray-800 p-2 rounded">
        <Button icon={FaArrowLeft} text="Prev" onClick={goPrev} />
        <span>Page {pageNumber}</span>
        <Button icon={FaArrowRight} text="Next" onClick={goNext} />
        <Button icon={FaBookmark} text="Mark" onClick={markPage} />
        <Button
          icon={FaListUl}
          text="Bookshelf"
          onClick={() => router.push("/bookshelf")}
        />
        <Button
          icon={FaInfoCircle}
          text="Details"
          onClick={() => router.push(`/books/${bookId}/bookdetail`)}
        />
        <Button
          icon={FaBookmark}
          text="Add to List"
          onClick={() => setShowListSelector((v) => !v)}
        />
      </div>

      {showListSelector && (
        <ReadingListSelector onSelect={() => setShowListSelector(false)} />
      )}

      <div className="w-full h-[calc(100vh-7rem)] bg-gray-700 rounded overflow-hidden">
 <iframe
   // use &page=… (or use #page=… for a fragment) instead of ?page=…
  src={`/api/books/${bookId}/download?format=pdf&page=${pageNumber}`}
    className="w-full h-full"
    title="PDF Viewer"
/>
      </div>
    </div>
  );
}
