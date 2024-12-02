import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Navigation() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const logo = "/images/preferred_logo.png";

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin':
        return 'Signed in as Admin';
      case 'foreman':
        return 'Signed in as Foreman';
      case 'crew':
        return 'Signed in as Crew Member';
      default:
        return 'Signed in';
    }
  };

  return (
    <nav className="bg-preferred-green p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col items-center w-full">
          <img src={logo} alt="Preferred Pro" className="h-12 w-auto mb-4" />
          <div className="flex justify-between w-full px-4">
            <div className="group relative">
              <button className="px-4 py-2 bg-white/10 rounded-md text-white hover:bg-white/20 transition-colors duration-200 flex items-center">
                Menu
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1 hover:block">
                  <Link to="/schedule" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Schedule</Link>
                  {currentUser?.role === 'admin' && (
                    <>
                      <Link to="/jobs/create" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Create Job</Link>
                      <Link to="/employees" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Employees</Link>
                    </>
                  )}
                  {currentUser?.role === 'foreman' && (
                    <Link to="/foreman" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Foreman Tools</Link>
                  )}
                  <Link to="/all-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    All Jobs
                  </Link>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-yellow-500 text-preferred-green font-medium rounded-md hover:bg-yellow-400 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
          <span className="text-white text-center mt-2">{getRoleDisplay(currentUser?.role)}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;