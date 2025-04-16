// components/Card.jsx
import React from 'react';
import Button from './Button';
import { FaEye, FaInfoCircle, FaDownload } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Card = ({ book }) => {
  const router = useRouter();
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1">{book.title}</h3>
        <p className="text-gray-400 mb-1">By {book.author}</p>
        {book.genres && book.genres.length > 0 && (
          <p className="text-gray-300 text-sm">Genres: {book.genres.join(', ')}</p>
        )}
        {book.publicationYear && (
          <p className="text-gray-300 text-sm">Year: {book.publicationYear}</p>
        )}
        {book.language && (
          <p className="text-gray-300 text-sm">Language: {book.language}</p>
        )}
      </div>
      <div className="flex space-x-2">
        <Button 
          icon={FaEye}
          text="View"
          tooltip="View or read the book"
          onClick={() => router.push(`/books/${book.id}/read`)}
        />
        <Button 
          icon={FaInfoCircle}
          text="Details"
          tooltip="See book details"
          onClick={() => router.push(`/books/${book.id}/bookdetail`)}
        />
        <a
          href={book.file_url || "#"}
          download
          title="Download book"
          className="inline-flex items-center gap-1 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300 text-sm"
        >
          <FaDownload className="mr-1" />
          Download
        </a>
      </div>
    </div>
  );
};

export default Card;
