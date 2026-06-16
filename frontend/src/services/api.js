import axios from 'axios';

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];
let onRefreshFailedCallback = null;

let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (!baseUrl.endsWith('/api')) {
  baseUrl = `${baseUrl.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const registerOnRefreshFailed = (callback) => {
  onRefreshFailedCallback = callback;
};

let refreshPromise = null;

export const refreshTokens = () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = api.post('/auth/refresh')
    .then((response) => {
      refreshPromise = null;
      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);
      return response.data;
    })
    .catch((err) => {
      refreshPromise = null;
      setAccessToken(null);
      throw err;
    });

  return refreshPromise;
};

const isSkipList = (url) => {
  if (!url) return false;
  return url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh');
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: attach bearer token
api.interceptors.request.use(
  (config) => {
    const isAuthPath = config.url && isSkipList(config.url);
    if (accessToken && !isAuthPath) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    if (import.meta.env.DEV) {
      console.debug(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`, {
        hasAuthHeader: !!config.headers.Authorization,
        isAuthPath,
        accessTokenPresent: !!accessToken,
      });
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request matches selective refresh conditions:
    // 1. Had authorization header
    // 2. Not already retried
    // 3. Not an auth skip list endpoint
    const hasAuthHeader = originalRequest?.headers?.Authorization;
    const isRetry = originalRequest?._retry;
    const isAuthEndpoint = originalRequest?.url && isSkipList(originalRequest.url);

    if (error.response?.status === 401 && hasAuthHeader && !isRetry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshTokens()
          .then((data) => {
            const newAccessToken = data.accessToken;
            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);

            if (onRefreshFailedCallback) {
              onRefreshFailedCallback();
            }

            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
