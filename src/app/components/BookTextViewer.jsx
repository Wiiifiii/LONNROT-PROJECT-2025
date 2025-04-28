'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Tooltip from './Tooltip';
import Notification from './Notification';
import ReadingListSelector from './ReadingListSelector';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';
import {
  FaArrowLeft,
  FaInfoCircle,
  FaBookmark,
  FaThemeisle ,
  FaMoon,
  FaCoffee,
  BsFiletypePdf 
} from 'react-icons/fa';
import { BsFiletypeTxt } from "react-icons/bs";
import { FaEye, FaInfoCircle, FaDownload } from 'react-icons/fa'

/** “Rough” plain-text → Markdown converter */
function makeRoughMarkdown(txt) {
  return txt
    .split('\n')
    .map(line => {
      const t = line.trim();
      if (t.length > 3 && /^[A-ZÅÄÖ0-9 '"–—-]+$/.test(t)) {
        return `## ${t}`;
      }
      if (/^[-–•*]\s+/.test(t)) {
        return `- ${t.replace(/^[-–•*]\s+/, '')}`;
      }
      if (t.startsWith('>')) {
        return `> ${t.slice(1).trim()}`;
      }
      return line.replace(/'([^']+)'/g, '*$1*');
    })
    .join('\n');
}

export default function BookTextViewer({
  initialText,
  bookId,
  bookTitle,
  bookAuthor
}) {
  const router = useRouter();
  const containerRef = useRef(null);

  const [fontSize, setFontSize] = useState(30);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [headings, setHeadings] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [showResume, setShowResume] = useState(false);
  const [notif, setNotif] = useState(null);
  const [showListSelector, setShowListSelector] = useState(false);

  // Persist theme
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

  // Restore scroll + resume banner
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !bookId) return;
    const saved = +localStorage.getItem(`read-offset:${bookId}`) || 0;
    const dismissed = localStorage.getItem(`resume-dismissed:${bookId}`) === 'true';
    el.scrollTop = saved;
    const ratio = saved / (el.scrollHeight - el.clientHeight);
    if (ratio > 0.05 && !dismissed) setShowResume(true);
  }, [bookId]);

  // Compute total pages
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setTotalPages(Math.ceil(el.scrollHeight / el.clientHeight) || 1);
  }, [initialText, fontSize]);

  // On scroll
  const handleScroll = e => {
    const el = e.target;
    const st = el.scrollTop;
    localStorage.setItem(`read-offset:${bookId}`, st);
    const pct = (st / (el.scrollHeight - el.clientHeight)) * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
    setCurrentPage(Math.floor(st / el.clientHeight) + 1);
  };

  const onAddSuccess = () => setNotif({ type: 'success', message: 'Added to reading list!' });

  // Panel styles
  const panelBg = theme === 'dark' ? 'bg-card-dark'
    : theme === 'light' ? 'bg-card'
      : 'bg-yellow-50';
  const panelBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const panelText = theme === 'dark' ? 'text-white' : 'text-black';
  const ICON = 20;

  // Convert to Markdown
  const mdText = makeRoughMarkdown(initialText);

  // Gather headings for TOC
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const nodes = el.querySelectorAll('h1,h2,h3');
    setHeadings(Array.from(nodes).map(node => ({
      id: node.id,
      text: node.textContent,
      level: Number(node.tagName.slice(1))
    })));
  }, [mdText, fontSize, theme]);

  return (
    <div className="lg:flex lg:space-x-6">
      <TableOfContents
        headings={headings}
        rawText={initialText}
        containerRef={containerRef}
        panelBg={panelBg}
        panelText={panelText}
        panelBorder={panelBorder}
      />

      <div className="flex-1 space-y-4 relative">
        {showResume && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-card-dark text-white px-4 py-2 rounded shadow-lg z-50 flex items-center gap-3">
            <span>You left off at {Math.floor(progress)}% —</span>
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

        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
          <div
            className="h-full bg-accent transition-width duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Toolbar */}
        <div className={`flex items-center flex-wrap gap-2 p-2 rounded border-b ${panelBg} ${panelBorder}`}>
          {/* ← “You are reading…” moved here */}
          <div className={`${panelText} flex items-center gap-1 mr-auto text-sm`}>
            <span role="img" aria-label="book">📖</span>
            <span>You are reading</span>
            <span className="underline ml-1">{bookTitle}</span>
            <span className="ml-1">— {bookAuthor}</span>
          </div>

          <Tooltip content="To Saga Haven">
            <button
              onClick={() => router.push('/books')}
              className={`${panelText} p-2 rounded`}
            >
              <GiMagicGate size={ICON} />
            </button>
          </Tooltip>

          <Tooltip content="Seek the Lore">
            <button
              onClick={() => router.push(`/books/${bookId}/bookdetail`)}
              className={`${panelText} p-2 rounded`}
            >
              <FaInfoCircle size={ICON} />
            </button>
          </Tooltip>

          <Tooltip content="Add to Saga lists">
            <button
              onClick={() => setShowListSelector(v => !v)}
              className={`${panelText} p-2 rounded`}
            >
              <FaBookmark size={ICON} />
            </button>
          </Tooltip>

          <Tooltip content="Theme">
            <button
              onClick={cycleTheme}
              className={`${panelText} p-2 rounded`}
            >
              {theme === 'dark'
                ? <FaThemeisle  size={ICON} />
                : theme === 'light'
                  ? <FaMoon size={ICON} />
                  : <FaCoffee size={ICON} />}
            </button>
          </Tooltip>

          {/* Download TXT */}
          <Tooltip content="Keep the Rune TXT">
            <a
              href={`/api/books/${bookId}/download?format=txt`}
              target="_blank"
              rel="noopener"
              className={`${panelText} p-2 rounded`}
            >
              <BsFiletypeTxt size={ICON} />
            </a>
          </Tooltip>

          {/* Download PDF */}
          <Tooltip content="Keep the Rune PDF">
            <a
              href={`/api/books/${bookId}/download?format=pdf`}
              target="_blank"
              rel="noopener"
              className={`${panelText} p-2 rounded`}
            >
              <BsFiletypePdf  size={ICON} />
            </a>
          </Tooltip>

          <button
            onClick={() => setFontSize(f => f + 2)}
            className={`px-3 py-1 rounded ${panelBg} ${panelText}`}
          >
            A+
          </button>
          <button
            onClick={() => setFontSize(f => Math.max(12, f - 2))}
            className={`px-3 py-1 rounded ${panelBg} ${panelText}`}
          >
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

        {/* Scrollable text container (all white!) */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          style={{
            height: '75vh',
            fontSize: `${fontSize}px`,
            resize: 'vertical',
            overflow: 'auto',
          }}
          className={`rounded p-6 border ${panelBorder} ${panelBg} ${theme === 'dark' ? 'markdown-white' : 'text-black'}`}
        >
          <MarkdownRenderer text={mdText} fontSize={fontSize} theme={theme} />
        </div>
      </div>
    </div>
  );
}
