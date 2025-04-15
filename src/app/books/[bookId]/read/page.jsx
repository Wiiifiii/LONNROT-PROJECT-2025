"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ReadingListSelector from "@/app/components/ReadingListSelector";
import { usePopup } from "@/app/context/PopupContext";
import {
  FaBookOpen,
  FaRegBookmark,
  FaArrowLeft,
  FaBookmark,
  FaInfoCircle,
} from "react-icons/fa";
import { TbWritingSign } from "react-icons/tb";

export default function BookRead() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showListSelector, setShowListSelector] = useState(false);
  const [listMessage, setListMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const { openPopup } = usePopup();

  useEffect(() => {
    const reg = /\/books\/(\d+)\//;
    const match = reg.exec(window.location.href);
    const bookId = match ? match[1] : null;
    if (!bookId) {
      setError("Failed to obtain book ID from the URL");
      setLoading(false);
      return;
    }
    fetch(`/api/books/${bookId}/extract`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const thisBook = data.book;
          setBook(thisBook);

          // decode PDF
          const byteCharacters = atob(data.pdfBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } else {
          setError("Failed to fetch book data");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching book data: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleAddToReadingList = () => {
    setListMessage("");
    setShowListSelector((prev) => !prev);
  };

  const handleListSelect = async (selectedListId) => {
    if (!selectedListId || !book?.id) return;
    try {
      const res = await fetch(`/api/reading-lists/${selectedListId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id }),
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

  const handleOpenPopup = () => {
    if (pdfUrl && book) {
      // pass the correct data
      openPopup(pdfUrl, book.title, book.author, book.id);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-600 text-center mt-10">
        Error: {error}
      </div>
    );
  }

  const iconButtonClass =
    "p-2 bg-[#374151] text-white rounded-full hover:bg-[#1f2937] transition text-sm";
  const navButtonClass =
    "flex items-center gap-1 px-3 py-1 bg-[#374151] text-white rounded-full hover:bg-[#1f2937] transition text-sm";

  return (
    <div className="min-h-screen bg-[#111827]">
      <Navbar />
      {/* Optional top row with back button */}
      <div className="flex justify-between items-center px-4 mt-20">
        <button onClick={() => router.push("/books")} className={navButtonClass}>
          <FaArrowLeft className="text-sm" />
          <span>All Books</span>
        </button>
        <button
          onClick={() => router.push(`/books/${book?.id}`)}
          className={navButtonClass}
        >
          <FaInfoCircle className="text-sm" />
          <span>Details</span>
        </button>
      </div>

      {/* main container */}
      <div className="flex justify-center px-4 mt-6">
        <div
          className="max-w-7xl w-full bg-[#1f2937] text-white border border-gray-500 rounded-xl p-6 shadow-lg flex flex-col"
          style={{ minHeight: "80vh" }}
        >
          {/* Book title & author header inside the container */}
          <div className="flex items-center gap-2 mb-4 bg-[#2d3748] p-3 rounded">
            <FaBookOpen className="text-blue-400" />
            <h2 className="text-xl font-bold">
              {book?.title}
            </h2>
            <TbWritingSign className="ml-4" />
            <p className="text-lg text-gray-300">
              {book?.author}
            </p>
          </div>

          {/* top row with 2 action buttons */}
          <div className="flex justify-end gap-2 mb-2">
            <button onClick={handleAddToReadingList} className={iconButtonClass}>
              <FaBookmark className="text-sm" />
            </button>
            <button
              onClick={handleOpenPopup}
              className={iconButtonClass}
              title="Pop Out PDF"
            >
              Pop Out
            </button>
          </div>

          {/* reading list dropdown */}
          {showListSelector && (
            <div className="flex flex-col items-end mb-2">
              <ReadingListSelector onSelect={handleListSelect} />
              {listMessage && (
                <p className="mt-1 text-sm text-green-400">{listMessage}</p>
              )}
            </div>
          )}

          {/* embedded PDF */}
          {pdfUrl ? (
            <div className="flex-1 overflow-y-auto">
              <iframe
                src={pdfUrl}
                title="Book PDF"
                className="w-full"
                style={{ minHeight: "70vh", border: "none" }}
              />
            </div>
          ) : (
            <p>No PDF available.</p>
          )}
        </div>
      </div>
    </div>
  );
}



