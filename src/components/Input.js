import React from 'react';

const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error = '',
  className = ''
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        required={required}
        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-preferred-green focus:border-transparent 
          ${error ? 'border-red-500' : 'border-gray-300'} 
          ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;