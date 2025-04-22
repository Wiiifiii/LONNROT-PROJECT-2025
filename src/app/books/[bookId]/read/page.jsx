// src/app/books/[bookId]/read/page.jsx
import React from "react";
import Navbar from "@/app/components/Navbar";
import BookViewer from "@/app/components/BookViewer";

export default async function ReaderPage({ params }) {
  const { bookId } = await params;  // await params before destructuring

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

  // json.data has shape { book: { title, author, pdf_url, ... }, otherBooks, reviews, ... }
  const { book } = json.data;
  // Use the direct Supabase‑hosted PDF URL instead of proxying through our API
  const pdfUrl = book.pdf_url;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 bg-gray-900 pt-16">
        <BookViewer bookId={bookId} pdfUrl={pdfUrl} book={book} />
      </div>
    </div>
  );
}
