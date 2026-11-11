import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api, { setupInterceptors } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const tokenRef = useRef(accessToken);
  tokenRef.current = accessToken;

  // Interceptor setup & Initial silent refresh on app mount
  useEffect(() => {
    setupInterceptors(
      () => tokenRef.current,
      (newToken) => setAccessToken(newToken),
      () => {
        setAccessToken(null);
        setUser(null);
      }
    );

    const initAuth = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.access_token);
        setUser(data.user);
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Auth Methods
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, password_confirmation) => {
    const { data } = await api.post('/auth/register', { name, email, password, password_confirmation });
    if (data.access_token) {
      setAccessToken(data.access_token);
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (updatedData) => {
    // If updatedData is FormData, use POST with _method=PUT to bypass multipart issues in Laravel
    if (updatedData instanceof FormData) {
      updatedData.append('_method', 'PUT');
      const { data } = await api.post('/auth/profile', updatedData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(data.user || data);
      return data;
    }

    const { data } = await api.put('/auth/profile', updatedData);
    setUser(data.user || data);
    return data;
  };

  const deleteProfile = async () => {
    await api.delete('/auth/profile');
    setAccessToken(null);
    setUser(null);
  };

  const clearAuth = () => {
    setAccessToken(null);
    setUser(null);
  };

  const value = {
    user,
    setUser,
    accessToken,
    setAccessToken,
    loading,
    login,
    register,
    logout,
    updateProfile,
    deleteProfile,
    clearAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);