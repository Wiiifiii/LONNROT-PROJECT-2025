// src/app/components/ReadingListItemCard.jsx
"use client";

import React from "react";
import { FaEye, FaInfoCircle, FaTrash } from "react-icons/fa";
import Button from "./Button";
import Tooltip from "./Tooltip";

export default function ReadingListItemCard({ book, onRead, onDetails, onRemove }) {
  return (
    <div className="bg-[#111827]  rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-white">{book.title}</h3>
        <p className="text-sm text-gray-400">by {book.author}</p>
      </div>
      <div className="mt-4 flex space-x-2">
        <Tooltip content="Start reading">
          <Button icon={FaEye} onClick={() => onRead(book.id)} />
        </Tooltip>
        <Tooltip content="View details">
          <Button icon={FaInfoCircle} onClick={() => onDetails(book.id)} />
        </Tooltip>
        <Tooltip content="Remove from list">
          <Button icon={FaTrash} onClick={() => onRemove(book.id)} />
        </Tooltip>
      </div>
    </div>
  );
}
