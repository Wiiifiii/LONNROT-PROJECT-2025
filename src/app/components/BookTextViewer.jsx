'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter }                         from 'next/navigation';
import Tooltip                               from './Tooltip';
import Notification                          from './Notification';
import ReadingListSelector                   from './ReadingListSelector';
import MarkdownRenderer                      from './MarkdownRenderer';
import TableOfContents                       from './TableOfContents';
import {
  FaArrowLeft,
  FaInfoCircle,
  FaBookmark,
  FaSun,
  FaMoon,
  FaCoffee
} from 'react-icons/fa';

export default function BookTextViewer({
  initialText,
  bookId,
  bookTitle,
  bookAuthor
}) {
  const router       = useRouter();
  const containerRef = useRef(null);

  const [fontSize, setFontSize]             = useState(16);
  const [progress, setProgress]             = useState(0);
  const [currentPage, setCurrentPage]       = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [headings, setHeadings]             = useState([]);
  const [theme, setTheme]                   = useState('dark');
  const [showResume, setShowResume]         = useState(false);
  const [notif, setNotif]                   = useState(null);
  const [showListSelector, setShowListSelector] = useState(false);

  // ─ theme persistence ──────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('reading-theme');
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem('reading-theme', theme);
  }, [theme]);
  const cycleTheme = () => {
    const modes = ['dark', 'light', 'sepia'];
    setTheme(modes[(modes.indexOf(theme) + 1) % 3]);
  };

  // ─ restore scroll + resume banner ──────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !bookId) return;
    const saved     = +localStorage.getItem(`read-offset:${bookId}`) || 0;
    const dismissed = localStorage.getItem(`resume-dismissed:${bookId}`) === 'true';
    el.scrollTop    = saved;
    const ratio = saved / (el.scrollHeight - el.clientHeight);
    if (ratio > 0.05 && !dismissed) setShowResume(true);
  }, [bookId]);

  // ─ compute total pages ─────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setTotalPages(Math.ceil(el.scrollHeight / el.clientHeight) || 1);
  }, [initialText, fontSize]);

  // ─ handle scroll ───────────────────────────────────────────────
  const handleScroll = e => {
    const el = e.target;
    const st = el.scrollTop;
    localStorage.setItem(`read-offset:${bookId}`, st);
    const pct = (st / (el.scrollHeight - el.clientHeight)) * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
    setCurrentPage(Math.floor(st / el.clientHeight) + 1);
  };

  const onAddSuccess = () => setNotif({ type: 'success', message: 'Added to reading list!' });

  // ─ panel colors ────────────────────────────────────────────────
  const panelBg   = theme === 'dark'
    ? 'bg-card-dark'
    : theme === 'light'
      ? 'bg-card'
      : 'bg-yellow-50';
  const panelText = theme === 'dark'
    ? 'text-primary-dark'
    : 'text-primary';
  const panelBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const ICON = 20;

  return (
    <div className="lg:flex lg:space-x-6">
      <TableOfContents
        headings={headings}
        containerRef={containerRef}
        panelBg={panelBg}
        panelText={panelText}
        panelBorder={panelBorder}
      />

      <div className="flex-1 space-y-4 relative">
        {showResume && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-card-dark text-white px-4 py-2 rounded shadow-lg z-50 flex items-center gap-4">
            <span>You left off at {Math.floor(progress)}%—</span>
            <button
              onClick={() => {
                const saved = +localStorage.getItem(`read-offset:${bookId}`);
                containerRef.current.scrollTop = saved;
                setShowResume(false);
              }}
              className="underline"
            >
              Resume
            </button>
            <button
              onClick={() => {
                localStorage.setItem(`resume-dismissed:${bookId}`, 'true');
                setShowResume(false);
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {notif && (
          <Notification
            type={notif.type}
            message={notif.message}
            onClose={() => setNotif(null)}
          />
        )}

        <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
          <div
            className="h-full bg-accent transition-width duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={`flex flex-wrap items-center gap-2 p-2 rounded border-b ${panelBg} ${panelBorder}`}>
          <Tooltip content="Back to shelf">
            <button onClick={() => router.push('/books')} className={`${panelText} p-2 rounded`}>
              <FaArrowLeft size={ICON} />
            </button>
          </Tooltip>
          <Tooltip content="Details">
            <button onClick={() => router.push(`/books/${bookId}/bookdetail`)} className={`${panelText} p-2 rounded`}>
              <FaInfoCircle size={ICON} />
            </button>
          </Tooltip>
          <Tooltip content="Add to list">
            <button onClick={() => setShowListSelector(v => !v)} className={`${panelText} p-2 rounded`}>
              <FaBookmark size={ICON} />
            </button>
          </Tooltip>
          <Tooltip content="Theme">
            <button onClick={cycleTheme} className={`${panelText} p-2 rounded`}>
              {theme === 'dark' ? (
                <FaSun size={ICON} />
              ) : theme === 'light' ? (
                <FaMoon size={ICON} />
              ) : (
                <FaCoffee size={ICON} />
              )}
            </button>
          </Tooltip>

          <button onClick={() => setFontSize(f => f + 2)} className={`px-3 py-1 rounded ${panelBg} ${panelText}`}>
            A+
          </button>
          <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className={`px-3 py-1 rounded ${panelBg} ${panelText}`}>
            A–
          </button>
        </div>

        {showListSelector && (
          <ReadingListSelector
            bookId={bookId}
            onClose={() => setShowListSelector(false)}
            onAddSuccess={onAddSuccess}
          />
        )}

        <div className={`${panelText} text-sm`}>
          Page {currentPage} of {totalPages}
        </div>

        <div
          ref={containerRef}
          onScroll={handleScroll}
          className={`${panelBg} ${panelText} overflow-y-auto rounded p-6 border ${panelBorder}`}
          style={{ fontSize: `${fontSize}px`, height: '75vh' }}
        >
          <MarkdownRenderer
            text={initialText}
            theme={theme}
            collectHeadings={setHeadings}
          />
        </div>
      </div>
    </div>
  );
}
