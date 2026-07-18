import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Step1BasicInfo from '../../components/organiser/StepForm/Step1BasicInfo';
import Step2EventDetails from '../../components/organiser/StepForm/Step2EventDetails';
import Step3Content from '../../components/organiser/StepForm/Step3Content';
import Step4Schedule from '../../components/organiser/StepForm/Step4Schedule';
import Step5Media from '../../components/organiser/StepForm/Step5Media';
import Step6OrgContact from '../../components/organiser/StepForm/Step6OrgContact';
import Step7Preview from '../../components/organiser/StepForm/Step7Preview';
import StepWrapper from '../../components/organiser/StepForm/StepWrapper';
import useEvents, { defaultEventDraft } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';

const steps = [
  { label: 'Basic info', title: 'Start with a clear event identity', component: Step1BasicInfo },
  { label: 'Event details', title: 'Define venue, tracks, prizes, and eligibility', component: Step2EventDetails },
  { label: 'Content', title: 'Write participant-facing content and judging rules', component: Step3Content },
  { label: 'Schedule', title: 'Set registration, submission, and judging dates', component: Step4Schedule },
  { label: 'Media', title: 'Add public links, sponsors, and cover media', component: Step5Media },
  { label: 'Organizer', title: 'Confirm owner, contact, and pipeline numbers', component: Step6OrgContact },
  { label: 'Preview', title: 'Review the event before saving', component: Step7Preview },
];

function CreateEventPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createEvent } = useEvents();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const requestedType = queryParams.get('type') || defaultEventDraft.type;

  const [formData, setFormData] = useState({
    ...defaultEventDraft,
    type: requestedType,
  });

  const ActiveStep = steps[currentStep].component;

  useEffect(() => {
    if (user) {
      setFormData((current) => ({
        ...current,
        contactName: current.contactName || user.name || '',
        contactEmail: current.contactEmail || user.email || '',
      }));
    }
  }, [user]);

  const missingBasics = useMemo(
    () =>
      ['title', 'tagline', 'description', 'location', 'startDate', 'endDate', 'registrationDeadline']
        .filter((field) => !String(formData[field] || '').trim()),
    [formData],
  );

  const updateField = (field, value) => {
    setError('');
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (missingBasics.length) {
      setError(
        'Please add title, tagline, description, location, start/end dates, and registration deadline before saving.',
      );
      setCurrentStep(0);
      return;
    }

    try {
      setError('');
      const createdEvent = await createEvent(formData);
      const eventId =
        createdEvent?.id ||
        createdEvent?._id ||
        createdEvent?.data?.id ||
        createdEvent?.data?._id;

      if (!eventId) {
        console.error('Missing created event id', createdEvent);
        setError('Event draft was created, but the ID could not be resolved from response.');
        return;
      }

      navigate('/organiser');
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;

      if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
        const details = validationErrors
          .map((e) => {
            const fieldName = e.field.replace('body.', '');
            return `${fieldName}: ${e.message}`;
          })
          .join(', ');

        setError(`Validation failed: ${details}`);
      } else {
        setError(serverMessage || err.message || 'Failed to create event draft.');
      }
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <StepWrapper
        steps={steps.map((step) => step.label)}
        currentStep={currentStep}
        title={steps[currentStep].title}
        description={`Create a complete ${formData.type.toLowerCase()} profile with full operational structure: public details, registrations, and timelines.`}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        submitLabel="Submit for Approval"
      >
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <ActiveStep formData={formData} updateField={updateField} />
      </StepWrapper>
    </main>
  );
}

export default CreateEventPage;