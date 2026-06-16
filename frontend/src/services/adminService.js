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

  async approveEvent(id) {
    const response = await api.patch(`/admin/events/${id}/approve`);
    return mapEventToFrontend(response.data.data);
  },

  async rejectEvent(id, rejectionReason) {
    const response = await api.patch(`/admin/events/${id}/reject`, { rejectionReason });
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
};

export default adminService;
