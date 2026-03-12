import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Use sessionStorage instead of localStorage
  // sessionStorage clears when browser tab is closed
  // but keeps data on page refresh
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('carRentalUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    sessionStorage.setItem('carRentalUser', JSON.stringify(userData));
    sessionStorage.setItem('carRentalToken', userData.token);
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('carRentalUser');
    sessionStorage.removeItem('carRentalToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
