'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Button from './Button'
import { FaEye, FaInfoCircle, FaDownload } from 'react-icons/fa'
import { GiMagickTrick } from 'react-icons/gi'
import { GiMagicAxe } from "react-icons/gi";

// Dummy bumpDownload function; update with your own logic if needed.
const bumpDownload = (e) => {
  console.log('Download action triggered')
}

export default function BookCardCompact({ book }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/books/${book.id}`)}
      className="cursor-pointer rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-shadow"
      style={{
        backgroundImage: "url('/images/LogInPage.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {book.cover_url ? (
        <img
          src={book.cover_url}
          alt={book.title}
          className="h-32 w-24 object-cover rounded-md"
        />
      ) : (
        // Fallback: show the magic‐trick icon
        <div className="h-32 w-24 bg-gray-700 rounded-md flex items-center justify-center">
          <GiMagicAxe className="text-white text-4xl" />
        </div>
      )}

      <h3 className="mt-2 text-sm font-semibold text-center line-clamp-2">
        {book.title}
      </h3>
      {/* author in white */}
      <p className="text-xs text-white text-center">{book.author}</p>

      {/* Action Buttons */}
      <div className="mt-2 w-full space-y-2">
        <Button
          icon={FaEye}
          text="Open the Saga"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/books/${book.id}/read`)
          }}
          className="w-full justify-center"
        />
        <Button
          icon={FaInfoCircle}
          text="Seek the Lore"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/books/${book.id}/bookdetail`)
          }}
          className="w-full justify-center"
        />
        <div className="flex flex-col space-y-2">
          <a
            href={`/api/books/${book.id}/download?format=txt`}
            onClick={(e) => {
              e.stopPropagation()
              bumpDownload(e)
            }}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#374151] rounded-full hover:bg-[#111827] text-base w-full"
          >
            <FaDownload /> Take the Sampo TXT
          </a>
          <a
            href={`/api/books/${book.id}/download?format=pdf`}
            onClick={(e) => {
              e.stopPropagation()
              bumpDownload(e)
            }}
            target="_blank"
            rel="noopener"
            className={`inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm w-full ${
              book.pdf_url ? "" : ""
            }`}
          >
            <FaDownload /> Take the Sampo PDF
          </a>
        </div>
      </div>
    </div>
  )
}
