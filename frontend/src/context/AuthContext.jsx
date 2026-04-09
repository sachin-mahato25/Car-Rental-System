import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext(null);

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes of inactivity

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('carRentalUser');
    return saved ? JSON.parse(saved) : null;
  });

  const timerRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const warningTimerRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem('carRentalUser');
    localStorage.removeItem('carRentalToken');
    setUser(null);
    setShowWarning(false);
    clearTimeout(timerRef.current);
    clearTimeout(warningTimerRef.current);
  }, []);

  const login = (userData) => {
    localStorage.setItem('carRentalUser', JSON.stringify(userData));
    localStorage.setItem('carRentalToken', userData.token);
    setUser(userData);
    setShowWarning(false);
  };

  const resetTimer = useCallback(() => {
    if (!localStorage.getItem('carRentalToken')) return;
    setShowWarning(false);
    clearTimeout(timerRef.current);
    clearTimeout(warningTimerRef.current);

    // Show warning 1 minute before logout
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, INACTIVITY_TIMEOUT - 60000);

    // Auto logout after inactivity
    timerRef.current = setTimeout(() => {
      logout();
      window.location.href = '/login';
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  // Track user activity
  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
      clearTimeout(warningTimerRef.current);
    };
  }, [user, resetTimer]);

  // Logout when tab/browser is closed
  useEffect(() => {
    const handleTabClose = () => {
      localStorage.removeItem('carRentalUser');
      localStorage.removeItem('carRentalToken');
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => window.removeEventListener('beforeunload', handleTabClose);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}

      {/* Inactivity Warning Popup */}
      {showWarning && user && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          background: '#1e293b', color: 'white', borderRadius: '16px',
          padding: '20px 24px', maxWidth: '320px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease'
        }}>
          <style>{`@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '24px' }}>⏰</span>
            <strong style={{ fontSize: '15px' }}>Session Expiring Soon</strong>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 14px' }}>
            You will be automatically logged out in <strong style={{ color: '#fbbf24' }}>1 minute</strong> due to inactivity.
          </p>
          <button onClick={resetTimer} style={{
            width: '100%', background: '#2563eb', color: 'white', border: 'none',
            padding: '10px', borderRadius: '8px', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer'
          }}>
            Stay Logged In
          </button>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
