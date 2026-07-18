import api from './api';
import supabase from './supabase';

const authService = {
  async register({ email, password, name }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
