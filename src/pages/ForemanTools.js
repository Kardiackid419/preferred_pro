import React from 'react';
import Navigation from '../components/Navigation';

function ForemanTools() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Foreman Tools</h2>
          {/* Foreman tools content will go here */}
        </div>
      </main>
    </div>
  );
}

export default ForemanTools;