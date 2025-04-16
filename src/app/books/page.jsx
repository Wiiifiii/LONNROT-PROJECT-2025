"use client";
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import SearchInput from "../components/SearchInput";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaBook, 
  FaEye, 
  FaInfoCircle, 
  FaTimes, 
  FaDownload, 
  FaClock, 
  FaFire 
} from "react-icons/fa";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BooksPage() {
  // State declarations
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [authorFilter, setAuthorFilter] = useState("All");
  const [downloadable, setDownloadable] = useState(false);
  const [latest, setLatest] = useState(false);
  const [trending, setTrending] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const router = useRouter();

  // For dropdown option values - these are derived from the currently fetched books.
  const authorOptions = useMemo(() => {
    const authorSet = new Set();
    books.forEach((b) => {
      if (b.author) authorSet.add(b.author);
    });
    return ["All", ...Array.from(authorSet).sort()];
  }, [books]);

  const genreOptions = useMemo(() => {
    const genresSet = new Set();
    books.forEach((b) => {
      if (b.genres && Array.isArray(b.genres) && b.genres.length > 0) {
        b.genres.forEach((g) => genresSet.add(g));
      }
    });
    return ["All", ...Array.from(genresSet).sort()];
  }, [books]);

  const yearOptions = useMemo(() => {
    const yearsSet = new Set();
    books.forEach((b) => {
      if (b.publicationYear) yearsSet.add(b.publicationYear.toString());
    });
    return ["All", ...Array.from(yearsSet).sort()];
  }, [books]);

  const languageOptions = useMemo(() => {
    const langSet = new Set();
    books.forEach((b) => {
      if (b.language) langSet.add(b.language);
    });
    return ["All", ...Array.from(langSet).sort()];
  }, [books]);

  // Since the server is now filtering, we simply fetch the data according to the query parameters.
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", pageSize.toString());
        if (debouncedSearchQuery.trim()) {
          params.append("searchQuery", debouncedSearchQuery.trim());
        }
        if (genreFilter !== "All") {
          params.append("genre", genreFilter);
        }
        if (yearFilter !== "All") {
          params.append("year", yearFilter);
        }
        if (languageFilter !== "All") {
          params.append("language", languageFilter);
        }
        if (authorFilter !== "All") {
          params.append("author", authorFilter);
        }
        if (downloadable) {
          params.append("downloadable", "true");
        }
        if (latest) {
          params.append("latest", "true");
        }
        if (trending) {
          params.append("trending", "true");
        }

        const response = await fetch(`/api/books?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch books");
        const result = await response.json();
        setBooks(result.data.books);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [
    page,
    debouncedSearchQuery,
    genreFilter,
    yearFilter,
    languageFilter,
    authorFilter,
    downloadable,
    latest,
    trending,
  ]);

  // Reset page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearchQuery,
    genreFilter,
    yearFilter,
    languageFilter,
    authorFilter,
    downloadable,
    latest,
    trending,
  ]);

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  if (loading) {
    return <div className="text-center text-2xl text-slate-200 mt-16">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-2xl text-red-500 mt-16">Error: {error}</div>;
  }
  if (!books.length) {
    return <div className="text-center text-2xl text-slate-200 mt-16">No books found...</div>;
  }

  // Since the server returns paginated, filtered books, we use that array directly.
  const paginatedBooks = books;

  return (
    <>
      {/* Fixed top navbar */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="pt-16 bg-gray-900 min-h-screen text-white">
        <div className="container mx-auto px-4 py-6">
          {/* 2-col layout for filters and cards */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Left side filters */}
            <div className="md:w-1/3 bg-gray-800 p-4 rounded-lg space-y-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <SearchInput
                  placeholder="Search by book name or author etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm flex items-center"
                  >
                    <FaTimes className="mr-1" /> Clear
                  </button>
                )}
              </div>
              {/* Genre dropdown */}
              <Dropdown
                label="Genre"
                options={genreOptions}
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              />
              {/* Year dropdown */}
              <Dropdown
                label="Year"
                options={yearOptions}
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              />
              {/* Language dropdown */}
              <Dropdown
                label="Language"
                options={languageOptions}
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              />
              {/* Author dropdown */}
              <Dropdown
                label="Author"
                options={authorOptions}
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
              />
              {/* Additional checkboxes */}
              <div className="flex items-center space-x-2">
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={latest}
                  onChange={(e) => setLatest(e.target.checked)}
                  id="latest"
                  className="mr-2"
                />
                <label htmlFor="latest" className="text-sm flex items-center">
                  <FaClock className="mr-1" /> Latest
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(e) => setTrending(e.target.checked)}
                  id="trending"
                  className="mr-2"
                />
                <label htmlFor="trending" className="text-sm flex items-center">
                  <FaFire className="mr-1" /> Trending
                </label>
              </div>
            </div>
            {/* Right side card grid */}
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedBooks.map((book) => (
                  <div key={book.id} className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
                    <div className="flex items-center mb-2">
                      <FaBook className="text-3xl text-gray-400 mr-2" />
                      <div>
                        <h3 className="text-lg font-bold">{book.title}</h3>
                        <p className="text-gray-400 text-sm">By {book.author}</p>
                      </div>
                    </div>
                    <div className="flex-grow">
                      {book.genres && book.genres.length > 0 && (
                        <p className="text-gray-300 text-xs mb-1">
                          Genres: {book.genres.join(", ")}
                        </p>
                      )}
                      {book.publicationYear && (
                        <p className="text-gray-300 text-xs mb-1">
                          Year: {book.publicationYear}
                        </p>
                      )}
                      {book.language && (
                        <p className="text-gray-300 text-xs mb-1">
                          Language: {book.language}
                        </p>
                      )}
                    </div>
                    {/* Action buttons */}
                    <div className="mt-2 flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Button
                          icon={FaEye}
                          text="View"
                          tooltip="View or read the book"
                          onClick={() => router.push(`/books/${book.id}/read`)}
                        />
                        <Button
                          icon={FaInfoCircle}
                          text="Details"
                          tooltip="Book details"
                          onClick={() => router.push(`/books/${book.id}/bookdetail`)}
                        />
                      </div>
                      <a
                        href={book.file_url || "#"}
                        download
                        title="Download book"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300 text-sm"
                      >
                        <FaDownload /> Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination controls */}
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  icon={FaArrowLeft}
                  text="Prev"
                  tooltip="Previous Page"
                  onClick={handlePrevPage}
                  className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                />
                <span className="text-sm">
                  Page {page} of {totalPages} (Total {total} books)
                </span>
                <Button
                  icon={FaArrowRight}
                  text="Next"
                  tooltip="Next Page"
                  onClick={handleNextPage}
                  className={page === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
