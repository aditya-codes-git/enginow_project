import axios from 'axios';
import supabase from './supabase';

let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (!baseUrl.endsWith('/api')) {
  baseUrl = `${baseUrl.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
});

// Request interceptor: dynamically fetch the latest valid session token from Supabase
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.error('[API Interceptor] Failed to fetch active session:', err);
    }

    if (import.meta.env.DEV) {
      console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        hasAuth: !!config.headers.Authorization,
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Backward-compatibility export stubs
export const setAccessToken = () => {};
export const setRefreshToken = () => {};
export const registerOnRefreshFailed = () => {};

export default api;
