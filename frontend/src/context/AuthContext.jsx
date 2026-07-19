import React, { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import supabase from '../services/supabase';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  // Sync profile details from MongoDB using the current token session
  const fetchProfile = async () => {
    if (isFetchingRef.current) {
      console.log('[AuthContext] Profile fetch already in progress. Skipping redundant call.');
      return user;
    }
    isFetchingRef.current = true;
    console.log('[AuthContext] Fetching user profile from Express backend /auth/me...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[AuthContext] No active session found. Skipping fetchProfile.');
        setUser(null);
        setIsAuthenticated(false);
        isFetchingRef.current = false;
        return null;
      }

      const response = await authService.getMe();
      console.log('[AuthContext] Backend getMe() profile response:', response);
      if (response?.success && response?.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        console.log('[AuthContext] State updated: isAuthenticated = true, user =', response.data);
        isFetchingRef.current = false;
        return response.data;
      } else {
        console.warn('[AuthContext] Backend returned unsuccessful user profile. Logging out...');
        isFetchingRef.current = false;
        await logout();
      }
    } catch (err) {
      console.error('[AuthContext] MongoDB profile sync failed:', err);
      isFetchingRef.current = false;
      await logout();
    }
    isFetchingRef.current = false;
    return null;
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      console.log('[AuthContext] Triggering login with credentials:', credentials.email);
      await authService.login(credentials);
      const profile = await fetchProfile();
      return profile;
    } catch (err) {
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
      console.log('[AuthContext] Triggering register with details:', userData.email);
      await authService.register(userData);
      const profile = await fetchProfile();
      return profile || { role: 'participant' };
    } catch (err) {
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
      console.log('[AuthContext] Triggering sign out...');
      await authService.logout();
    } catch (err) {
      console.error('[AuthContext] Supabase sign out failed:', err);
    } finally {
      // Clear localStorage/sessionStorage auth items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('token') || key.includes('auth') || key.includes('user')) {
          localStorage.removeItem(key);
        }
      });
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('token') || key.includes('auth') || key.includes('user')) {
          sessionStorage.removeItem(key);
        }
      });
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      console.log('[AuthContext] Local state cleared successfully. User logged out.');
      navigate('/');
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      console.log('[AuthContext] Directing user to Google OAuth flow...');
      await authService.signInWithGoogle();
    } catch (err) {
      console.error('[AuthContext] Google OAuth initialization failed:', err);
      setLoading(false);
      throw err;
    }
  };

  const refreshUser = async () => {
    return await fetchProfile();
  };

  const updateProfile = async (updates) => {
    const response = await authService.updateMe(updates);
    if (response?.success && response?.data) {
      setUser(response.data);
      return response.data;
    }
  };

  useEffect(() => {
    let isMounted = true;
    console.log('[AuthContext] Registering Supabase onAuthStateChange listener...');

    // Single listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AuthContext] onAuthStateChange event triggered: "${event}"`, { session });
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (session) {
          console.log('[AuthContext] Active session detected in listener. Syncing profile...');
          setLoading(true);
          await fetchProfile();
        } else {
          console.log('[AuthContext] Session payload empty despite active event.');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] SIGNED_OUT event detected. Clearing local state...');
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
      console.log('[AuthContext] State check completed inside listener. loading = false');
    });

    // Startup session load check
    const checkInitialSession = async () => {
      console.log('[AuthContext] Executing startup getSession() check...');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[AuthContext] Startup getSession() resolved:', { session });
        if (session && isMounted) {
          console.log('[AuthContext] Active session found on startup. Syncing profile...');
          await fetchProfile();
        }
      } catch (err) {
        console.error('[AuthContext] Startup session check failed:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('[AuthContext] Startup session check finalized. loading = false');
        }
      }
    };

    checkInitialSession();

    return () => {
      console.log('[AuthContext] Unsubscribing onAuthStateChange listener...');
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        signInWithGoogle,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
