// src/app/components/StarRating.jsx
"use client";

import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

/**
 * @param {number} rating 
 * @param {(number) => void} [onChange] 
 * @param {boolean} [readOnly] 
 */
export default function StarRating({ rating = 0, onChange, readOnly = false }) {
  const handleStarClick = (value) => {
    if (!readOnly && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          onClick={() => handleStarClick(value)}
          style={{ cursor: readOnly ? "default" : "pointer" }}
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
