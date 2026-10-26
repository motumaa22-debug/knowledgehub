import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Authentication Context
 * Manages user authentication state, tokens, and active session profile.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from localStorage on boot
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('kh_token');
      const storedUser = localStorage.getItem('kh_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.warn('Failed to parse cached session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (authToken) localStorage.setItem('kh_token', authToken);
    if (userData) localStorage.setItem('kh_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kh_token');
    localStorage.removeItem('kh_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
