// src/app/components/Filters.jsx
'use client'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import Button from './Button'
import Dropdown from './Dropdown' // your wrapper around <select>

export default function Filters({ onApply, onClear }) {
  const [q, setQ] = useState('')
  const [selectedBook, setSelectedBook] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [selectedId, setSelectedId] = useState('')

  // Replace with your real options
  const bookOptions = []
  const authorOptions = []
  const idOptions = []

  const onChangeQ = (e) => setQ(e.target.value)
  const onChangeBook = (e) => setSelectedBook(e.target.value)
  const onChangeAuthor = (e) => setSelectedAuthor(e.target.value)
  const onChangeId = (e) => setSelectedId(e.target.value)

  const applyFilters = () => {
    onApply({
      search: q,
      bookId: selectedBook,
      author: selectedAuthor,
      originalId: selectedId,
    })
  }

  const clearFilters = () => {
    setQ('')
    setSelectedBook('')
    setSelectedAuthor('')
    setSelectedId('')
    onClear()
  }

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">
      {/* Search box */}
      <div className="w-full md:flex-1">
        <label htmlFor="q" className="block text-sm text-gray-200 mb-1">
          Search
        </label>
        <div className="relative">
          <input
            id="q"
            type="text"
            value={q}
            onChange={onChangeQ}
            placeholder="Keyword, author…"
            className="w-full px-4 py-2 bg-gray-700 rounded-md text-white"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Book select */}
      <div className="w-full md:flex-1">
        <label htmlFor="book" className="block text-sm text-gray-200 mb-1">
          Book
        </label>
        <Dropdown
          id="book"
          options={bookOptions}
          value={selectedBook}
          onChange={onChangeBook}
          className="w-full"
        />
      </div>

      {/* Author select */}
      <div className="w-full md:flex-1">
        <label htmlFor="author" className="block text-sm text-gray-200 mb-1">
          Author
        </label>
        <Dropdown
          id="author"
          options={authorOptions}
          value={selectedAuthor}
          onChange={onChangeAuthor}
          className="w-full"
        />
      </div>

      {/* Orig. ID select */}
      <div className="w-full md:flex-1">
        <label htmlFor="origId" className="block text-sm text-gray-200 mb-1">
          Orig. ID
        </label>
        <Dropdown
          id="origId"
          options={idOptions}
          value={selectedId}
          onChange={onChangeId}
          className="w-full"
        />
      </div>

      {/* Buttons */}
      <div className="w-full md:w-auto flex gap-2">
        <Button onClick={applyFilters} text="Apply" />
        <Button onClick={clearFilters} text="Clear" />
      </div>
    </div>
  )
}
