import React, { createContext, useState, useEffect } from 'react';
import { loginApi, signupApi, guestLoginApi, getMeApi, updatePreferencesApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('signal_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('signal_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getMeApi();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('signal_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.success && res.data) {
      const { token: newToken, ...userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('signal_token', newToken);
      localStorage.setItem('signal_user', JSON.stringify(userData));
      return userData;
    }
  };

  const signup = async (name, email, password) => {
    const res = await signupApi({ name, email, password });
    if (res.success && res.data) {
      const { token: newToken, ...userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('signal_token', newToken);
      localStorage.setItem('signal_user', JSON.stringify(userData));
      return userData;
    }
  };

  const guestLogin = async () => {
    const res = await guestLoginApi();
    if (res.success && res.data) {
      const { token: newToken, ...userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('signal_token', newToken);
      localStorage.setItem('signal_user', JSON.stringify(userData));
      return userData;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('signal_token');
    localStorage.removeItem('signal_user');
  };

  const updatePreferences = async (newPrefs) => {
    const res = await updatePreferencesApi(newPrefs);
    if (res.success && res.data) {
      const updatedUser = { ...user, preferences: res.data };
      setUser(updatedUser);
      localStorage.setItem('signal_user', JSON.stringify(updatedUser));
      return res.data;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, guestLogin, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};
