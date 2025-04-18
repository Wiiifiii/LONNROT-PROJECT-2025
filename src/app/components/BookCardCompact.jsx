'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function BookCardCompact({ book }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/books/${book.id}`)}
      className="cursor-pointer bg-gray-800 rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-shadow"
    >
      {book.cover_url ? (
        <img
          src={book.cover_url}
          alt={book.title}
          className="h-32 w-24 object-cover rounded-md"
        />
      ) : (
        <div className="h-32 w-24 bg-gray-700 rounded-md" />
      )}

      <h3 className="mt-2 text-sm font-semibold text-center line-clamp-2">
        {book.title}
      </h3>
      <p className="text-xs text-gray-400 text-center">
        {book.author}
      </p>
    </div>
  )
}
