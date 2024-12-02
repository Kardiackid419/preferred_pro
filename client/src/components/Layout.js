import React, { useEffect } from 'react';

function Layout({ children }) {
  useEffect(() => {
    // This will help us debug if the image is loading
    const img = new Image();
    img.onload = () => console.log('Background image loaded successfully');
    img.onerror = () => console.error('Failed to load background image');
    img.src = '/images/preferred_50th.png';
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Logo with absolute positioning */}
      <div 
        className="fixed inset-0 flex items-center justify-center"
        style={{
          opacity: '0.1',  // Made it a bit more visible for testing
          zIndex: '-1'
        }}
      >
        <img
          src="/images/preferred_50th.png"
          alt="Preferred 50th Anniversary"
          className="max-w-[80%] max-h-[80%] object-contain"
          style={{
            pointerEvents: 'none'
          }}
          onError={(e) => console.error('Image failed to load:', e)}
        />
      </div>
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

export default Layout;