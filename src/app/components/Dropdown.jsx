// components/Dropdown.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">{label}</label>
      <select 
        value={value} 
        onChange={onChange} 
        className="px-4 py-2 rounded-md bg-gray-700 text-white"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dropdown;
