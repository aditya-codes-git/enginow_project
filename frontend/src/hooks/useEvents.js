import { useCallback, useEffect, useMemo, useState } from 'react';
import eventService from '../services/eventService';
import { useAuth } from './useAuth';

export const EVENT_STORAGE_KEY = 'enginow-organiser-events';

export const defaultEventDraft = {
  title: '',
  tagline: '',
  type: 'Hackathon',
  status: 'Draft',
  visibility: 'Public',
  mode: 'Hybrid',
  location: '',
  venue: '',
  city: '',
  country: 'India',
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  submissionStart: '',
  submissionDeadline: '',
  judgingStart: '',
  judgingEnd: '',
  winnerAnnouncement: '',
  track: '',
  prizePool: '',
  teamSize: '1-4',
  eligibility: '',
  description: '',
  rules: '',
  judgingCriteria: '',
  resources: '',
  coverImage: '',
  websiteUrl: '',
  communityUrl: '',
  sponsorLogos: '',
  contactName: '',
  contactEmail: '',
  organiserName: '',
  organiserWebsite: '',
  registrations: 0,
  submissions: 0,
  judges: 0,
  maxCapacity: 0,
  registrationQuestions: '',
};

export function getEventCompletion(event = {}) {
  const requiredFields = [
    'title',
    'tagline',
    'type',
    'status',
    'mode',
    'location',
    'startDate',
    'endDate',
    'registrationDeadline',
    'submissionDeadline',
    'judgingStart',
    'judgingEnd',
    'track',
    'description',
    'rules',
    'judgingCriteria',
    'contactName',
    'contactEmail',
  ];

  const completed = requiredFields.filter((field) => Boolean(String(event[field] || '').trim()));
  return Math.round((completed.length / requiredFields.length) * 100);
}

export function getEventHealth(event = {}) {
  const completion = getEventCompletion(event);
  const hasPipeline = Number(event.registrations || 0) > 0 || Number(event.submissions || 0) > 0;
  const hasJudges = Number(event.judges || 0) > 0;

  if (completion >= 85 && hasPipeline && hasJudges) return 'Ready';
  if (completion >= 60) return 'In progress';
  return 'Incomplete';
}

export default function useEvents(options = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const isOrganiserRoute = window.location.pathname.startsWith('/organiser');
  const isOrganiser = isAuthenticated && user?.role === 'organiser' && (options.organiserOnly || isOrganiserRoute);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      if (isOrganiser) {
        const response = await eventService.getMyOrgEvents({ limit: 100 });
        setEvents(response.events || []);
      } else {
        const response = await eventService.getEvents({ limit: 100 });
        setEvents(response.events || []);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to fetch events:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [isOrganiser, user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = useCallback(
    async (event) => {
      setLoading(true);
      try {
        const nextEvent = await eventService.createEvent(event);
        setEvents((prev) => [nextEvent, ...prev]);
        return nextEvent;
      } catch (err) {
        console.error('Failed to create event:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateEvent = useCallback(
    async (eventId, updates) => {
      setLoading(true);
      try {
        const nextEvent = await eventService.updateEvent(eventId, updates);
        setEvents((prev) => prev.map((e) => (e.id === eventId ? nextEvent : e)));
        return nextEvent;
      } catch (err) {
        console.error('Failed to update event:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const archiveEvent = useCallback(
    async (eventId) => {
      setLoading(true);
      try {
        const nextEvent = await eventService.archiveEvent(eventId);
        setEvents((prev) => prev.map((e) => (e.id === eventId ? nextEvent : e)));
        return nextEvent;
      } catch (err) {
        console.error('Failed to archive event:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getEventById = useCallback(
    (eventId) => events.find((event) => event.id === eventId),
    [events]
  );

  const metrics = useMemo(
    () =>
      events.reduce(
        (total, event) => {
          const st = (event.status || '').toLowerCase();
          return {
            live: total.live + (st === 'approved' ? 1 : 0),
            registrations: total.registrations + Number(event.registrations || 0),
            submissions: total.submissions + Number(event.submissions || 0),
            judges: total.judges + Number(event.judges || 0),
          };
        },
        { live: 0, registrations: 0, submissions: 0, judges: 0 }
      ),
    [events]
  );

  return {
    events,
    loading,
    metrics,
    createEvent,
    updateEvent,
    archiveEvent,
    getEventById,
    setEvents,
    refresh: fetchEvents,
  };
}
