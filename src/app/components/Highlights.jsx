'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './Button'
import { FiArrowRight } from 'react-icons/fi'
import { GiMagickTrick } from 'react-icons/gi'
// import BackgroundWrapper from './BackgroundWrapper' // if you still need it

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
      title: 'Top Sampo Takes',
      listKey: 'mostDownloaded',
      link: '/books?sort=downloads_desc&limit=81'
    },
    {
      title: 'Newly Woven Sagas',
      listKey: 'recentlyAdded',
      link: '/books?sort=upload_date_desc&limit=81'
    },
    {
      title: 'Kantele’s Echo',
      listKey: 'trending',
      link: '/books?sort=trending&limit=81'
    },
    {
      title: '',
      listKey: 'lonnrot',
      link: '/books?author=L%C3%B6nnrot&limit=81'
    }
  ]

  return (
    // wrap in <BackgroundWrapper> if you need the unified bg
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map(({ title, listKey, link }) => {
        const sample = data[listKey][0] || {}
        return (
          <div key={listKey} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="h-40 bg-gray-700 flex items-center justify-center">
              {sample.cover_url ? (
                <img
                  src={sample.cover_url}
                  alt={sample.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <GiMagickTrick className="text-white text-5xl" />
              )}
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {sample.title && (
                <p className="text-sm text-white line-clamp-2">
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
    // </BackgroundWrapper>
  )
}
