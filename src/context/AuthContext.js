import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = async (email, password) => {
    // Mock login - in production this would verify credentials with a backend
    setCurrentUser({
      email: email,
      role: 'admin', // Set role to admin for testing
      id: '1'
    });
  };

  const logout = async () => {
    setCurrentUser(null);
  };

  const hasPermission = (requiredRole) => {
    if (!currentUser) return false;
    
    const roleHierarchy = {
      admin: 3,
      foreman: 2,
      crew: 1
    };
    
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  const value = {
    currentUser,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}