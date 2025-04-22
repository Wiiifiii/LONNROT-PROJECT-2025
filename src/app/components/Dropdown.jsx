// src/app/components/Dropdown.jsx
import React from 'react'

/**
 * @param {Array<{value:string,label:string}>} options
 * @param {string} value
 * @param {function} onChange
 * @param {string} className
 */
export default function Dropdown({ options, value, onChange, className = '' }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-4 py-2 rounded-md bg-gray-700 text-white ${className}`}
    >
      <option value="">All</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
