import React from 'react';

const variants = {
  primary: 'bg-preferred-green text-white hover:bg-preferred-green/90',
  secondary: 'border-2 border-gray-200 text-gray-600 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};

export const Button = ({ 
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props 
}) => {
  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};