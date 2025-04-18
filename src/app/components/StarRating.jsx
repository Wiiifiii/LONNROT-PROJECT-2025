// Summary: Renders a star rating component that displays a row of 5 stars. Clicking a star updates the rating via a callback.

"use client";

import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function StarRating({ rating, onChange }) {
  const handleStarClick = (value) => {
    onChange(value);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          onClick={() => handleStarClick(value)}
          style={{ cursor: "pointer" }}
        >
          {value <= rating ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );
}
