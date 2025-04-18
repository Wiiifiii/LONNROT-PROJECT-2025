// src/app/components/Filters.jsx
'use client'
import React, { useState, useEffect } from 'react'
import Dropdown from './Dropdown'
import Button from './Button'
import { FiSearch, FiX, FiFilter } from 'react-icons/fi'

export default function Filters({ onApply, onClear }) {
  // 1) filter values
  const [search, setSearch]           = useState('')
  const [selBook, setSelBook]         = useState('')
  const [selAuthor, setSelAuthor]     = useState('')
  const [selOriginalId, setSelOriginalId] = useState('')

  // 2) dropdown options
  const [bookOptions, setBookOptions]         = useState([])
  const [authorOptions, setAuthorOptions]     = useState([])
  const [idOptions, setIdOptions]             = useState([])

  // 3) Fetch real filter lists on mount
  useEffect(() => {
    fetch('/api/books/filters')
      .then(r => r.json())
      .then(({ books, authors, originalIds }) => {
        // map into { value, label } for Dropdown
        setBookOptions(
          books.map(b => ({ value: String(b.id), label: b.title }))
        )
        setAuthorOptions(
          authors.map(a => ({ value: a, label: a }))
        )
        setIdOptions(
          originalIds.map(id => ({ value: String(id), label: String(id) }))
        )
      })
      .catch(console.error)
  }, [])

  const handleApply = () =>
    onApply({ search, bookId: selBook, author: selAuthor, originalId: selOriginalId })

  const handleClear = () => {
    setSearch('')
    setSelBook('')
    setSelAuthor('')
    setSelOriginalId('')
    onClear()
  }

  return (
    <div className="flex flex-wrap items-end gap-4 bg-gray-800/75 backdrop-blur-sm p-4 rounded">
      {/* Search input */}
      <div className="flex-1">
        <label className="block text-sm mb-1 text-gray-300">Search</label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Keyword, author…"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
          />
          <FiSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Book dropdown */}
      <Dropdown
        label="Book"
        placeholder="Select a book…"
        options={bookOptions}
        value={selBook}
        onChange={e => setSelBook(e.target.value)}
      />

      {/* Author dropdown */}
      <Dropdown
        label="Author"
        placeholder="Select an author…"
        options={authorOptions}
        value={selAuthor}
        onChange={e => setSelAuthor(e.target.value)}
      />

      {/* Original ID dropdown */}
      <Dropdown
        label="Orig. ID"
        placeholder="Select ID…"
        options={idOptions}
        value={selOriginalId}
        onChange={e => setSelOriginalId(e.target.value)}
      />

      {/* Apply & Clear */}
      <Button icon={FiFilter} text="Apply" onClick={handleApply} />
      <Button
        icon={FiX}
        text="Clear"
        onClick={handleClear}
        className="bg-red-600 hover:bg-red-700"
      />
    </div>
  )
}
