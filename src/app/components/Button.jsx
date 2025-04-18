// components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ icon: Icon, text, tooltip, onClick, className, type = 'button' }) => {
  return (
    <button      type={type}
     onClick={onClick}
     className={`inline-flex items-center gap-2 px-6 py-3 bg-[#374151] text-white rounded-full hover:bg-[#111827] transition duration-300 text-base ${className}`}
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
  type: PropTypes.oneOf(['button','submit','reset']),
};

export default Button;
