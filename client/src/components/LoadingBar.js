import React from 'react';

const LoadingBar = () => {
  return (
    <div className="flex flex-col items-center">
      <img
        src="/images/preferred_logo.png"
        alt="Loading..."
        className="w-auto h-16 object-contain mb-4"
      />
      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default LoadingBar;