import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
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

    /*
    // --- BACKEND API (Vaqtincha izohga olindi) ---
    try {
      const res = await authApi.login(credentials);
      const authToken = res.accessToken || res.token;
      if (authToken) {
        setToken(authToken);
        setUser(res.user || { username: credentials.username });
        return { success: true };
      }
      return { success: false, message: res.message || 'Kirishda xatolik yuz berdi' };
    } catch (err) {
      return { success: false, message: err.message || 'Server bilan aloqa xatosi' };
    } finally {
      setLoading(false);
    }
    // ---------------------------------------------
    */

    // Standalone Frontend kirish:
    // Admin: omar / 18062004
    const isAdmin =
      credentials?.username === 'omar' &&
      credentials?.password === '18062004';

    if (!isAdmin && credentials?.username !== 'omar') {
      // Har qanday boshqa foydalanuvchi — CLIENT sifatida kiradi
    } else if (!isAdmin) {
      // omar bilan noto'g'ri parol
      setLoading(false);
      return { success: false, message: 'Username yoki parol noto\'g\'ri' };
    }

    const loggedUser = {
      id: isAdmin ? 1 : Date.now(),
      username: credentials?.username || 'Mehmon',
      role: isAdmin ? 'ADMIN' : 'CLIENT',
    };
    const mockToken = isAdmin ? 'admin-token-omar' : 'client-token';
    setUser(loggedUser);
    setToken(mockToken);
    setLoading(false);
    return { success: true, role: loggedUser.role };
  };

  const register = async (userData) => {
    setLoading(true);

    /*
    // --- BACKEND API (Vaqtincha izohga olindi) ---
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
    // ---------------------------------------------
    */

    // Standalone Frontend ro'yxatdan o'tish:
    const registeredUser = {
      id: 1,
      username: userData?.username || 'Oybek',
      firstName: userData?.firstName || 'Oybek',
      lastName: userData?.lastName || '',
      role: 'CLIENT',
    };
    const mockToken = 'mock-demo-token';
    setUser(registeredUser);
    setToken(mockToken);
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

