// src/app/components/Modal.jsx
'use client'
import React, { useEffect } from 'react'

export default function Modal({ isOpen, title, onClose, children }) {
  // close on Escape key
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
       className="
         bg-[#0b1c2c] bg-opacity-50 backdrop-blur-sm
         rounded-lg w-full max-w-2xl max-h-[85vh]
         overflow-auto p-6 mx-4 sm:mx-0 relative
       "        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>
        {title && (
          <h2 className="text-xl font-semibold text-white mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}
