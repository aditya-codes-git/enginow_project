import api, { refreshTokens } from './api';

const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async logoutAll() {
    const response = await api.post('/auth/logout-all');
    return response.data;
  },

  async refresh() {
    return refreshTokens();
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateMe(data) {
    const response = await api.put('/auth/me', data);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  async verifyEmail(token) {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  },
};

export default authService;
