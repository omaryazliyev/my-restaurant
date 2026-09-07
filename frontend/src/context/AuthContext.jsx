import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      const authToken = res.accessToken || res.token;
      if (authToken) {
        setToken(authToken);
        setUser(res.user || { username: credentials.username });
        return { success: true };
      }
      return { success: false, message: res.message || 'Kirishda xatolik юз berdi' };
    } catch (err) {
      return { success: false, message: err.message || 'Server bilan aloqa xatosi' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      const authToken = res.accessToken || res.token;
      if (authToken) {
        setToken(authToken);
        setUser(res.user || { username: userData.username });
        return { success: true };
      }
      return { success: false, message: res.message || 'Ro\'yxatdan o\'tishda xatolik' };
    } catch (err) {
      return { success: false, message: err.message || 'Server bilan aloqa xatosi' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

