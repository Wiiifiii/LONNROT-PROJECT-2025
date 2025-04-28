
// src/app/components/BookViewer.jsx
"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaListUl, FaInfoCircle, FaBook, FaDownload, FaTimes, FaEllipsisV } from "react-icons/fa";
import Button from "./Button";
import ReadingListSelector from "../ReadingListSelector";
import Notification from "../Notification";
import Tooltip from "../Tooltip";
import { GiMagicGate,GiMagicTrident } from "react-icons/gi";

export default function BookViewer({ bookId, pdfUrl, txtUrl, book }) {
  const [showListSelector, setShowListSelector] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showReader, setShowReader] = useState(true); // Changed to true to show reader immediately
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleDownload = useCallback(
    (format) => {
      const url = format === "pdf" ? pdfUrl : txtUrl;
      if (!url) {
        setNotification({
          type: "error",
          message: `${format.toUpperCase()} not available`,
        });
        return;
      }
      window.open(url, "_blank", "noopener");
      fetch(`/api/books/${bookId}/stats`).catch(() => {});
      setNotification({
        type: "success",
        message: `${book.title} ${format.toUpperCase()} download started!`,
      });
    },
    [bookId, book, pdfUrl, txtUrl]
  );

  const handleReadClick = () => {
    setShowReader(true);
  };

  const handleCloseReader = () => {
    setShowReader(false);
    setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

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

      {/* Main content */}
      {pdfUrl && !showReader ? (
        <div className="flex-1 flex items-center justify-center bg-gray-700">
          <Button
            onClick={handleReadClick}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-semibold"
          >
            Read
          </Button>
        </div>
      ) : pdfUrl && showReader ? (
        <div className="flex-1 flex flex-col bg-[#111827]  relative">
          {/* Custom PDF Viewer Toolbar */}
          <div className="flex items-center p-2 md:p-4 bg-gray-900 text-white shadow-md">
            {/* Book Title and Author - Truncated on mobile */}
            <h2 className="text-lg md:text-xl font-semibold truncate flex-1">
              {book.title} {book.author ? `by ${book.author}` : ""}
            </h2>

            {/* Icons - Shown on desktop with tooltips, hidden on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              <Tooltip content="Add to Saga lists">
                <Button
                  icon={GiMagicTrident}
                  onClick={() => setShowListSelector(true)}
                  className="p-2 md:p-3 rounded-full bg-[#374151]/80 hover:bg-[#374151] group"
                />
              </Tooltip>
              <Tooltip content="View details">
                <Button
                  icon={FaInfoCircle}
                  onClick={() => router.push(`/books/${bookId}/bookdetail`)}
                  className="p-2 md:p-3 rounded-full bg-[#374151]/80 hover:bg-[#374151] group"
                />
              </Tooltip>
              <Tooltip content="Back to Saga Haven">
                <Button
                  icon={GiMagicGate}
                  onClick={() => router.push("/books")}
                  className="p-2 md:p-3 rounded-full bg-[#374151]/80 hover:bg-[#374151] group"
                />
              </Tooltip>
              <Tooltip content="Download PDF">
                <Button
                  icon={FaDownload}
                  onClick={() => handleDownload("pdf")}
                  className="p-2 md:p-3 rounded-full bg-[#374151]/80 hover:bg-[#374151] group"
                />
              </Tooltip>
            </div>

            {/* Mobile Menu Button - Shown on mobile, hidden on desktop */}
            <div className="md:hidden flex items-center">
              <Button
                icon={FaEllipsisV}
                onClick={toggleMenu}
                className="p-2 rounded-full bg-[#374151]/80 hover:bg-[#374151]"
              />
            </div>
          </div>

          {/* Mobile Menu - Dropdown on mobile */}
          {showMenu && (
            <div className="md:hidden absolute top-12 right-2 bg-gray-900 text-white shadow-md rounded-lg z-50">
              <div className="flex flex-col p-2 space-y-1">
                <Button
                  icon={GiMagicTrident}
                  onClick={() => {
                    setShowListSelector(true);
                    setShowMenu(false);
                  }}
                  className="p-2 flex items-center space-x-2 rounded hover:bg-gray-700"
                >
                  <span className="text-sm">Add to Saga lists</span>
                </Button>
                <Button
                  icon={FaInfoCircle}
                  onClick={() => {
                    router.push(`/books/${bookId}/bookdetail`);
                    setShowMenu(false);
                  }}
                  className="p-2 flex items-center space-x-2 rounded hover:bg-gray-700"
                >
                  <span className="text-sm">View details</span>
                </Button>
                <Button
                  icon={FaBook}
                  onClick={() => {
                    router.push("/books");
                    setShowMenu(false);
                  }}
                  className="p-2 flex items-center space-x-2 rounded hover:bg-gray-700"
                >
                  <span className="text-sm">Back to books</span>
                </Button>
                <Button
                  icon={FaDownload}
                  onClick={() => {
                    handleDownload("pdf");
                    setShowMenu(false);
                  }}
                  className="p-2 flex items-center space-x-2 rounded hover:bg-gray-700"
                >
                  <span className="text-sm">Download PDF</span>
                </Button>
              </div>
            </div>
          )}

          {/* PDF Viewer */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-none"
              title={`${book.title} PDF`}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-red-500">
          No PDF available.
        </div>
      )}

      {/* Reading List Selector */}
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