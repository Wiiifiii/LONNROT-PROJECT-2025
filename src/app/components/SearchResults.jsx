// src/app/components/SearchResults.jsx
'use client'

import React from 'react'
import { FaListAlt } from 'react-icons/fa'
import BookCardCompact from '@/app/components/BooksCardCompact'
import Button from '@/app/components/Button'

export default function SearchResults({
  loading,
  books,
  total,
  page,
  limit,
  filters,
  onPageChange
}) {
  if (loading) {
    return <p className="text-white">Loading…</p>
  }

  if (!books || books.length === 0) {
    return <p className="text-white">No books found.</p>
  }

  return (
    <section className="space-y-6">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-white my-8">
        <FaListAlt /> Search Results ({total})
      </h2>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {books.map((b) => (
          <BookCardCompact key={b.id} book={b} />
        ))}
      </div>

      {/* Simple pagination controls */}
      {total > limit && (
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            text="Previous"
          />
          <span className="text-white px-4 py-2">
            Page {page} / {Math.ceil(total / limit)}
          </span>
          <Button
            onClick={() =>
              onPageChange(Math.min(Math.ceil(total / limit), page + 1))
            }
            text="Next"
          />
        </div>
      )}
    </section>
  )
}
