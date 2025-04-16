// components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ icon: Icon, text, tooltip, onClick, className }) => {
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-4 py-2 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300 text-sm ${className}`}
      title={tooltip}
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
};

export default Button;
