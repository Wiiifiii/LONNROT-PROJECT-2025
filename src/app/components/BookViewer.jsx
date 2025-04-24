
// src/app/components/BookViewer.jsx
"use client";

import React, { useState, useCallback } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { FaDownload, FaListUl, FaInfoCircle, FaBook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Button from './Button';
import ReadingListSelector from './ReadingListSelector';
import Notification from './Notification';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function BookViewer({ bookId, pdfUrl, txtUrl, book }) {
  const [showListSelector, setShowListSelector] = useState(false);
  const [notification, setNotification] = useState(null);
  const router = useRouter();
  const layoutPluginInstance = defaultLayoutPlugin();

  // Handle file download (PDF / TXT)
  const handleDownload = useCallback(
    (format) => {
      const url = format === 'pdf' ? pdfUrl : txtUrl;
      if (!url) {
        setNotification({
          type: 'error',
          message: `${format.toUpperCase()} not available`,
        });
        return;
      }
      window.open(url, '_blank', 'noopener');
      // Trigger stats bump (if needed)
      fetch(`/api/books/${bookId}/stats`).catch(() => {});
      setNotification({
        type: 'success',
        message: `${book.title} ${format.toUpperCase()} download started!`,
      });
    },
    [bookId, book, pdfUrl, txtUrl]
  );

  return (
    <div className="flex flex-col h-full">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}

      {/* Toolbar */}
      <div className="px-2 sm:px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full bg-[#111827] p-3 rounded space-y-3 md:space-y-0">
          <div className="text-white">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{book.title}</h1>
            <p className="text-sm text-gray-300 truncate">by {book.author}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <Button icon={FaDownload} text="PDF" tooltip="Download PDF" onClick={() => handleDownload('pdf')} />
            <Button icon={FaDownload} text="TXT" tooltip="Download TXT" onClick={() => handleDownload('txt')} />
            <Button icon={FaListUl} text="Add to List" tooltip="Add to Reading List" onClick={() => setShowListSelector(true)} />
            <Button icon={FaInfoCircle} text="Details" tooltip="View Book Details" onClick={() => router.push(`/books/${bookId}/bookdetail`)} />
            <Button icon={FaBook} text="Books" tooltip="Back to Books" onClick={() => router.push('/books')} />
          </div>
        </div>
      </div>

      {/* PDF Viewer filling remaining space */}
      {pdfUrl && (
        <div className="flex-1 overflow-hidden bg-gray-700">
          <div className="h-[calc(100vh-160px)] overflow-auto">
          <Worker workerUrl="/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} plugins={[layoutPluginInstance]} defaultScale={1} />
          </Worker>
          </div>
        </div>
      )}

      {/* Reading-list selector */}
      {showListSelector && (
        <ReadingListSelector
          bookId={bookId}
          onClose={() => setShowListSelector(false)}
          onAddSuccess={() =>
            setNotification({ type: 'success', message: 'Added to list!' })
          }
        />
      )}
    </div>
  );
}
