'use client'

import React, { useState, useEffect } from 'react'
import Button from './Button'
import BookCardCompact from './BookCardCompact' // assume you’ll create or adapt this

export default function BookSection({
  title,
  sort,           // e.g. "downloads_desc" | "createdAt_desc" | "trending"
  filter = {},    // { bookId, author, originalId }
  limit = 12,
  onSeeAll,       // callback for “See all”
}) {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const params = new URLSearchParams()
    if (sort)          params.set('sort', sort)
    if (filter.bookId) params.set('bookId', filter.bookId)
    if (filter.author) params.set('author', filter.author)
    if (filter.originalId) params.set('originalId', filter.originalId)
    params.set('limit', limit)

    fetch(`/api/books?${params.toString()}`)
        .then(r => r.json())
        .then(data => {
         // if the API returns { books: […] }, pick that; 
         // if it returns an array directly, use it too
        const list = Array.isArray(data)
           ? data
           : data.books ?? []
         setBooks(list)
       })
        .catch(console.error)
  }, [sort, filter.bookId, filter.author, filter.originalId, limit])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {onSeeAll && (
          <Button text={`See all`} onClick={() => onSeeAll(sort)} />
        )}
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {books.map((b) => (
          <BookCardCompact key={b.id} book={b} />
        ))}
      </div>
    </section>
  )
}
