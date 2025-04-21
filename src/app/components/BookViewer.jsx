"use client";

import React, { useState, useCallback } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FaDownload, FaListUl } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import ReadingListSelector from "./ReadingListSelector";
import Notification from "./Notification";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function BookViewer({ bookId, pdfUrl, book }) {
  const [showListSelector, setShowListSelector] = useState(false);
  const [notification, setNotification] = useState(null);
  const layoutPluginInstance = defaultLayoutPlugin();

  const handleDownload = useCallback(
    (format) => {
      window.open(
        `/api/books/${bookId}/download?format=${format}`,
        "_blank",
        "noopener noreferrer"
      );
      fetch(`/api/books/${bookId}/stats`).catch(() => {});
      setNotification({
        type: "success",
        message: `${book.title} (${format.toUpperCase()}) download started!`,
      });
    },
    [bookId, book]
  );

  const handleAddSuccess = () => {
    setNotification({
      type: "success",
      message: `${book.title} added to your reading list!`,
    });
  };

  return (
    <div className="flex flex-col items-center space-y-3 px-2 sm:px-4">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}

      {/* Responsive toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full bg-[#111827] p-3 rounded space-y-3 md:space-y-0">
        <div className="text-white max-w-xs">
          <h1 className="text-xl sm:text-2xl font-bold truncate">
            {book?.title}
          </h1>
          <p className="text-sm text-gray-300 truncate">
            by {book?.author}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button
            onClick={() => handleDownload("pdf")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm text-white"
          >
            <FaDownload /> PDF
          </button>
          <button
            onClick={() => handleDownload("txt")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm text-white"
          >
            <FaDownload /> TXT
          </button>
          <button
            onClick={() => setShowListSelector(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm text-white"
          >
            <FaListUl /> Add to List
          </button>
        </div>
      </div>

      {/* Add‑to‑List modal */}
      {showListSelector && (
        <ReadingListSelector
          bookId={bookId}
          onClose={() => setShowListSelector(false)}
          onAddSuccess={handleAddSuccess}
        />
      )}

      {/* PDF Viewer */}
      <div className="w-full max-w-screen-lg flex-1 bg-gray-700 rounded overflow-hidden">
        <Worker workerUrl="/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrl}
            plugins={[layoutPluginInstance]}
            defaultScale={1}
          />
        </Worker>
      </div>
    </div>
  );
}
