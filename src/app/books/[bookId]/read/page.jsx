// src/app/books/[bookId]/read/page.jsx
import React from "react";
import Navbar from "../../../components/Navbar";
import BookViewer from "../../../components/BookViewer";

export default async function ReaderPage({ params }) {
  const { bookId } = await params;

  // Fetch metadata only for display or other logic
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/books/${bookId}`, { cache: "no-store" });
  const json = await res.json();

  if (!res.ok || !json.success) {
    return (
      <div className="text-red-500 p-4">
        Error loading book: {json.error}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 min-h-screen pt-16 p-4">

        {/* Always hit our download endpoint—this will proxy or generate the PDF */}
        <BookViewer
          pdfUrl={`/api/books/${bookId}/download?format=pdf`}
          bookId={bookId}
        />
      </div>
    </>
  );
}
