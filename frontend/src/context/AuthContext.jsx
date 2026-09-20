import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';
import { TOKEN_STORAGE_KEY } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current authentication state
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((userData) => {
        setUser(userData);
      })
      .catch((err) => {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (username, password) => {
    const data = await authApi.login({ username, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access);
    const currentUser = await authApi.getMe();
    setUser(currentUser);
    return currentUser;
  };

  const register = async (name, email, password) => {
    await authApi.register({ name, email, password });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
