import api from './api';

const submissionService = {
  async submitProject(eventId, data) {
    const response = await api.post(`/events/${eventId}/submissions`, data);
    return response.data;
  },
};

export default submissionService;
