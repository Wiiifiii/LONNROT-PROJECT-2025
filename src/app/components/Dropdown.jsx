// components/Dropdown.jsx
import React from 'react'
import PropTypes from 'prop-types'

const Dropdown = ({ label, placeholder, options, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="px-4 py-2 rounded-md bg-gray-700 text-white"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Dropdown
