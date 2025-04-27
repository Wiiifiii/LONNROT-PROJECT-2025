'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Button from './Button'
import { FaEye, FaInfoCircle, FaDownload } from 'react-icons/fa'
import { GiMagicAxe } from 'react-icons/gi'
import BookCover from './BookCover';


export default function Card({ book }) {
  const router = useRouter()
  const [notification, setNotification] = useState(null)

  const handleDownload = useCallback(
    (format) => {
      const url = `/api/books/${book.id}/download?format=${format}`

      window.open(url, '_blank', 'noopener')
      fetch(`/api/books/${book.id}/stats`).catch(() => { })

      setNotification({
        type: 'success',
        message: `${book.title} ${format.toUpperCase()} download started!`,
      })
    },
    [book]
  )

  return (
    <div
    onClick={() => router.push(`/books/${book.id}/bookdetail`)}
    className="cursor-pointer rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-shadow"
      style={{
        backgroundImage: "url('/images/baseImage.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {book.cover_url ? (
        <div className="h-40 w-32 rounded-md overflow-hidden bg-[#111827] ">
        <img
          src={book.cover_url}
          alt={book.title}
          className="h-full w-full object-cover"
        />
      </div>
      ) : (
        <BookCover title={book.title} author={book.author} />
      )}


      <h3 className="mt-2 text-sm font-semibold text-center line-clamp-2">
        {book.title}
      </h3>
      <p className="text-xs text-white text-center">{book.author}</p>
      <p className="text-[10px] text-gray-400 text-center mt-1">
        Original ID: {book.id}
      </p>

      {/* Action Buttons */}
      <div className="mt-2 w-full">
        {/* Button row using grid layout */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            icon={FaEye}
            text="Open the Saga"
            onClick={async (e) => {
              e.stopPropagation()
              await fetch(`/api/books/${book.id}/read-start`, {
                method: 'POST',
              })
              fetch(`/api/books/${book.id}/stats`).catch(() => { })
              router.push(`/books/${book.id}/read`)
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#374151] rounded-full hover:bg-[#111827] text-base"
          />
          <Button
            icon={FaInfoCircle}
            text="Seek the Lore"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/books/${book.id}/bookdetail`)
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#374151] rounded-full hover:bg-[#111827] text-base"
          />
        </div>
        <div className="flex flex-col space-y-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDownload('txt')
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#374151] rounded-full hover:bg-[#111827] text-base w-full"
          >
            <FaDownload /> Keep the Sampo TXT
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDownload('pdf')
            }}
            className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm w-full"
          >
            <FaDownload /> Keep the Sampo PDF
          </button>
        </div>
      </div>
    </div>
  )
}
