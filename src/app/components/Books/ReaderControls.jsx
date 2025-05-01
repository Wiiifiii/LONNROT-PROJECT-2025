'use client'
import React, { useState } from 'react'
import Button from './Button'
import Notification from '../UI/Notification'
import { AiOutlineArrowLeft, AiOutlineInfoCircle } from 'react-icons/ai'
import { FaFileAlt, FaPlus } from 'react-icons/fa'
import ReadingListSelector from './ReadingListSelector'
import Link from 'next/link';

export default function ReaderControls({ bookId, pdfUrl, txtUrl }) {
  const [showSelector, setShowSelector] = useState(false)
  const [notification, setNotification] = useState("")

  const handleAddToList = () => {
    setShowSelector(true)
  }

  const handleCloseSelector = () => {
    setShowSelector(false)
  }

  const handleAddSuccess = () => {
    setShowSelector(false)
    setNotification("Book added to your reading list.")
    setTimeout(() => setNotification(""), 3000)
  }

  const handlePdfDownload = () => {
    window.open(pdfUrl, '_blank')
    setNotification("PDF download initiated.")
    setTimeout(() => setNotification(""), 3000)
  }

  const handleTxtDownload = () => {
    window.open(txtUrl, '_blank')
    setNotification("TXT download initiated.")
    setTimeout(() => setNotification(""), 3000)
  }

  return (
    <>
      {/* Render Notification only when there's a message */}
      {notification && <Notification message={notification} />}
      
      <div className="flex justify-center space-x-4 my-4">
        <Button 
          onClick={() => window.location.href = '/books'}
          text="Back to Saga Haven" 
          icon={AiOutlineArrowLeft} 
          tooltip="Return to the books list"
        />
        <Button 
          onClick={() => window.location.href = `/books/${bookId}`}
          text="Seek the Lore" 
          icon={AiOutlineInfoCircle} 
          tooltip="View book details"
        />
        <Link href={`/books/${bookId}/read`} className="btn">
          PDF
        </Link>
        <Button 
          onClick={handleTxtDownload}
          text="TXT" 
          icon={FaFileAlt} 
          tooltip="Open TXT version"
        />
        <Button 
          onClick={handleAddToList}
          text="Add to Saga lists" 
          icon={FaPlus} 
          tooltip="Add this book to your reading list"
        />
      </div>
      {showSelector && (
        <ReadingListSelector 
          bookId={bookId} 
          onClose={handleCloseSelector}
          onAddSuccess={handleAddSuccess} 
        />
      )}
    </>
  )
}