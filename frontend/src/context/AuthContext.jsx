import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { setAccessToken, registerOnRefreshFailed } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessTokenState, setAccessTokenState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to update access token both in Axios in-memory and state
  const handleSetAccessToken = (token) => {
    setAccessToken(token);
    setAccessTokenState(token);
  };

  const refreshUser = async () => {
    try {
      const meData = await authService.getMe();
      if (meData?.success && meData?.data) {
        setUser(meData.data);
        setIsAuthenticated(true);
        return meData.data;
      }
    } catch (err) {
      handleSetAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
    return null;
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      if (data?.success) {
        handleSetAccessToken(data.accessToken);
        setUser(data.user);
        setIsAuthenticated(true);
        return data.user;
      }
    } catch (err) {
      handleSetAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      if (data?.success) {
        handleSetAccessToken(data.accessToken);
        setUser(data.user);
        setIsAuthenticated(true);
        return data.user;
      }
    } catch (err) {
      handleSetAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      handleSetAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const logoutAll = async () => {
    setLoading(true);
    try {
      await authService.logoutAll();
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      handleSetAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await authService.updateMe(updates);
      if (response?.success && response?.data) {
        setUser(response.data);
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  };

  // On mount: restore session and set interceptor callback
  useEffect(() => {
    const initSession = async () => {
      try {
        const refreshResponse = await authService.refresh();
        if (refreshResponse?.accessToken) {
          handleSetAccessToken(refreshResponse.accessToken);
          // Fetch current user details
          const meData = await authService.getMe();
          if (meData?.success && meData?.data) {
            setUser(meData.data);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        // Only actual server failures should be logged
        if (!err.response || err.response.status !== 401) {
          console.error('Session restoration failed due to server error:', err);
        }
        // No session to restore, clean up
        handleSetAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Register refresh failure callback to wipe states locally (Change 3)
    registerOnRefreshFailed(() => {
      setUser(null);
      handleSetAccessToken(null);
      setIsAuthenticated(false);
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    });

    initSession();
  }, []);

  const value = {
    user,
    accessToken: accessTokenState,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    logoutAll,
    refreshUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
