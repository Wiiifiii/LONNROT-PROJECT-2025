'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '@/app/components/Navbar'
import Modal from '@/app/components/Modal'
import Filters from '@/app/components/Filters'
import Highlights from '@/app/components/Highlights'
import SearchResults from '@/app/components/SearchResults'
import Button from '@/app/components/Button'

export default function BooksPage() {
  // ① Filters the user has applied
  const [applied, setApplied] = useState({
    search: '', bookId: '', author: '', originalId: '', sortBy: ''
  })

  // ② Results + pagination state
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(false)

  // ③ Modal + tab state
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('filters') // 'filters' or 'highlights'

  // fetch whenever filters / page / limit change
  useEffect(() => {
    async function fetchResults() {
      setLoading(true)
      const { search, bookId, author, originalId, sortBy } = applied
      const params = new URLSearchParams()
      if (search) params.set('searchQuery', search)
      if (bookId) params.set('book', bookId)
      if (author) params.set('author', author)
      if (originalId) params.set('origId', originalId)
      if (sortBy) params.set('sort', sortBy)
      params.set('page', String(page))
      params.set('limit', String(limit))

      const res = await fetch(`/api/books?${params}`)
      const json = await res.json()
      if (json.success) {
        setResults(json.data.books)
        setTotal(json.data.total)
      }
      setLoading(false)
    }
    fetchResults()
  }, [applied, page, limit])

  // ④ Handlers that also close the modal
  const handleApplyAndClose = filters => {
    setApplied(filters)
    setPage(1)
    setLimit(20)
    setShowModal(false)
    // reset sortBy if you want default sort on new search
    setApplied(f => ({ ...filters, sortBy: '' }))
  }

  const handleHighlightAndClose = sortKey => {
    setApplied(a => ({ ...a, sortBy: sortKey }))
    setPage(1)
    setLimit(81)
    setShowModal(false)
  }
  // helper to reset everything
  const handleShowAll = () => {
    setApplied({ search: '', bookId: '', author: '', originalId: '', sortBy: '' })
    setPage(1)
    setLimit(20)
    setShowModal(false)
  }
  return (
    <>
      <Navbar />

      {/* MODAL lives at the top level so it’s always visible */}
      <Modal
        isOpen={showModal}
        title={activeTab === 'filters' ? 'Filters' : 'Highlights'}
        onClose={() => setShowModal(false)}
      >
        {/* tabs & content as before */}
        <div className="flex space-x-4 border-b border-gray-600 mb-4">
          <button
            onClick={() => setActiveTab('filters')}
            className={`pb-2 ${activeTab === 'filters'
                ? 'border-b-2 border-white font-semibold text-white'
                : 'text-gray-400'
              }`}
          >
            Rune Weaving
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`pb-2 ${activeTab === 'highlights'
                ? 'border-b-2 border-white font-semibold text-white'
                : 'text-gray-400'
              }`}
          >
           Gleaming Tomes
          </button>
        </div>
        {activeTab === 'filters' ? (
          <Filters
            initial={applied}
            onApply={handleApplyAndClose}
            // now ONLY resets the form inputs
            onClear={() => {/* nothing, form reset is internal */ }}
          />
        ) : (
          <Highlights onFilter={handleHighlightAndClose} />
        )}
      </Modal>

      <div className="backdrop-brightness-50 min-h-screen px-6 py-8 space-y-8 pt-20">
        {/* ─── Centered Call-to-Action ─── */}
        <div className="flex flex-col items-center mb-8 space-y-2">
          <h2 className="text-2xl text-white font-semibold">Refine Your Library</h2>
          <div className="flex gap-4">
            <Button text="Rune Weaving" onClick={() => { setActiveTab('filters'); setShowModal(true) }} />
            <Button text="Gleaming Tomes" onClick={() => { setActiveTab('highlights'); setShowModal(true) }} />
            <Button text="Unveil All Runes" onClick={handleShowAll} />
          </div>
        </div>


        {/* Results */}
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