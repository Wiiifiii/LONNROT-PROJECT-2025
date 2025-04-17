"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ReadingListSelector from "@/app/components/ReadingListSelector";
import { FaBookOpen } from "react-icons/fa";
import { usePopup } from "@/app/context/PopupContext";
import { 
  FaArrowLeft, 
  FaInfoCircle, 
  FaBookmark 
} from "react-icons/fa";
import { MdAddTask } from "react-icons/md";
import { TbWritingSign } from "react-icons/tb";
import { SiPopos } from "react-icons/si";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function BookRead() {
  const router = useRouter();
  const { bookId } = useParams(); // gets the dynamic segment
  const [error, setError] = useState("");
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showListSelector, setShowListSelector] = useState(false);
  const [listMessage, setListMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const { openPopup } = usePopup();

  useEffect(() => {
    fetch(`/api/books/${bookId}/read-start`, { method: "POST" });

    return () => {
      fetch(`/api/books/${bookId}/read-finish`, { method: "POST" });
    };
  }, [bookId]);

  useEffect(() => {
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

          // Decode PDF
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
  }, [bookId]);

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
      openPopup(pdfUrl, book.title, book.author, book.id);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  if (error) {
    return <div className="text-red-600 text-center mt-10">Error: {error}</div>;
  }

  const iconButtonClass =
    "p-2 bg-[#374151] text-white rounded-full hover:bg-[#1f2937] transition text-sm";
  const navButtonClass =
    "flex items-center gap-1 px-3 py-1 md:px-4 md:py-2 bg-[#374151] text-white rounded-full hover:bg-[#1f2937] transition text-sm md:text-base";

  return (
    <div className="min-h-screen bg-[#111827]">
      <Navbar />
      {/* Top row navigation buttons with tooltips */}
      <div className="flex justify-between items-center px-4 mt-4 sm:mt-10 md:mt-20">
        <button
          onClick={() => router.push("/books")}
          className={navButtonClass}
          data-tip="Back to All Books"
        >
          <FaArrowLeft className="text-sm" />
          <span>All Books</span>
        </button>
        <button
          onClick={() => router.push(`/books/${book?.id}/bookdetail`)}
          className={navButtonClass}
          data-tip="View Book Details"
        >
          <FaInfoCircle className="text-sm" />
          <span>Details</span>
        </button>
      </div>

      {/* Main container */}
      <div className="flex justify-center px-4 mt-4 sm:mt-10 md:mt-20">
        <div
          className="max-w-7xl w-full bg-[#1f2937] text-white border border-gray-500 rounded-xl p-6 shadow-lg flex flex-col"
          style={{ minHeight: "80vh" }}
        >
          {/* Book header */}
          <div className="flex items-center gap-2 mb-4 bg-[#2d3748] p-3 rounded">
            <FaBookOpen className="text-blue-400" data-tip="Book Icon" />
            <h2 className="text-xl font-bold">{book?.title}</h2>
            <TbWritingSign className="ml-4" data-tip="Author Icon" />
            <p className="text-lg text-gray-300">{book?.author}</p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 mb-2">
            <button
              onClick={handleAddToReadingList}
              className={iconButtonClass}
              data-tip="Add to Reading List"
            >
              <FaBookmark className="text-sm" />
            </button>
            <button
              onClick={handleOpenPopup}
              className={iconButtonClass}
              data-tip="Pop Out PDF"
            >
              <SiPopos className="text-sm mr-1" />
              <span>Pop Out</span>
            </button>
          </div>

          {/* Reading list dropdown */}
          {showListSelector && (
            <div className="flex flex-col items-end mb-2">
              <ReadingListSelector onSelect={handleListSelect} />
              {listMessage && (
                <p className="mt-1 text-sm text-green-400">{listMessage}</p>
              )}
            </div>
          )}

          {/* Embedded PDF viewer */}
          {pdfUrl ? (
            <div className="flex-1 overflow-y-auto flex justify-center">
              <iframe
                src={pdfUrl}
                title="Book PDF"
                className="w-full h-full"
                style={{ border: "none" }}
              />
            </div>
          ) : (
            <p>No PDF available.</p>
          )}
        </div>
      </div>
      <ReactTooltip place="top" type="dark" effect="solid" />
    </div>
  );
}
