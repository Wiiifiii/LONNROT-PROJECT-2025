// components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ icon: Icon, text, tooltip, onClick, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300 text-base w-auto min-w-fit ${className}`}
      title={tooltip}
      disabled={className.includes('cursor-not-allowed')} // Disable button if it's visually inactive
    >
      {Icon && <Icon className="mr-1" />}
      {text}
    </button>
  );
};



Button.propTypes = {
  icon: PropTypes.elementType,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button','submit','reset']),
};

export default Button;
