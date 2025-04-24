// src/app/books/[bookId]/read/page.jsx
import React from "react";
import Navbar from "@/app/components/Navbar";
import BookViewer from "@/app/components/BookViewer";

export default async function ReaderPage({ params }) {
  const { bookId } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/books/${bookId}`, { cache: "no-store" });
  const json = await res.json();

  if (!res.ok || !json.success) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading book: {json.error}
      </div>
    );
  }

  const { book } = json.data;
  // pass in the direct Supabase URLs
  const pdfUrl = book.pdf_url;
  const txtUrl = book.txt_url;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navbar />
      <div className="flex-1 pt-16">
        <BookViewer
          bookId={bookId}
          pdfUrl={pdfUrl}
          txtUrl={txtUrl}
          book={book}
        />
      </div>
    </div>
  );
}
