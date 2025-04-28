// app/books/[bookId]/bookdetail/page.jsx

import Navbar from "@/app/components/Layout/Navbar";
import BookDetailClient from "./BookDetailClient";

export default async function BookDetailsPage({ params }) {
  // ★ WAIT on params before destructuring
  const { bookId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 1) Fetch book + related data on the server
  const res = await fetch(
    `${baseUrl}/api/books/${bookId}`,
    { cache: "no-store" }
  );
  const json = await res.json();

  // 2) Error handling
  if (!res.ok || !json.success) {
    return (
      <main style={{ color: "red", padding: "1rem" }}>
        <h2>Error: {json.error || "Failed to fetch book"}</h2>
      </main>
    );
  }

  const { book, otherBooks, reviews } = json.data;

  // 3) Render background + navbar + pass props to client shell
  return (
    <main
      className="min-h-screen text-white bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/images/baseImage.png')" }}
    >
      <Navbar />
      <BookDetailClient
        book={book}
        otherBooks={otherBooks}
        reviews={reviews}
      />
    </main>
  );
}
