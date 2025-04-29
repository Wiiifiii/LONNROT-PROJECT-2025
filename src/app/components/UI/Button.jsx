// components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@/app/components/UI/Tooltip';

const Button = ({ icon: Icon, text, tooltip, onClick, className = '' }) => {
  const btn = (
    <button
      onClick={onClick}
      className={`
        w-full sm:w-auto inline-flex items-center justify-center gap-2
        px-4 py-2 bg-[#374151] text-white rounded-full
        hover:bg-[#0b1c2c] transition duration-300 text-sm font-medium
        ${className}
      `}
    >
      {Icon && <Icon className="text-sm" />}
      {text}
    </button>
  );
  return tooltip ? <Tooltip text={tooltip}>{btn}</Tooltip> : btn;
};

Button.propTypes = {
  icon: PropTypes.elementType,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
