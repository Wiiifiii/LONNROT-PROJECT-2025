/* components/Card.jsx – buttons fill full row */
"use client";
import React from "react";
import Button from "./Button";
import { FaEye, FaInfoCircle, FaDownload, FaBook } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Card({ book }) {
  const router = useRouter();

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col space-y-2">
      {/* ─── Row 1 ─── */}
      <div className="flex items-center space-x-2">
        <FaBook className="text-3xl text-gray-400 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-bold leading-snug">{book.title}</h3>
          <p className="text-gray-400 text-sm leading-tight">By {book.author}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-300 space-y-0.5">
        {book.genres?.length > 0 && <p>Genres: {book.genres.join(", ")}</p>}
        {book.publicationYear && <p>Year: {book.publicationYear}</p>}
        {book.language && <p>Language: {book.language}</p>}
      </div>

      {/* ─── Row 2 : full‑width buttons ─── */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Button
            icon={FaEye}
            text="View"
            tooltip="Read the book online"
            onClick={() => router.push(`/books/${book.id}/read`)}
            className="w-full justify-center"
          />
        </div>
        <div className="flex-1">
          <Button
            icon={FaInfoCircle}
            text="Details"
            tooltip="Book details"
            onClick={() => router.push(`/books/${book.id}/bookdetail`)}
            className="w-full justify-center"
          />
        </div>
      </div>

      {/* ─── Row 3 : downloads (stacked) ─── */}
      <div className="flex flex-col space-y-2 items-stretch">
        <a
          href={book.file_url ?? "#"}
          download
          title="Download original TXT"
          className="inline-flex items-center gap-1 justify-center px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] transition text-sm"
        >
          <FaDownload /> Download TXT
        </a>
        <a
          href={book.pdf_url ?? "#"}
          download
          title="Download PDF"
          className="inline-flex items-center gap-1 justify-center px-4 py-2 bg-[#374151] rounded-full hover:bg-[#111827] transition text-sm"
        >
          <FaDownload /> Download PDF
        </a>
      </div>
    </div>
  );
}
