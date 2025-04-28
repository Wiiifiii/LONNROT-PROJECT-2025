// src/app/components/SearchResults.jsx
'use client'

import React from 'react'
import BooksCardCompact from '@/app/components/Books/Card'
import Button from '@/app/components/UI/Button'
import { GiRuneStone } from "react-icons/gi";
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

  const totalPages = Math.ceil(total / limit)

  return (
    <section className="space-y-6">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-white my-8">
        <GiRuneStone /> Runes Unveiled: ({total})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <BooksCardCompact key={book.id} book={book} />
        ))}
      </div>

      {/* Updated pagination controls with smaller sizes on mobile */}
      {total > limit && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            text="‹ Prev"
            className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm bg-gray-700 rounded disabled:opacity-50"
          />
          <span className="text-white px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm">
            Page {page} / {totalPages}
          </span>
          <Button
            onClick={() => onPageChange(page + 1)}
            text="Next ›"
            className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm bg-gray-700 rounded disabled:opacity-50"
          />
        </div>
      )}
    </section>
  )
}
