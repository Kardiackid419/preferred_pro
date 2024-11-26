import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Schedule from './pages/Schedule';
import AddJob from './pages/AddJob';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Routes>
          <Route path="/schedule" element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          } />
          <Route path="/add-job" element={
            <ProtectedRoute allowedRoles={['admin', 'foreman']}>
              <AddJob />
            </ProtectedRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/schedule" />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleTabClose = event => {
      event.preventDefault();
      logout();
    };

    window.addEventListener('unload', handleTabClose);
    return () => {
      window.removeEventListener('unload', handleTabClose);
    };
  }, [logout]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
};

export default App;
