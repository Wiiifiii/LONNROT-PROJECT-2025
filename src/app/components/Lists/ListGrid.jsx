"use client";

import React from "react";
import ReadingListItemCard from "./ReadingListItemCard";

export default function ListGrid({ items, onRead, onDetails, onRemove }) {
  if (items.length === 0) {
    return <p className="text-gray-400">This list is empty.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(({ book }) => (
        <ReadingListItemCard
          key={book.id}
          book={book}
          onRead={onRead}
          onDetails={onDetails}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
