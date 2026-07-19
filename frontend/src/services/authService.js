import api from './api';
import supabase from './supabase';

const authService = {
  async register({ email, password, name }) {
    const response = await api.post('/auth/register', { email, password, name, role: 'participant' });
    if (response.data && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  async login({ email, password }) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  async googleLoginExchange(supabaseToken) {
    const response = await api.post('/auth/google-login', { token: supabaseToken });
    if (response.data && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  async logout() {
    localStorage.removeItem('accessToken');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[authService] Supabase sign out failed, possibly already signed out:', err.message);
    }
    return { success: true };
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
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
};

export default authService;

