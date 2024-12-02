import React from 'react';

export const Input = ({ 
  label, 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1.5 sm:mb-2">
        {label}
      </label>
      <input
        {...props}
        className={`
          w-full px-3 sm:px-4 py-2.5 sm:py-3 
          rounded-lg border-2 
          transition-all duration-200
          text-sm sm:text-base
          ${error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}
          focus:ring-2 focus:ring-preferred-green/20 
          focus:border-preferred-green
          ${className}
        `}
      />
      {error && (
        <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export const TextArea = ({ 
  label, 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1.5 sm:mb-2">
        {label}
      </label>
      <textarea
        {...props}
        className={`
          w-full px-3 sm:px-4 py-2.5 sm:py-3 
          rounded-lg border-2 
          transition-all duration-200
          text-sm sm:text-base
          ${error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}
          focus:ring-2 focus:ring-preferred-green/20 
          focus:border-preferred-green
          ${className}
        `}
      />
      {error && (
        <p className="mt-1.5 text-xs sm:text-sm text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};