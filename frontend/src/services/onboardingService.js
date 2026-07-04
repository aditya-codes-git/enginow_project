import api from './api';

const onboardingService = {
  async submitApplication(data) {
    const response = await api.post('/organizer-applications', data);
    return response.data;
  },
};

export default onboardingService;
