import api from './api';

export const mapEventToFrontend = (event) => {
  if (!event) return null;
  return {
    ...event,
    id: event._id || event.id,
    registrations: event.registrationCount ?? 0,
    submissions: event.submissionCount ?? 0,
    judges: event.judgeCount ?? 0,
    track: Array.isArray(event.track) ? event.track.join(', ') : (event.track || ''),
    teamSize: (event.teamSize && event.teamSize.min !== undefined)
      ? `${event.teamSize.min}-${event.teamSize.max}`
      : (event.teamSize || '1-4'),
    startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
    endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
    registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : '',
    submissionDeadline: event.submissionDeadline ? new Date(event.submissionDeadline).toISOString().split('T')[0] : '',
    judgingStart: event.judgingStart ? new Date(event.judgingStart).toISOString().split('T')[0] : '',
    judgingEnd: event.judgingEnd ? new Date(event.judgingEnd).toISOString().split('T')[0] : '',
    winnerAnnouncement: event.winnerAnnouncement ? new Date(event.winnerAnnouncement).toISOString().split('T')[0] : '',
    submissionStart: event.submissionStart ? new Date(event.submissionStart).toISOString().split('T')[0] : '',
    maxCapacity: event.maxCapacity ?? 0,
    registrationQuestions: event.registrationQuestions || [],
  };
};

export const transformEventPayload = (formData) => {
  if (!formData) return {};

  const normalizeVisibility = (val) => {
    if (!val) return 'public';
    const v = val.toLowerCase();
    if (v === 'public' || v === 'private') return v;
    if (v === 'invite only' || v === 'invite-only') return 'private';
    return 'public';
  };

  const normalizeType = (val) => {
    if (!val) return 'Hackathon';
    const types = {
      hackathon: 'Hackathon',
      workshop: 'Workshop',
      webinar: 'Webinar',
      competition: 'Competition',
      event: 'Event',
      conference: 'Event',
      'demo day': 'Event'
    };
    return types[val.toLowerCase()] || 'Hackathon';
  };

  const normalizeMode = (val) => {
    if (!val) return 'Hybrid';
    const modes = {
      online: 'Online',
      'in-person': 'In-person',
      inperson: 'In-person',
      hybrid: 'Hybrid'
    };
    return modes[val.toLowerCase()] || 'Hybrid';
  };

  return {
    ...formData,
    visibility: normalizeVisibility(formData.visibility),
    type: normalizeType(formData.type),
    mode: normalizeMode(formData.mode),
  };
};

