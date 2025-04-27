// src/app/authors/[slug]/page.jsx
export const dynamic = 'force-dynamic';

import React from 'react';
import ComingSoon from '@/app/components/ComingSoon';

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const authorName = slug
    .split('-')
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');

  return (
   
         <ComingSoon featureName={`About ${authorName}`}>
      <h1 className="text-3xl font-bold mb-4">About {authorName}</h1>
      <p className="mb-6">Author details coming soon…</p>
      <a
        href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
          authorName
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline"
      >
        🔍 Search Wikipedia for {authorName}
      </a>
    </ComingSoon>
  );
}
