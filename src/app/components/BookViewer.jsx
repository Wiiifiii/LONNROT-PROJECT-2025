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
import { IoPin } from "react-icons/io5";
import { FiBookOpen } from "react-icons/fi";
import { GiMagicGate } from "react-icons/gi";
import { SiMagic } from "react-icons/si";

export default function BookViewer({ bookId, pdfUrl, book }) {
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
    <div className="flex flex-col items-center space-y-3"> {/* Changed from space-y-4 to space-y-6 */}
      <div className="flex flex-wrap items-center space-x-2 bg-[#111827] p-2 rounded">
        {/* — Header displaying book title & author — */}
        {book && (
          <div className="flex items-center space-x-2 text-white">
            <FiBookOpen className="text-2xl" />
            <div>
              <h1 className="text-lg font-semibold">{book.title}</h1>
              <p className="text-sm text-gray-300">by {book.author}</p>
            </div>
          </div>
        )}
        {/* Existing toolbar buttons */}
        <Button icon={FaArrowLeft} text="Prev" onClick={goPrev} />
        <span>Page {pageNumber}</span>
        <Button icon={FaArrowRight} text="Next" onClick={goNext} />
        <Button icon={IoPin } text="Pin the Saga" onClick={markPage} />
        <Button
          icon={GiMagicGate}
          text="To Saga Haven"
          onClick={() => router.push("/books")}
        />
        <Button
          icon={FaInfoCircle}
          text="Seek the Lore"
          onClick={() => router.push(`/books/${bookId}/bookdetail`)}
        />
        <Button
          icon={SiMagic}
          text="Add to Saga Lists"
          onClick={() => setShowListSelector((v) => !v)}
        />
      </div>

      {showListSelector && (
        <ReadingListSelector onSelect={() => setShowListSelector(false)} />
      )}

      <div className="w-full h-[calc(100vh-7rem)] bg-gray-700 rounded overflow-hidden">
        <iframe
          src={`/api/books/${bookId}/download?format=pdf&page=${pageNumber}`}
          className="w-full h-full"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
}