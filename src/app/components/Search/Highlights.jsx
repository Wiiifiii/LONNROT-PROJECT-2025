'use client'
import React, { useEffect, useState } from 'react'
import Button from '@/app/components/UI/Button'
import { FiArrowRight } from 'react-icons/fi'

export default function Highlights({ onFilter = () => { } }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/books/highlights')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) return null

  const cards = [
    { title: 'Sampo’s Chosen', listKey: 'mostDownloaded', link: 'downloads_desc' },
    { title: 'Fresh Tales', listKey: 'recentlyAdded', link: 'upload_date_desc' },
    { title: 'Kantele’s Echo', listKey: 'trending', link: 'trending' },
    { title: 'Elias Lönnrot’s Runes', listKey: 'lonnrot', link: 'lonnrot' },
  ]

  const fallbackImages = {
    mostDownloaded: "/images/MostDownloaded.png",
    recentlyAdded: "/images/RecentlyAdded.png",
    trending: "/images/TrendingThisWeek.png",
    lonnrot: "/images/EliasLönnrotsWorks.png",
  }

  return (
    <div className="
    bg-[#0b1c2c] bg-opacity-75 backdrop-blur-sm
   rounded-lg p-6
   space-y-4 mb-6
  ">  
      {cards.map(({ title, listKey, link }) => {
        const sample = data[listKey][0] || {}
        return (
          <div key={listKey} className="bg-[#0b1c2c]  rounded-lg overflow-hidden shadow-lg">
            <div className="h-40 bg-gray-700 flex items-center justify-center">
              {sample.cover_url ? (
                <img
                  src={sample.cover_url}
                  alt={sample.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={fallbackImages[listKey] || "/images/baseImage.png"}
                  alt="Fallback"
                  className="w-full h-full object-cover"
                />
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
                onClick={() => onFilter(link)}
                className="mt-2 w-full justify-center"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
