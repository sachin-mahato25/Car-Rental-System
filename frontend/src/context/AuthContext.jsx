import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("carRentalUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem("carRentalUser", JSON.stringify(userData));
    localStorage.setItem("carRentalToken", userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("carRentalUser");
    localStorage.removeItem("carRentalToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAdmin: user?.role === "ADMIN" }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
