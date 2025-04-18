"use client";
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import SearchInput from "../components/SearchInput";
import Dropdown from "../components/Dropdown";
import Card from "../components/Card";
import { FaTimes, FaClock, FaFire } from "react-icons/fa";

function useDebounce(v, d) {
  const [val, setVal] = useState(v);
  useEffect(() => {
    const id = setTimeout(() => setVal(v), d);
    return () => clearTimeout(id);
  }, [v, d]);
  return val;
}

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [statsMap, setStatsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Loom of Tomorrow");
  const [year, setYear] = useState("Loom of Tomorrow");
  const [language, setLanguage] = useState("Loom of Tomorrow");
  const [author, setAuthor] = useState("All");

  const [downloadable, setDownloadable] = useState(false);
  const [latest, setLatest] = useState(false);
  const [trending, setTrending] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  /* Dropdown options (built after FULL fetch) */
  const authorOptions = useMemo(() => {
    const set = new Set();
    books.forEach((b) => b.author && set.add(b.author));
    return ["All", ...Array.from(set).sort()];
  }, [books]);

  const genreOptions = useMemo(() => {
    const set = new Set();
    books.forEach((b) => b.genres?.forEach((g) => set.add(g)));
    return ["Loom of Tomorrow", ...Array.from(set).sort()];
  }, [books]);

  const yearOptions = useMemo(() => {
    const set = new Set();
    books.forEach((b) => b.publicationYear && set.add(b.publicationYear));
    return ["Loom of Tomorrow", ...Array.from(set).sort()];
  }, [books]);

  const languageOptions = useMemo(() => {
    const set = new Set();
    books.forEach((b) => b.language && set.add(b.language));
    return ["Loom of Tomorrow", ...Array.from(set).sort()];
  }, [books]);

  /* -------- fetch ALL books once -------- */
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        /* filters */
        if (debouncedSearch.trim()) params.set("searchQuery", debouncedSearch);
        if (genre !== "Loom of Tomorrow") params.set("genre", genre);
        if (year !== "Loom of Tomorrow") params.set("year", year);
        if (language !== "Loom of Tomorrow") params.set("language", language);
        if (author !== "All") params.set("author", author);
        if (downloadable) params.set("Sampo’s Bounty", "true");
        if (latest) params.set("New Runes", "true");
        if (trending) params.set("Kantele’s Call", "true");

        const res = await fetch(`/api/books?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch books");
        const json = await res.json();
        setBooks(json.data.books);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [debouncedSearch, genre, year, language, author, downloadable, latest, trending]);

  /* after books have been fetched */
  useEffect(() => {
    if (!books.length) return;
    const ids = books.map((b) => b.id).join(",");
    fetch(`/api/books/stats?ids=${ids}`)
      .then((r) => r.json())
      .then(setStatsMap)
      .catch(() => setStatsMap({}));
  }, [books]);

  if (loading)
    return <div className="text-center text-2xl text-slate-200 mt-16">Loading…</div>;
  if (error)
    return <div className="text-center text-2xl text-red-500 mt-16">Error: {error}</div>;
  if (!books.length)
    return <div className="text-center text-2xl text-slate-200 mt-16">No books found…</div>;

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      <div
        className="
          pt-16
          min-h-screen
          text-white
          bg-[url('/images/LogInPage.png')]
          bg-cover
          bg-center
          bg-no-repeat
        "
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Filters */}
            <aside className="md:w-1/3 bg-gray-800 p-4 rounded-lg space-y-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <SearchInput
                  placeholder="Seek Tale or Bard"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="px-3 py-2 bg-gray-500 rounded-md hover:bg-gray-600 text-sm flex items-center"
                  >
                    <FaTimes className="mr-1" /> Clear
                  </button>
                )}
              </div>

              <Dropdown label="Genre" options={genreOptions} value={genre} onChange={(e) => setGenre(e.target.value)} />
              <Dropdown label="Year" options={yearOptions} value={year} onChange={(e) => setYear(e.target.value)} />
              <Dropdown label="Language" options={languageOptions} value={language} onChange={(e) => setLanguage(e.target.value)} />
              <Dropdown label="Author" options={authorOptions} value={author} onChange={(e) => setAuthor(e.target.value)} />

              {[
                ["Sampo’s Bounty", downloadable, setDownloadable, "Sampo’s Bounty"],
                ["New Runes", latest, setLatest, <><FaClock className="mr-1" />New Runes</>],
                ["Kantele’s Call", trending, setTrending, <><FaFire className="mr-1" />Kantele’s Call</>],
              ].map(([id, state, setter, lbl]) => (
                <div key={id} className="flex items-center space-x-2">
                  <input id={id} type="checkbox" checked={state} onChange={(e) => setter(e.target.checked)} />
                  <label htmlFor={id} className="text-sm flex items-center">{lbl}</label>
                </div>
              ))}
            </aside>

            {/* Cards */}
            <section className="md:w-2/3">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((b) => (
                  <Card
                    key={b.id}
                    book={b}
                    stats={statsMap[b.id] ?? { DOWNLOAD: 0, READ_START: 0 }}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
