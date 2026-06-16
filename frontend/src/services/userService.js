import api from './api';
import { mapEventToFrontend } from './eventService';

const userService = {
  async getMyEvents() {
    const response = await api.get('/users/me/events');
    const events = response.data.data || [];
    return events.map(mapEventToFrontend);
  },

  async getMySubmissions() {
    const response = await api.get('/users/me/submissions');
    return response.data.data || [];
  },
};

export default userService;
