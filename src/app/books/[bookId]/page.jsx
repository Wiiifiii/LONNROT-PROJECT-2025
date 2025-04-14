// Summary: Server-rendered page that fetches book details by bookId and renders the BookDetail client component with fresh data.

import React from "react";
import BookDetail from "./components/BookDetail";

export default async function BookDetailPage({ params }) {
  const { bookId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/books/${bookId}`, {
    cache: "no-store",
  });
  const data = await res.json();

  if (!res.ok || !data.success) {
    return (
      <main style={{ color: "red", padding: "1rem" }}>
        <h2>Error: {data.error || "Failed to fetch book"}</h2>
      </main>
    );
  }

  return (
    <main style={{ padding: "1rem" }}>
      <BookDetail bookData={data.data} />
    </main>
  );
}

