import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = {
    crew: [
      { title: 'Schedule', href: '/schedule' },
      { title: 'My Jobs', href: '/my-jobs' }
    ],
    foreman: [
      { title: 'Schedule', href: '/schedule' },
      { title: 'My Jobs', href: '/my-jobs' },
      { title: 'Foreman Tools', href: '/foreman' }
    ],
    admin: [
      { title: 'Schedule', href: '/schedule' },
      { title: 'All Jobs', href: '/jobs' },
      { title: 'Create Job', href: '/jobs/create' },
      { title: 'Manage Employees', href: '/employees' }
    ]
  };

  return (
    <nav className="bg-preferred-green text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              src="/images/preferred_logo.png"
              alt="Preferred Pro"
              className="h-8 w-auto"
            />
            <div className="relative ml-8" ref={menuRef}>
              <button 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-preferred-green-dark"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                Menu ▾
              </button>
              <div className={`absolute left-0 mt-2 w-screen max-w-md bg-white rounded-lg shadow-lg ${isMenuOpen ? 'block' : 'hidden'} z-50`}>
                <div className="grid grid-cols-1 gap-4 p-4">
                  {menuItems[currentUser.role].map(item => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-preferred-green px-4 py-2 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;