// src/app/components/BookViewer.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

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

// tell pdfjs where its worker lives
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function BookViewer({ bookId, pdfUrl, txtUrl, book }) {
  const router = useRouter();

  // page state + persist
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem(`page:book:${bookId}`);
    if (saved) setPage(Number(saved));
  }, [bookId]);
  useEffect(() => {
    localStorage.setItem(`page:book:${bookId}`, page);
  }, [bookId, page]);

  // fetch PDF blob to hand to React-PDF
  const [pdfData, setPdfData] = useState(null);
  const [pdfError, setPdfError] = useState(false);
  useEffect(() => {
    if (!pdfUrl) return;
    fetch(pdfUrl)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.blob();
      })
      .then((blob) => {
        if (blob.type !== "application/pdf") throw new Error("not pdf");
        setPdfData(blob);
        setPdfError(false);
      })
      .catch(() => {
        setPdfData(null);
        setPdfError(true);
      });
  }, [pdfUrl]);

  // toolbar buttons
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) =>
    numPages ? Math.min(numPages, p + 1) : p + 1
  );
  const bumpStat = useCallback((format) => {
    const url = format === "pdf" ? pdfUrl : txtUrl;
    if (!url) {
      notify("error", `${format.toUpperCase()} not available`);
      return;
    }
    window.open(url, "_blank");
    fetch(`/api/books/${bookId}/stats`).catch(() => {});
    notify("success", `Download started ✔`);
  }, [bookId, pdfUrl, txtUrl]);
  const notify = (type, message) => setNotification({ type, message });

  // reading-list modal
  const [showListSelector, setShowListSelector] = useState(false);
  const [notification, setNotification] = useState(null);

  // fallback detection
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  // PDF fragment to jump to page
  const urlWithFragment = `${pdfUrl}#page=${page}`;

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={2500}
        />
      )}

      {/* ————— Toolbar (always visible) ————— */}
      <div className="sticky top-0 z-20 flex items-center bg-gray-900 text-white p-3 space-x-2 shadow">
        <Button icon={FaArrowLeft} onClick={goPrev} tooltip="Prev page" />
        <span className="font-medium">
          {page}{numPages ? ` / ${numPages}` : ""}
        </span>
        <Button icon={FaArrowRight} onClick={goNext} tooltip="Next page" />

        <div className="flex-1 pl-4">
          <h2 className="text-lg md:text-xl font-semibold truncate">
            {book.title} {book.author && `by ${book.author}`}
          </h2>
        </div>

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
          <Button icon={FaDownload} onClick={() => bumpStat("pdf")} />
        </Tooltip>
      </div>

      {/* ————— PDF / fallback embed ————— */}
      <div className="flex-1 overflow-auto">
        {pdfData && !pdfError ? (
          <Document
            file={pdfData}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setPdfError(true)}
            loading={
              <div className="text-center text-gray-400 mt-4">
                Rendering PDF…
              </div>
            }
            className="p-4 flex flex-col items-center"
          >
            {Array.from({ length: numPages }).map((_, idx) => (
              <Page
                key={idx}
                pageNumber={idx + 1}
                width={Math.min(800, window.innerWidth - 32)}
                className="shadow-lg mb-6"
              />
            ))}
          </Document>
        ) : pdfError && pdfUrl && !isIOS ? (
          <iframe
            src={urlWithFragment}
            className="w-full h-full border-none"
            title="PDF fallback"
          />
        ) : isIOS && pdfUrl ? (
          <object
            data={urlWithFragment}
            type="application/pdf"
            className="w-full h-full"
          >
            <p className="p-4 text-center text-gray-400">
              iOS won’t inline-render.{" "}
              <a href={pdfUrl} className="underline">
                Download PDF
              </a>
            </p>
          </object>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No PDF available
          </div>
        )}
      </div>

      {/* ————— Reading-List Selector ————— */}
      {showListSelector && (
        <ReadingListSelector
          bookId={bookId}
          onClose={() => setShowListSelector(false)}
          onAddSuccess={() =>
            setNotification({ type: "success", message: "Added to list ✔" })
          }
        />
      )}
    </div>
  );
}