export const mapEventToBackend = (data) => {
  if (!data) return null;

  const transformed = transformEventPayload(data);

  // Normalize URL helper
  const normalizeUrl = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // 1. Convert track string to array
  let trackArray = [];
  if (typeof transformed.track === 'string') {
    trackArray = transformed.track.split(',').map(t => t.trim()).filter(Boolean);
  } else if (Array.isArray(transformed.track)) {
    trackArray = transformed.track;
  }

  // 2. Convert teamSize string to {min,max}
  let teamSizeObj = { min: 1, max: 1 };
  if (typeof transformed.teamSize === 'string') {
    const parts = transformed.teamSize.split('-').map(p => parseInt(p, 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      teamSizeObj = { min: parts[0], max: parts[1] };
    } else if (parts.length === 1 && !isNaN(parts[0])) {
      teamSizeObj = { min: parts[0], max: parts[0] };
    }
  } else if (transformed.teamSize && typeof transformed.teamSize === 'object') {
    teamSizeObj = {
      min: Math.floor(Number(transformed.teamSize.min ?? 1)),
      max: Math.floor(Number(transformed.teamSize.max ?? 1)),
    };
  }

  // 3. Parse sponsorLogos and resources if they are strings
  let sponsorLogosArray = [];
  if (typeof transformed.sponsorLogos === 'string') {
    sponsorLogosArray = transformed.sponsorLogos.split(',').map(s => s.trim()).filter(Boolean);
  } else if (Array.isArray(transformed.sponsorLogos)) {
    sponsorLogosArray = transformed.sponsorLogos;
  }

  let resourcesArray = [];
  if (typeof transformed.resources === 'string') {
    resourcesArray = transformed.resources.split(',').map(r => r.trim()).filter(Boolean);
  } else if (Array.isArray(transformed.resources)) {
    resourcesArray = transformed.resources;
  }

  // 4. Convert dates to backend format
  const startDateVal = transformed.startDate && !isNaN(Date.parse(transformed.startDate))
    ? new Date(transformed.startDate).toISOString()
    : new Date().toISOString();

  const endDateVal = transformed.endDate && !isNaN(Date.parse(transformed.endDate))
    ? new Date(transformed.endDate).toISOString()
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const registrationDeadlineVal = transformed.registrationDeadline && !isNaN(Date.parse(transformed.registrationDeadline))
    ? new Date(transformed.registrationDeadline).toISOString()
    : startDateVal;

  const optionalDates = ['submissionStart', 'submissionDeadline', 'judgingStart', 'judgingEnd', 'winnerAnnouncement'];
  const formattedOptionalDates = {};
  optionalDates.forEach((field) => {
    const val = transformed[field];
    if (!val || isNaN(Date.parse(val))) {
      formattedOptionalDates[field] = null;
    } else {
      formattedOptionalDates[field] = new Date(val).toISOString();
    }
  });

  // Construct final payload containing ONLY allowed fields
  const payload = {
    title: transformed.title || '',
    tagline: transformed.tagline || '',
    type: transformed.type || 'Hackathon',
    mode: transformed.mode || 'Hybrid',
    visibility: transformed.visibility || 'public',
    location: transformed.location || '',
    venue: transformed.venue || '',
    city: transformed.city || '',
    country: transformed.country || 'India',
    
    startDate: startDateVal,
    endDate: endDateVal,
    registrationDeadline: registrationDeadlineVal,
    
    ...formattedOptionalDates,
    
    track: trackArray,
    prizePool: transformed.prizePool || '',
    teamSize: teamSizeObj,
    eligibility: transformed.eligibility || '',
    description: transformed.description || '',
    rules: transformed.rules || '',
    judgingCriteria: transformed.judgingCriteria || '',
    resources: resourcesArray,
    
    coverImage: transformed.coverImage || '',
    websiteUrl: normalizeUrl(transformed.websiteUrl),
    communityUrl: normalizeUrl(transformed.communityUrl),
    sponsorLogos: sponsorLogosArray,
    
    contactName: transformed.contactName || '',
    contactEmail: transformed.contactEmail || '',
    
    maxCapacity: transformed.maxCapacity !== undefined ? Math.max(0, parseInt(transformed.maxCapacity, 10) || 0) : 0,
    registrationQuestions: Array.isArray(transformed.registrationQuestions)
      ? transformed.registrationQuestions
      : typeof transformed.registrationQuestions === 'string'
      ? transformed.registrationQuestions.split('\n').map(q => q.trim()).filter(Boolean)
      : [],
  };

  if (import.meta.env.DEV) {
    console.debug('Outgoing Event Payload', payload);
  }

  return payload;
};

const eventService = {
  async getEvents(params = {}) {
    const response = await api.get('/events', { params });
    // Normalize response: backend returns { success, data: { events, total, ... } }
    const eventsList = response.data.data.events || [];
    return {
      ...response.data.data,
      events: eventsList.map(mapEventToFrontend),
    };
  },

  async getMyOrgEvents(params = {}) {
    const response = await api.get('/events/my-events', { params });
    const eventsList = response.data.data.events || [];
    return {
      ...response.data.data,
      events: eventsList.map(mapEventToFrontend),
    };
  },

  async getEvent(id) {
    const response = await api.get(`/events/${id}`);
    return mapEventToFrontend(response.data.data);
  },

  async createEvent(data) {
    const backendData = mapEventToBackend(data);
    const response = await api.post('/events', backendData);
    return mapEventToFrontend(response.data.data);
  },

  async updateEvent(id, data) {
    const backendData = mapEventToBackend(data);
    const response = await api.put(`/events/${id}`, backendData);
    return mapEventToFrontend(response.data.data);
  },

  async submitEvent(id) {
    const response = await api.patch(`/events/${id}/submit`);
    return mapEventToFrontend(response.data.data);
  },

  async archiveEvent(id) {
    const response = await api.patch(`/events/${id}/archive`);
    return mapEventToFrontend(response.data.data);
  },

  async deleteEvent(id) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  async registerForEvent(id, data = {}) {
    const response = await api.post(`/events/${id}/register`, data);
    return mapEventToFrontend(response.data.data);
  },

  async cancelRegistration(id) {
    const response = await api.delete(`/events/${id}/register`);
    return mapEventToFrontend(response.data.data);
  },

  async getEventRegistrations(id) {
    const response = await api.get(`/events/${id}/registrations`);
    return response.data.data;
  },
};

export default eventService;
