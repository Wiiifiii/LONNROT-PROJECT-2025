// Summary: Client-rendered page that fetches book data from the API, supports filtering and sorting of books, and displays them in a table with actions.

"use client";
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { FaEye, FaInfoCircle, FaDownload } from "react-icons/fa";
import { useRouter } from "next/navigation";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [downloadable, setDownloadable] = useState(false);
  const [idSortOrder, setIdSortOrder] = useState("desc");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const router = useRouter();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) throw new Error("Failed to fetch books");
        const data = await response.json();
        setBooks(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const queryMatch =
        book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const genreMatch = genreFilter === "All" || book.genre === genreFilter;
      const yearMatch =
        yearFilter === "All" || book.publicationYear?.toString() === yearFilter;
      const downloadableMatch = !downloadable || (downloadable && book.file_url);
      return queryMatch && genreMatch && yearMatch && downloadableMatch;
    });
    return filtered.sort((a, b) =>
      idSortOrder === "asc" ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id)
    );
  }, [books, debouncedSearchQuery, genreFilter, yearFilter, downloadable, idSortOrder]);

  if (loading) {
    return (
      <div className="text-center text-2xl text-slate-200 mt-16">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500 text-2xl text-center mt-16">
        Error: {error}
      </div>
    );
  }
  if (!books.length) {
    return (
      <div className="text-center text-2xl text-slate-200 mt-16">
        No books found...
      </div>
    );
  }

  const handleIdSortToggle = () =>
    setIdSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 py-8">
      <div className="relative z-10 container mt-20 mx-auto px-12">
        <Navbar />
      </div>
      <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg mt-4">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          All Books, We're Hosting ({books.length} Books Now!😎)
        </h2>
        <div className="mb-6 text-center grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="px-4 py-2 rounded-md bg-gray-700 text-white w-full max-w-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                Clear
              </button>
            )}
          </div>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-700 text-white w-full"
          >
            <option value="All">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Sci-fi">Sci-fi</option>
          </select>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-700 text-white w-full"
          >
            <option value="All">All Years</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={downloadable}
              onChange={(e) => setDownloadable(e.target.checked)}
              id="downloadable"
              className="mr-2"
            />
            <label htmlFor="downloadable" className="text-sm">
              Downloadable
            </label>
          </div>
        </div>
        <table className="w-full border border-gray-700 shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th
                className="px-4 py-2 cursor-pointer"
                onClick={handleIdSortToggle}
              >
                ID {idSortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 text-gray-300 divide-y divide-gray-700">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-gray-800">
                <td className="px-4 py-3 text-center">{book.id}</td>
                <td className="px-4 py-3 text-center">{book.title}</td>
                <td className="px-4 py-3 text-center">{book.author}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <a
                    href={`/books/${book.id}/read`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300 text-sm"
                  >
                    <FaEye className="mr-1" />
                    <span>View/Read</span>
                  </a>
                  <button
                    onClick={() => router.push(`/books/${book.id}/bookdetail`)}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300 text-sm"
                  >
                    <FaInfoCircle className="mr-1" />
                    <span>Details</span>
                  </button>
                  <a
                    href={book.file_url || "#"}
                    download
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300 text-sm"
                  >
                    <FaDownload className="mr-1" />
                    <span>Download</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}