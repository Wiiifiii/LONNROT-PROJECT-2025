// src/app/components/SearchResults.jsx
'use client'

import React, { useEffect, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { FaListAlt } from 'react-icons/fa'
import Button from '@/app/components/Button'
import BookCardCompact from '@/app/components/BooksCardCompact'

export default function SearchResults({ filters }) {
  const [books, setBooks] = useState([])       // 1) books state
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.search)     params.set('searchQuery', filters.search)
    if (filters.bookId)     params.set('bookId', filters.bookId)
    if (filters.author)     params.set('author', filters.author)
    if (filters.originalId) params.set('originalId', filters.originalId)
    params.set('limit', '81')

    fetch(`/api/books?${params.toString()}`)
      .then((r) => r.json())
      .then((payload) => {
        const list = Array.isArray(payload)
          ? payload
          : payload.data?.books ?? []
        setBooks(list)
        setTotal(payload.data?.total ?? list.length)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filters])

  if (loading) {
    return <p className="text-white">Loading…</p>
  }
  if (books.length === 0) {
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
    </section>
  )
}
