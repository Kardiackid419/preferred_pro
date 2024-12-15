import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function EmployeeDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Employee Dashboard</h1>
        <div className="mt-4">
          <p>Welcome, {currentUser?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard; 