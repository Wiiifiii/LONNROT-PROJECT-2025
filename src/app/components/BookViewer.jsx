// src/app/components/BookViewer.jsx
"use client";

import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function BookViewer({ bookId, pdfUrl, book }) {
  const layoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* — Header / Toolbar — */}
      <div className="flex flex-wrap items-center space-x-2 bg-[#111827] p-2 rounded w-full">
        {book && (
          <div className="flex items-center space-x-2 text-white flex-1">
            <span className="text-2xl font-semibold">{book.title}</span>
            <span className="text-sm text-gray-300">by {book.author}</span>
          </div>
        )}
        {/* You can add your own buttons here if you like */}
        <a
          href={`/api/books/${book.id}/download?format=pdf`}
          onClick={bumpDownload}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm"
        >
          <FaDownload /> PDF
        </a>
        <a
          href={`/api/books/${book.id}/download?format=txt`}
          onClick={bumpDownload}
          download
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm"
        >
          <FaDownload /> TXT
        </a>
      </div>

      {/* — PDF Viewer with full UI — */}
      <div className="w-full h-[calc(100vh-7rem)] bg-gray-700 rounded overflow-hidden">
        <Worker workerUrl="/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrl}
            plugins={[layoutPluginInstance]}
            // you can pass other Viewer props here if needed
          />
        </Worker>
      </div>
    </div>
  );
}
