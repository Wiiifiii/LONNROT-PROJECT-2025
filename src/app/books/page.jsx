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
  const [total,   setTotal]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [limit,  setLimit]  = useState(20)
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

  return (
    <>
      <Navbar />

      <div className="backdrop-brightness-50 min-h-screen px-6 py-8 space-y-8 pt-20">
        {/* Toolbar buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <Button
            text="Filters"
            onClick={() => { setActiveTab('filters'); setShowModal(true) }}
          />
          <Button
            text="Highlights"
            onClick={() => { setActiveTab('highlights'); setShowModal(true) }}
          />
        </div>

        {/* Our shared Modal */}
        <Modal
          isOpen={showModal}
          title={activeTab === 'filters' ? 'Filters' : 'Highlights'}
          onClose={() => setShowModal(false)}
        >
          {activeTab === 'filters' ? (
            <Filters
              initial={applied}
              onApply={handleApplyAndClose}
              onClear={() => { handleApplyAndClose({ search:'', bookId:'', author:'', originalId:'', sortBy:'' }) }}
            />
          ) : (
            <Highlights onFilter={handleHighlightAndClose} />
          )}
        </Modal>

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
