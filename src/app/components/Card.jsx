"use client";
import React, { useEffect, useState } from "react";
import { FaEye, FaInfoCircle, FaDownload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Button from "./Button";

const truncate = (s) => (s.length > 15 ? s.slice(0, 15) + "…" : s);

export function Card({ book, stats: initialStats }) {
  const router = useRouter();
  const [stats, setStats] = useState(initialStats ?? { DOWNLOAD: 0, READ_START: 0 });

  useEffect(() => {
    fetch(`/api/books/${book.id}/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, [book.id]);

  const bumpDownload = () => {
    fetch(`/api/books/${book.id}/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 flex flex-col space-y-4 h-full">
      <div className="flex items-center gap-2">
        <FaInfoCircle className="text-3xl text-gray-400" />
        <div>
          <h3 className="text-lg font-bold">{truncate(book.title)}</h3>
          <p className="text-gray-400 text-sm">{book.author}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Downloads: {stats.DOWNLOAD} Views: {stats.READ_START}
      </p>

      <div className="flex gap-2">
        <Button
          icon={FaEye}
          text="Open the Saga"
          onClick={() => router.push(`/books/${book.id}/read`)}
          className="flex-1 justify-center"
        />
        <Button
          icon={FaInfoCircle}
          text="Seek the Lore"
          onClick={() => router.push(`/books/${book.id}/bookdetail`)}
          className="flex-1 justify-center"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <a
          href={`/api/books/${book.id}/download?format=txt`}
          onClick={bumpDownload}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#374151] rounded-full hover:bg-[#111827] text-base"
        >
          <FaDownload /> Take the Sampo TXT
        </a>
        <a
          href={`/api/books/${book.id}/download?format=pdf`}
          onClick={bumpDownload}
          target="_blank"
          rel="noopener"
          className={`inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm ${
            book.pdf_url ? "" : "opacity-50 cursor-not-allowed"
          }`}
        >
          <FaDownload /> Take the Sampo PDF
        </a>
      </div>
    </div>
  );
}

export default function BookGrid({ books }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card key={book.id} book={book} />
      ))}
    </div>
  );
}
