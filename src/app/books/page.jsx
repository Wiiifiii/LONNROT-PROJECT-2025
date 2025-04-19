'use client'
import React, { useState } from 'react'
import Navbar from '@/app/components/Navbar'
import Filters from '@/app/components/Filters'
import SearchResults from '@/app/components/SearchResults'
import Highlights from '@/app/components/Highlights'

export default function BooksPage() {
  // this object holds whatever the user applied
  const [applied, setApplied] = useState({
    search: '', bookId: '', author: '', originalId: ''
  })

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/LogInPage.png')" }}
    >
      <Navbar />

      <div
        className="backdrop-brightness-50 min-h-screen px-6 py-8 space-y-8 pt-20" // added pt-20 so content starts below the navbar
      >
        <Filters
          onApply={setApplied}
          onClear={() => setApplied({ search: '', bookId: '', author: '', originalId: '' })}
        />

        {/* ←– new highlights row */}
        <Highlights />

        <SearchResults filters={applied} />
      </div>
    </div>
  )
}
