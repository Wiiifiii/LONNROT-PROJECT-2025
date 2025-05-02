// src/app/components/Books/ReadStartLogger.client.jsx
'use client';

import { useEffect, useRef } from 'react';

export default function ReadStartLogger({ bookId }) {
  const didLog = useRef(false);

  useEffect(() => {
    if (didLog.current) return;
    didLog.current = true;

    // 1 POST, period
    fetch(`/api/books/${bookId}/read-start`, { method: 'POST' });
  }, [bookId]);

  return null;
}
