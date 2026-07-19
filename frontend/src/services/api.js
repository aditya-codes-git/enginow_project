import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (!baseUrl.endsWith('/api')) {
  baseUrl = `${baseUrl.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
});

// Request interceptor: attach our application access token if it exists
api.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('[API Interceptor] Failed to retrieve access token:', err);
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
