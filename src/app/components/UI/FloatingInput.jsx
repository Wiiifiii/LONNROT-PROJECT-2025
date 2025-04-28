'use client'

import React from 'react'

/**
 * FloatingInput
 * @param {{ 
 *   id: string,
 *   label: string,
 *   type?: string,
 *   value: string,
 *   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   trailingIcon?: React.ReactNode
 * }} props
 */
export default function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  trailingIcon = null
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 pt-6 pb-2 bg-gray-700 text-white rounded-lg border border-gray-600 peer"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-gray-400 text-sm transition-all
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                   peer-focus:top-2 peer-focus:text-sm"
      >
        {label}
      </label>
      {trailingIcon && (
        <div className="absolute right-3 top-3">
          {trailingIcon}
        </div>
      )}
    </div>
  )
}
