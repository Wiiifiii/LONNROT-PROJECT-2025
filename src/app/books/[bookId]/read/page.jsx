// src/app/books/[bookId]/read/page.jsx
import React from "react";
import Navbar from "@/app/components/Navbar";
import BookViewer from "@/app/components/BookViewer";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReaderPage({ params }) {
  // params is a Promise<{ bookId: string }>
  const { bookId } = await params;

  const book = await prisma.book.findUnique({ where: { id: +bookId } });
  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading book.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navbar />
      <div className="flex-1 pt-16">
        <BookViewer bookId={bookId} pdfUrl={book.pdf_url} book={book} />
      </div>
    </div>
  );
}
