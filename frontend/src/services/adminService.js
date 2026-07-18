import api from './api';
import { mapEventToFrontend } from './eventService';

const adminService = {
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data.data || [];
  },

  async updateUser(id, data) {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data.data;
  },

  async getPendingEvents() {
    const response = await api.get('/admin/events/pending');
    const events = response.data.data || [];
    return events.map(mapEventToFrontend);
  },

  async getEvents() {
    const response = await api.get('/admin/events');
    const events = response.data.data || [];
    return events.map(mapEventToFrontend);
  },

  async approveEvent(id) {
    const response = await api.patch(`/admin/events/${id}/approve`);
    return mapEventToFrontend(response.data.data);
  },

  async rejectEvent(id, rejectionReason) {
    const response = await api.patch(`/admin/events/${id}/reject`, {
      rejectionReason,
    });
    return mapEventToFrontend(response.data.data);
  },

  async suspendEvent(id) {
    const response = await api.patch(`/admin/events/${id}/suspend`);
    return mapEventToFrontend(response.data.data);
  },

  async activateEvent(id) {
    const response = await api.patch(`/admin/events/${id}/activate`);
    return mapEventToFrontend(response.data.data);
  },

  async getOrganisers() {
    const response = await api.get('/admin/organisers');
    return response.data.data || [];
  },

  async verifyOrganiser(id) {
    const response = await api.patch(`/admin/organisers/${id}/verify`);
    return response.data.data;
  },

  async getBlogs() {
    const response = await api.get('/admin/blogs');
    return response.data.data || [];
  },

  async getPendingBlogs() {
    const response = await api.get('/admin/blogs/pending');
    return response.data.data || [];
  },

  async getBlog(slug) {
    const response = await api.get(`/admin/blogs/${slug}`);
    return response.data.data;
  },

  async createBlog(data) {
    const response = await api.post('/admin/blogs', data);
    return response.data.data;
  },

  async updateBlog(id, data) {
    const response = await api.patch(`/admin/blogs/${id}`, data);
    return response.data.data;
  },

  async deleteBlog(id) {
    const response = await api.delete(`/admin/blogs/${id}`);
    return response.data;
  },

  async approveBlog(id) {
    const response = await api.patch(`/admin/blogs/${id}/approve`);
    return response.data.data;
  },

  async rejectBlog(id, rejectionReason) {
    const response = await api.patch(`/admin/blogs/${id}/reject`, {
      rejectionReason,
    });
    return response.data.data;
  },

  async suspendBlog(id) {
    const response = await api.patch(`/admin/blogs/${id}/suspend`);
    return response.data.data;
  },

  async activateBlog(id) {
    const response = await api.patch(`/admin/blogs/${id}/activate`);
    return response.data.data;
  },
};

export default adminService;