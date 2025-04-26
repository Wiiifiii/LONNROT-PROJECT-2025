// src/app/components/Filters.jsx
'use client'
import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Button from './Button'
import Dropdown from './Dropdown'

export default function Filters({ initial = {}, onApply, onClear }) {
  // ─── Form state ───
  const [q, setQ]                   = useState('')
  const [selectedBook, setSelectedBook]     = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [selectedId, setSelectedId]         = useState('')

  // ─── Options from API ───
  const [bookOptions,   setBookOptions]   = useState([])
  const [authorOptions, setAuthorOptions] = useState([])
  const [idOptions,     setIdOptions]     = useState([])

  // Fetch filter-dropdown data once
  useEffect(() => {
    fetch('/api/books/filters')
      .then(r => r.json())
      .then(json => {
        // books → { value, label }
        setBookOptions(
          json.books.map(b => ({ value: String(b.id), label: b.title }))
        )
        // authors → { value, label }
        setAuthorOptions(
          json.authors.map(a => ({ value: a, label: a }))
        )
        // originalIds sorted descending
        const sorted = Array.isArray(json.originalIds)
          ? [...json.originalIds].sort((a, b) => b - a)
          : []
        setIdOptions(
          sorted.map(id => ({ value: String(id), label: String(id) }))
        )
      })
      .catch(console.error)
  }, [])

  // When the modal opens or `initial` changes, seed the inputs
  useEffect(() => {
    setQ(initial.search     || '')
    setSelectedBook(initial.bookId     || '')
    setSelectedAuthor(initial.author   || '')
    setSelectedId(initial.originalId   || '')
  }, [initial])

  // Clear only the form fields
  const clearFilters = () => {
    setQ('')
    setSelectedBook('')
    setSelectedAuthor('')
    setSelectedId('')
  }

  // Apply & close happens in the parent
  const apply = () => {
    onApply({
      search:     q,
      bookId:     selectedBook,
      author:     selectedAuthor,
      originalId: selectedId,
    })
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div>
        <label htmlFor="q" className="block text-sm text-gray-200 mb-1">
          Search
        </label>
        <div className="relative">
          <input
            id="q"
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Keyword, author…"
            className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Book */}
      <div>
        <label htmlFor="book" className="block text-sm text-gray-200 mb-1">
          Book
        </label>
        <Dropdown
          id="book"
          options={bookOptions}
          value={selectedBook}
          onChange={e => setSelectedBook(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Author */}
      <div>
        <label htmlFor="author" className="block text-sm text-gray-200 mb-1">
          Author
        </label>
        <Dropdown
          id="author"
          options={authorOptions}
          value={selectedAuthor}
          onChange={e => setSelectedAuthor(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Orig. ID */}
      <div>
        <label htmlFor="origId" className="block text-sm text-gray-200 mb-1">
          Orig. ID
        </label>
        <Dropdown
          id="origId"
          options={idOptions}
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={apply}        text="Apply" />
        <Button onClick={clearFilters} text="Clear" />
      </div>
    </div>
  )
}
