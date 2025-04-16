// components/SearchInput.jsx
import React from 'react';
import PropTypes from 'prop-types';

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-4 py-2 rounded-md bg-gray-700 text-white w-full max-w-xs"
    />
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchInput;
