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
      const localToken = localStorage.getItem('accessToken');
      if (!localToken) {
        console.log('[AuthContext] No local accessToken found. Skipping fetchProfile.');
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
    try {
      console.log('[AuthContext] Triggering login with credentials:', credentials.email);
      await authService.login(credentials);
      const profile = await fetchProfile();
      return profile;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      console.log('[AuthContext] Triggering register with details:', userData.email);
      await authService.register(userData);
      const profile = await fetchProfile();
      return profile || { role: 'participant' };
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.log('[AuthContext] Triggering sign out...');
      await authService.logout();
    } catch (err) {
      console.error('[AuthContext] Sign out failed:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
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

    // Single listener for auth state changes (used primarily for Google OAuth callback flow)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[AuthContext] onAuthStateChange event triggered: "${event}"`, { session });
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session) {
          const localToken = localStorage.getItem('accessToken');
          if (!localToken) {
            console.log('[AuthContext] Supabase session active but no local JWT. Triggering token exchange...');
            setLoading(true);
            try {
              await authService.googleLoginExchange(session.access_token);
              await fetchProfile();
            } catch (err) {
              console.error('[AuthContext] Google OAuth exchange failed:', err);
            } finally {
              setLoading(false);
            }
          } else {
            console.log('[AuthContext] Supabase session active and local JWT already exists. Syncing profile...');
            await fetchProfile();
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] SIGNED_OUT event detected. Clearing local state...');
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    // Startup session load check
    const checkInitialSession = async () => {
      console.log('[AuthContext] Executing startup check...');
      try {
        const localToken = localStorage.getItem('accessToken');
        if (localToken) {
          console.log('[AuthContext] Found active local token on startup. Fetching profile...');
          await fetchProfile();
        } else {
          // If no local token, check if there's a Supabase session (e.g. redirected from Google OAuth)
          const { data: { session } } = await supabase.auth.getSession();
          if (session && isMounted) {
            console.log('[AuthContext] Found active Supabase session on startup. Triggering exchange...');
            await authService.googleLoginExchange(session.access_token);
            await fetchProfile();
          }
        }
      } catch (err) {
        console.error('[AuthContext] Startup session check failed:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('[AuthContext] Startup check finalized. loading = false');
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

