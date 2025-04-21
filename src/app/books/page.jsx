'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '@/app/components/Navbar'
import Filters from '@/app/components/Filters'
import Highlights from '@/app/components/Highlights'
import SearchResults from '@/app/components/SearchResults'

export default function BooksPage() {
  // ① Filters the user has applied
  const [applied, setApplied] = useState({
    search: '', bookId: '', author: '', originalId: '', sortBy: ''
  })

  // ② Results + pagination state
  const [results, setResults] = useState([])
  const [total,   setTotal]   = useState(0)
  const [page,    setPage]    = useState(1)

  // now state so we can bump to 81 for highlights
  const [limit,  setLimit]  = useState(20)

  const [loading, setLoading] = useState(false)

  // ③ Re‐fetch whenever filters, page or limit change
  useEffect(() => {
    async function fetchResults() {
      setLoading(true)
      const { search, bookId, author, originalId, sortBy } = applied

      const params = new URLSearchParams()
      if (search)     params.set('searchQuery', search)
      if (bookId)     params.set('book',        bookId)
      if (author)     params.set('author',      author)
      if (originalId) params.set('origId',      originalId)
      if (sortBy)     params.set('sort',        sortBy)
      params.set('page',  String(page))
      params.set('limit', String(limit))

      const res  = await fetch(`/api/books?${params}`)
      const json = await res.json()
      if (json.success) {
        setResults(json.data.books)
        setTotal(json.data.total)
      }
      setLoading(false)
    }

    fetchResults()
  }, [applied, page, limit])  // ← include limit here now

  // ④ Called by Filters → normal paged search
  const handleApply = filters => {
    setApplied(filters)
    setApplied({ ...filters, sortBy: '' })
    setPage(1)
    setLimit(20)      // go back to 20 items/page
  }

  const handleClear = () => {
    setApplied({ search:'', bookId:'', author:'', originalId:'', sortBy:'' })
    setPage(1)
    setLimit(20)
  }

  // ⑤ Called by Highlights → “See all” 81‑item list
  const handleHighlightFilter = sortKey => {
    setApplied(a => ({ ...a, sortBy: sortKey }))
    setPage(1)
    setLimit(81)      // fetch 81 items for this highlight
  }

  return (
    <>
      <Navbar />

      <div
        className="backdrop-brightness-50 min-h-screen px-6 py-8 space-y-8 pt-20"
        style={{
          backgroundImage: "url('/images/your-bg-image.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat"
        }}
      >
        <Filters
          onApply={handleApply}
          onClear={handleClear}
        />

        <Highlights onFilter={handleHighlightFilter} />

        <SearchResults
          loading={loading}
          books={results}
          total={total}
          page={page}
          limit={limit}
          filters={applied}
          onPageChange={setPage}
        />
      </div>
    </>
  )
}

import { FaDownload } from 'react-icons/fa'

export function BookViewer({ book, bumpDownload }) {
  return (
    <div>
      <a
        href={`/api/books/${book.id}/download?format=pdf`}
        onClick={bumpDownload}
        target="_blank"
        rel="noopener"
        className={`inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm ${book.pdf_url ? "" : ""}`}
      >
        <FaDownload /> PDF
      </a>

      <a
        href={`/api/books/${book.id}/download?format=txt`}
        onClick={bumpDownload}
        download
        target="_blank"
        rel="noopener"
        className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm"
      >
        <FaDownload /> TXT
      </a>
    </div>
  )
}
