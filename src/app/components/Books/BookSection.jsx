'use client'

import React, { useState, useEffect } from 'react'
import Button from './Button'
import Card from './Card' 

export default function BookSection({
  title,
  sort,          
  filter = {},    
  limit = 12,
  onSeeAll,      
}) {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const params = new URLSearchParams()
    if (sort)          params.set('sort', sort)
    if (filter.bookId) params.set('book', filter.bookId)
    if (filter.author) params.set('author', filter.author)
    if (filter.originalId) params.set('origId', filter.originalId)
    params.set('limit', limit)

    fetch(`/api/books?${params.toString()}`)
        .then(r => r.json())
        .then(json => {
          const list = Array.isArray(json)
            ? json
            : (json?.data?.books ?? json?.books ?? [])
          setBooks(Array.isArray(list) ? list : [])
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
          <Card key={b.id} book={b} />
        ))}
      </div>
    </section>
  )
}
