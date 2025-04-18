'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './Button'
import { FiArrowRight } from 'react-icons/fi'

export default function Highlights() {
  const [data, setData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/books/highlights')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) return null

  const cards = [
    {
      title: 'Most Downloaded',
      listKey: 'mostDownloaded',
      link: '/books?sort=downloads_desc&limit=81'
    },
    {
      title: 'Recently Added',
      listKey: 'recentlyAdded',
      link: '/books?sort=upload_date_desc&limit=81'
    },
    {
      title: 'Trending This Week',
      listKey: 'trending',
      link: '/books?sort=trending&limit=81'
    },
    {
      title: 'Elias Lönnrot’s Works',
      listKey: 'lonnrot',
      link: '/books?author=L%C3%B6nnrot&limit=81'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map(({ title, listKey, link }) => {
        const sample = data[listKey][0] || {}
        return (
          <div key={listKey} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="h-40 bg-gray-700">
              {sample.cover_url ? (
                <img
                  src={sample.cover_url}
                  alt={sample.title}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              {sample.title && (
                <p className="text-sm text-gray-400 line-clamp-2">
                  {sample.title} — {sample.author}
                </p>
              )}
              <Button
                icon={FiArrowRight}
                text="See all"
                onClick={() => router.push(link)}
                className="mt-2 w-full justify-center"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
