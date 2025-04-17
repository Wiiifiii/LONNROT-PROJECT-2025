"use client";
import React, { useEffect, useState } from "react";
import { FaEye, FaInfoCircle, FaDownload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Button from "./Button";

const truncate = (s) => (s.length > 15 ? s.slice(0, 15) + "…" : s);

export default function Card({ book, stats: initialStats }) {
  const router = useRouter();
  // If parent passed stats, use them; otherwise start at zero
  const [stats, setStats] = useState(
    initialStats ?? { DOWNLOAD: 0, READ_START: 0 }
  );

  // Only fetch if no stats were provided
  // useEffect(() => {
  //   if (initialStats) return;
  //   let cancelled = false;
  //   fetch(`/api/books/${book.id}/stats`)
  //     .then((r) => r.json())
  //     .then((data) => {
  //       if (!cancelled) setStats(data);
  //     })
  //     .catch(() => {});
  //   return () => {
  //     cancelled = true;
  //   };
  // }, [book.id, initialStats]);

  // Just fetch stats on mount, always

  useEffect(() => {
    fetch(`/api/books/${book.id}/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => { });
  }, [book.id]);

  // bump counts after a download click
  const bumpDownload = () => {
    fetch(`/api/books/${book.id}/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => { });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <FaInfoCircle className="text-3xl text-gray-400" />
        <div>
          <h3 className="text-lg font-bold">
            {truncate(book.title)}
          </h3>
          <p className="text-gray-400 text-sm">
            {book.author}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Downloads: {stats.DOWNLOAD}  Views: {stats.READ_START}
      </p>

      <div className="flex gap-2">
        <Button
          icon={FaEye}
          text="View"
          onClick={() => {
            router.push(`/books/${book.id}/read`);
          }}
          className="flex-1 justify-center"
        />
        <Button
          icon={FaInfoCircle}
          text="Details"
          onClick={() =>
            router.push(`/books/${book.id}/bookdetail`)
          }
          className="flex-1 justify-center"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <a
          href={`/api/books/${book.id}/download?format=txt`}
          onClick={bumpDownload}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm"
        >
          <FaDownload /> TXT
        </a>
        <a
          href={`/api/books/${book.id}/download?format=pdf`}
          onClick={bumpDownload}
          target="_blank"
          rel="noopener"
          className={`inline-flex items-center justify-center gap-1 px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] text-sm ${book.pdf_url ? "" : "opacity-50 cursor-not-allowed"
            }`}
        >
          <FaDownload /> PDF
        </a>
      </div>
    </div>
  );
}
