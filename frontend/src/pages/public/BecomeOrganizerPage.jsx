import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  FileText, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  Edit2,
  Lock,
  Search,
  ExternalLink
} from 'lucide-react';
import onboardingService from '../../services/onboardingService';
import { showSuccess, showError } from '../../utils/toast';

const organizationTypes = [
  'College',
  'University',
  'Company',
  'Startup',
  'Student Chapter',
  'Community',
  'NGO',
  'Training Institute',
  'Other'
];

const benefits = [
  {
    icon: Users,
    title: 'Reach Target Audiences',
    description: 'Promote your hackathons and contests directly to passionate student engineers, developers, and tech communities.'
  },
  {
    icon: Calendar,
    title: 'Easy Event Management',
    description: 'Set custom timelines, define tracks, configure submission criteria, and launch events with a guided wizard.'
  },
  {
    icon: FileText,
    title: 'Registration Analytics',
    description: 'Track candidate registrations in real time, view institutional distributions, and monitor interest metrics.'
  },
  {
    icon: ShieldCheck,
    title: 'Participant Management',
    description: 'Screen applicant profiles, approve team slots, manage submission lists, and download reports effortlessly.'
  },
  {
    icon: CheckCircle2,
    title: 'Verification & Quality',
    description: 'Ensure trust. Every listing is reviewed by administrators, showing participants they are registering for verified events.'
  },
  {
    icon: Globe,
    title: 'Professional Dashboard',
    description: 'Access tools to track team roles, review submissions, grade projects, and declare winners in one interface.'
  }
];

const eligibility = [
  {
    category: 'Colleges & Universities',
    desc: 'Engineering colleges, technological universities, and higher education institutes hosting national/local challenges.',
    badge: 'Higher Ed'
  },
  {
    category: 'Student Chapters & Clubs',
    desc: 'Official college student chapters (ACM, IEEE, GDSC) or technology interest clubs sanctioned by their campus.',
    badge: 'Campus Clubs'
  },
  {
    category: 'Companies & Startups',
    desc: 'Established companies or startup teams looking to host hiring hackathons, sponsor events, or recruit tech talents.',
    badge: 'Industry'
  },
  {
    category: 'NGOs & Communities',
    desc: 'Non-profit foundations, developer user groups, or tech communities organizing open-source events.',
    badge: 'Non-Profit'
  }
];

const timelineStages = [
  {
    title: 'Application Submitted',
    duration: 'Immediate',
    desc: 'Provide details about your organization, coordinator details, and event scope.'
  },
  {
    title: 'Admin Review',
    duration: '1-2 Days',
    desc: 'The Enginow events team evaluates eligibility, website presence, and track record.'
  },
  {
    title: 'Verification Call',
    duration: '1 Day',
    desc: 'We perform a quick email check or audit query to verify institution coordinator status.'
  },
  {
    title: 'Activation & Access',
    duration: 'Immediate',
    desc: 'Upon approval, receive credentials to log in, launch events, and access event management tools.'
  }
];

const faqs = [
  {
    q: 'Who can become a verified organizer on Enginow?',
    a: 'Any recognized educational institution, student developer chapter, technology community, or company hosting engineering and programming events can apply. We do not allow individual organizer accounts without institutional backing to protect candidate safety.'
  },
  {
    q: 'How long does the verification process take?',
    a: 'We manually review every single organizer application. The process typically takes 2 to 5 business days depending on documentation clarity and response time to our validation email.'
  },
  {
    q: 'Can I apply if my organization does not have an official website?',
    a: 'Yes. If you do not have an official website, you must provide active social profile links (e.g. LinkedIn page, Twitter account, GitHub organization, or an official university directory listing page) to confirm your identity.'
  },
  {
    q: 'Do I need to pay to become an organizer?',
    a: 'No. Applying for verification and listing free public hackathons or coding challenges is completely free of charge. Paid corporate sponsorships or private hackathons may carry premium rates.'
  },
  {
    q: 'What happens after my application is approved?',
    a: 'We will send a activation email to your registered official address. You will follow the link to complete account setup, set your passwords, invite coordinators, and access your event dashboard.'
  },
  {
    q: 'Can I submit multiple applications for the same organization?',
    a: 'No. We only allow one active application per email address/organization. If your application is rejected or withdrawn, you can re-apply after fixing the discrepancies highlighted by the admin review.'
  }
];

export default function BecomeOrganizerPage() {
  const formRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    applicantName: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    city: '',
    country: '',
    description: '',
    purpose: '',
    expectedEvents: '',
    expectedParticipants: '',
    additionalInformation: '',
    termsAccepted: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  const totalSteps = 6;
  const stepTitles = [
    'Organization Info',
    'Contact details',
    'Experience & Intent',
    'Scope & Scale',
    'Review Application',
    'Declaration & Submit'
  ];

  const getStepRemainingTime = () => {
    switch (currentStep) {
      case 1: return 'Approximately 4 minutes remaining';
      case 2: return 'Approximately 3 minutes remaining';
      case 3: return 'Approximately 2 minutes remaining';
      case 4: return 'Approximately 1 minute remaining';
      case 5: return 'Ready for final review';
      case 6: return 'Final step';
      default: return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (touchedFields[name]) {
      validateField(name, type === 'checkbox' ? checked : value);
    }
  };

  const handleFieldBlur = (e) => {
    const { name, value, type, checked } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const validateField = (name, value) => {
    let err = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case 'organizationName':
        if (!value.trim()) err = 'Organization name is required';
        else if (value.trim().length < 2) err = 'Must be at least 2 characters';
        else if (value.trim().length > 100) err = 'Must not exceed 100 characters';
        break;
      case 'organizationType':
        if (!value) err = 'Organization type is required';
        break;
      case 'applicantName':
        if (!value.trim()) err = 'Applicant coordinator name is required';
        else if (value.trim().length < 2) err = 'Must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) err = 'Official email address is required';
        else if (!emailRegex.test(value.trim())) err = 'Please enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) err = 'Phone number is required';
        else if (value.trim().length < 8) err = 'Must be at least 8 digits';
        break;
      case 'city':
        if (!value.trim()) err = 'City is required';
        break;
      case 'country':
        if (!value.trim()) err = 'Country is required';
        break;
      case 'description':
        if (!value.trim()) err = 'Organization description is required';
        else if (value.trim().length < 10) err = 'Must be at least 10 characters';
        else if (value.trim().length > 1000) err = 'Must not exceed 1000 characters';
        break;
      case 'purpose':
        if (!value.trim()) err = 'Purpose of hosting events is required';
        else if (value.trim().length < 10) err = 'Must be at least 10 characters';
        else if (value.trim().length > 1000) err = 'Must not exceed 1000 characters';
        break;
      case 'expectedEvents':
        const eventsNum = parseInt(value, 10);
        if (!value) err = 'Expected events per year is required';
        else if (isNaN(eventsNum) || eventsNum < 1) err = 'Must be at least 1';
        break;
      case 'expectedParticipants':
        const partsNum = parseInt(value, 10);
        if (!value) err = 'Expected participant count is required';
        else if (isNaN(partsNum) || partsNum < 1) err = 'Must be at least 1';
        break;
      case 'termsAccepted':
        if (!value) err = 'You must declare validation check confirmation';
        break;
      case 'website':
        if (value.trim()) {
          try {
            new URL(value.trim());
          } catch (_) {
            err = 'Enter valid absolute URL (e.g. https://example.com)';
          }
        }
        break;
      case 'linkedin':
        if (value.trim()) {
          try {
            new URL(value.trim());
          } catch (_) {
            err = 'Enter valid absolute LinkedIn URL';
          }
        }
        break;
      default:
        break;
    }

    setErrors(prev => {
      const next = { ...prev };
      if (err) next[name] = err;
      else delete next[name];
      return next;
    });

    return !err;
  };

  const validateStep = (stepNumber) => {
    let fieldsToValidate = [];
    if (stepNumber === 1) fieldsToValidate = ['organizationName', 'organizationType', 'website', 'linkedin'];
    if (stepNumber === 2) fieldsToValidate = ['applicantName', 'email', 'phone', 'city', 'country'];
    if (stepNumber === 3) fieldsToValidate = ['description', 'purpose'];
    if (stepNumber === 4) fieldsToValidate = ['expectedEvents', 'expectedParticipants'];
    if (stepNumber === 6) fieldsToValidate = ['termsAccepted'];

    let stepValid = true;
    const currentTouched = { ...touchedFields };

    fieldsToValidate.forEach(f => {
      currentTouched[f] = true;
      const isValid = validateField(f, formData[f]);
      if (!isValid) stepValid = false;
    });

    setTouchedFields(currentTouched);
    return stepValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      showError('Please resolve all validation errors in this section before continuing.');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditSection = (stepNum) => {
    setCurrentStep(stepNum);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(6)) {
      showError('You must confirm your declaration before submitting.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        expectedEvents: parseInt(formData.expectedEvents, 10),
        expectedParticipants: parseInt(formData.expectedParticipants, 10)
      };
      
      const res = await onboardingService.submitApplication(payload);
      if (res.success && res.data) {
        showSuccess('Application registered successfully!');
        setSubmittedApp(res.data);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please check form data.';
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    showSuccess('Application Reference ID copied to clipboard.');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const scrollToTimeline = () => {
    timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getValidationClass = (fieldName) => {
    if (!touchedFields[fieldName]) return 'border-theme-border focus:border-blue-600 focus:ring-blue-500/20';
    if (errors[fieldName]) return 'border-red-300 bg-theme-error-bg/20 focus:border-red-500 focus:ring-red-500/20';
    return 'border-emerald-300 bg-theme-success-bg/10 focus:border-emerald-500 focus:ring-emerald-500/20';
  };

  // 1. Render Success Onboarding Portal Screen
  if (submittedApp) {
    return (
      <div className="bg-theme-bg min-h-screen py-16 px-4 font-sans text-theme-text flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl w-full bg-theme-surface border border-theme-border shadow-2xl rounded-[32px] p-8 md:p-12 text-center space-y-8"
        >
          {/* Animated Success Badge */}
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-theme-success-bg text-theme-success shadow-inner">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <Check className="h-12 w-12 stroke-[3px]" />
            </motion.div>
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-outfit text-3xl font-extrabold text-theme-text tracking-tight">Application Successfully Received</h1>
            <p className="text-theme-text-secondary max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              We have received your onboarding registration request. Our administration team manually reviews each organizer account to ensure platform integrity.
            </p>
          </div>

          {/* Premium Ticket Info Card */}
          <div className="bg-theme-bg border border-theme-border/80 rounded-3xl p-6 text-left space-y-4 max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 w-full" />
            
            <div className="flex justify-between items-center text-xs border-b border-theme-border/60 pb-3">
              <span className="font-bold text-theme-text-muted uppercase tracking-widest">Application ID</span>
              <button 
                onClick={() => handleCopyId(submittedApp.applicationId || submittedApp.id)}
                className="flex items-center gap-1.5 font-mono font-bold text-theme-text bg-theme-surface hover:bg-theme-bg-secondary border border-theme-border px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs"
              >
                {submittedApp.applicationId || submittedApp.id}
                <ExternalLink className="w-3 h-3 text-theme-text-muted" />
              </button>
            </div>
            
            <div className="flex justify-between items-center text-xs border-b border-theme-border/60 pb-3">
              <span className="font-bold text-theme-text-muted uppercase tracking-widest">Organization Name</span>
              <span className="font-extrabold text-theme-text">{submittedApp.organizationName}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs border-b border-theme-border/60 pb-3">
              <span className="font-bold text-theme-text-muted uppercase tracking-widest">Review Status</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-theme-primary bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                <Clock className="w-3.5 h-3.5" />
                {submittedApp.status}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-theme-text-muted uppercase tracking-widest">Review Timeline</span>
              <span className="font-extrabold text-theme-text flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                2-3 Business Days
              </span>
            </div>
          </div>

          {/* Action Chain Details */}
          <div className="space-y-4 max-w-md mx-auto text-sm text-theme-text-secondary leading-relaxed">
            <div className="text-left bg-blue-50/30 border border-blue-100/50 rounded-2xl p-5 space-y-3">
              <h2 className="font-bold text-theme-text text-sm flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-theme-primary" />
                What happens next?
              </h2>
              <ol className="list-decimal list-inside space-y-2.5 text-xs text-theme-text-secondary font-medium">
                <li>We will conduct a profile check on <span className="font-bold text-theme-text">{submittedApp.organizationName}</span>.</li>
                <li>A validation link will be dispatched to your registered address (<span className="font-bold text-theme-text">{submittedApp.email}</span>) to verify credentials.</li>
                <li>Upon successful verification, you will receive an invitation to set up your password and access the live dashboard.</li>
              </ol>
            </div>
            <p className="text-xs text-theme-text-muted">
              For security modifications, please reach out to us at <Link to="/contact" className="font-bold text-theme-primary hover:text-blue-700 underline">Support Channels</Link>.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link to="/" className="inline-flex items-center justify-center gap-2 bg-theme-primary hover:bg-theme-accent-hover text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md">
              Return to Homepage
            </Link>
            <button 
              disabled 
              className="inline-flex items-center justify-center gap-2 bg-theme-bg-secondary text-theme-text-muted font-semibold px-8 py-3.5 rounded-xl border border-theme-border cursor-not-allowed opacity-80"
            >
              <Search className="w-4.5 h-4.5" />
              Track Application (Coming Soon)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-theme-bg text-theme-text font-sans min-h-screen relative selection:bg-blue-150">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-28 pb-24 border-b border-theme-border/80 bg-theme-bg">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
          
          <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <Sparkles className="h-4.5 w-4.5 text-theme-primary" />
            Verified Host Program
          </div>
          
          <h1 className="heading-clear font-outfit text-4xl font-extrabold leading-tight tracking-tight text-theme-text sm:text-5xl lg:text-[60px] max-w-4xl mx-auto">
            Become a Verified Organizer
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-theme-text-secondary leading-relaxed font-medium">
            Join Enginow as an authorized organizer to list, promote, and manage hackathons, technical contests, and coding challenges for engineering candidates.
          </p>

          {/* Premium Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3.5 max-w-3xl mx-auto pt-3">
            {[
              { label: 'Secure Application', icon: Lock },
              { label: 'Manual Verification', icon: ShieldCheck },
              { label: 'Trusted Organizations', icon: CheckCircle2 },
              { label: 'Dedicated Support', icon: Phone }
            ].map((badge) => {
              const IconComp = badge.icon;
              return (
                <div key={badge.label} className="flex items-center gap-2 bg-theme-bg border border-theme-border/60 rounded-full px-4 py-1.5 text-xs font-bold text-theme-text-secondary shadow-sm">
                  <IconComp className="w-3.5 h-3.5 text-theme-primary" />
                  {badge.label}
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 bg-theme-primary hover:bg-theme-primary text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer text-sm w-full sm:w-auto"
            >
              Apply for Verification
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={scrollToTimeline}
              className="inline-flex items-center justify-center bg-theme-bg hover:bg-theme-bg-secondary text-theme-text-secondary font-semibold px-8 py-4 rounded-xl border border-theme-border transition hover:-translate-y-0.5 cursor-pointer text-sm w-full sm:w-auto shadow-sm"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS SECTION */}
      <section className="py-24 bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <span className="font-outfit font-bold text-xs text-theme-primary uppercase tracking-widest">Why Host Events?</span>
            <h2 className="font-outfit font-extrabold text-3xl text-theme-text tracking-tight sm:text-4xl">Platform Hosting Benefits</h2>
            <p className="text-theme-text-secondary max-w-lg mx-auto text-sm sm:text-base">Powerful dashboards, targeted reaches, and verification audits at your disposal.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div key={feat.title} className="rounded-3xl border border-theme-border/80 bg-theme-surface p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-theme-primary flex items-center justify-center group-hover:bg-theme-primary group-hover:text-white transition-colors duration-300 shadow-inner">
                      <IconComp className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="font-outfit font-bold text-lg text-theme-text">{feat.title}</h3>
                    <p className="text-theme-text-secondary text-sm leading-relaxed font-medium">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ELIGIBILITY REQUIREMENTS */}
      <section className="py-24 bg-theme-bg border-y border-theme-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <span className="font-outfit font-bold text-xs text-theme-primary uppercase tracking-widest font-semibold">Eligibility Check</span>
            <h2 className="font-outfit font-extrabold text-3xl text-theme-text tracking-tight sm:text-4xl">Who Can Register?</h2>
            <p className="text-theme-text-secondary max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
              We approve organizational coordinator accounts representing verified educational, technological, corporate, or nonprofit bodies.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {eligibility.map((item) => (
              <div key={item.category} className="rounded-2xl border border-theme-border bg-theme-bg p-6 flex flex-col justify-between space-y-4 hover:border-blue-400 transition-colors">
                <div className="space-y-2">
                  <span className="inline-flex text-[9px] font-bold uppercase tracking-wider text-theme-primary bg-blue-50 border border-blue-100 rounded px-2.5 py-0.5">{item.badge}</span>
                  <h4 className="font-outfit font-extrabold text-base text-theme-text pt-1">{item.category}</h4>
                  <p className="text-theme-text-secondary text-xs leading-relaxed font-semibold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VERIFICATION TIMELINE */}
      <section ref={timelineRef} className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle closest-side at 50% 50%,rgba(37,99,235,0.06),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <span className="font-outfit font-bold text-xs text-blue-400 uppercase tracking-widest">Auditing Pipeline</span>
            <h2 className="font-outfit font-extrabold text-3xl tracking-tight sm:text-4xl text-white">How Verification Works</h2>
            <p className="text-theme-text-muted max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
              Our structured pipeline keeps onboarding simple, safe, and manual.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
            {timelineStages.map((stage, idx) => (
              <div key={stage.title} className="bg-theme-surface/5 border border-white/10 rounded-3xl p-7 space-y-4 relative group">
                <div className="flex justify-between items-start">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-primary/30 border border-blue-500/20 text-blue-400 font-extrabold text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-theme-text-muted bg-theme-surface/10 border border-white/5 px-2.5 py-0.5 rounded-full">{stage.duration}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-outfit font-bold text-base text-slate-100">{stage.title}</h4>
                  <p className="text-theme-text-muted text-xs leading-relaxed font-semibold">{stage.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-4 w-8 border-t border-dashed border-white/15 z-20 pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION SECTION */}
      <section className="py-24 bg-theme-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="font-outfit font-bold text-xs text-theme-primary uppercase tracking-widest font-semibold">Help Center</span>
            <h2 className="font-outfit font-extrabold text-3xl text-theme-text tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
            <p className="text-theme-text-secondary text-xs sm:text-sm font-semibold">Got questions? We have mapped common queries below.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div key={faq.q} className="border border-theme-border rounded-2xl overflow-hidden transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left p-5 font-bold text-theme-text text-sm sm:text-base hover:bg-theme-bg cursor-pointer transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-theme-text-muted transition-transform duration-200 shrink-0 ml-4 ${isOpen ? 'rotate-180 text-theme-primary' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-theme-text-secondary text-xs sm:text-sm leading-relaxed border-t border-theme-divider font-semibold bg-theme-bg/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FORM WIZARD CONTAINER */}
      <section ref={formRef} className="py-24 bg-theme-bg border-t border-theme-border scroll-mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-theme-surface rounded-[32px] border border-slate-250 shadow-xl overflow-hidden">
            
            {/* Form Title & Top Progress Tracker */}
            <div className="bg-slate-950 text-white p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className="font-outfit font-extrabold text-xl sm:text-2xl">Verification Application</h3>
                  <p className="text-theme-text-muted text-xs sm:text-sm leading-relaxed">
                    Provide accurate coordinates. All fields marked with * are required.
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase">
                    Step {currentStep} of {totalSteps}
                  </div>
                  <div className="text-[11px] font-semibold text-theme-text-muted">
                    {getStepRemainingTime()}
                  </div>
                </div>
              </div>

              {/* Progress Indicator Bar */}
              <div className="space-y-2">
                <div className="w-full h-1.5 bg-theme-surface/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {/* Horizontal Step labels */}
                <div className="hidden sm:flex justify-between text-[9px] font-bold text-theme-text-secondary uppercase tracking-wider">
                  {stepTitles.map((title, index) => {
                    const stepNum = index + 1;
                    const isActive = currentStep === stepNum;
                    const isCompleted = currentStep > stepNum;
                    return (
                      <span 
                        key={title} 
                        className={`transition-colors duration-205 ${
                          isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-500' : 'text-slate-550'
                        }`}
                      >
                        {isCompleted ? '✓ ' : ''}{title}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Form Core */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              
              <AnimatePresence mode="wait">
                
                {/* STEP 1: ORGANIZATION CARD */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-theme-divider pb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-theme-primary flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-outfit font-extrabold text-base text-theme-text">Organization Information</h4>
                        <p className="text-theme-text-muted text-xs font-semibold">Enter profile coordinates for your campus group or firm.</p>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider flex items-center justify-between">
                          <span>Organization Name *</span>
                          <span className="text-[10px] text-theme-text-muted font-medium lowercase">Required</span>
                        </label>
                        <div className="relative">
                          <input
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleInputChange}
                            onBlur={handleFieldBlur}
                            className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('organizationName')}`}
                            placeholder="e.g. SVNIT Developers Chapter"
                          />
                          {touchedFields.organizationName && (
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                              {errors.organizationName ? (
                                <AlertTriangle className="w-4.5 h-4.5 text-red-500 animate-bounce" />
                              ) : (
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                              )}
                            </div>
                          )}
                        </div>
                        {touchedFields.organizationName && errors.organizationName && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.organizationName}
                          </p>
                        )}
                      </div>

                      {/* Select Dropdown */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider flex items-center justify-between">
                          <span>Organization Type *</span>
                          <span className="text-[10px] text-theme-text-muted font-medium lowercase">Required</span>
                        </label>
                        <select
                          name="organizationType"
                          value={formData.organizationType}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold bg-theme-bg/50 cursor-pointer outline-none transition duration-200 ${getValidationClass('organizationType')}`}
                        >
                          <option value="">-- Choose Type --</option>
                          {organizationTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        {touchedFields.organizationType && errors.organizationType && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.organizationType}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Web URL */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider flex items-center justify-between">
                          <span>Official Website</span>
                          <span className="text-[10px] text-theme-text-muted font-semibold normal-case">Optional</span>
                        </label>
                        <input
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('website')}`}
                          placeholder="https://example.com"
                        />
                        {touchedFields.website && errors.website && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.website}
                          </p>
                        )}
                      </div>

                      {/* LinkedIn URL */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider flex items-center justify-between">
                          <span>LinkedIn Page</span>
                          <span className="text-[10px] text-slate-455 font-semibold normal-case">Optional</span>
                        </label>
                        <input
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('linkedin')}`}
                          placeholder="https://linkedin.com/company/example"
                        />
                        {touchedFields.linkedin && errors.linkedin && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.linkedin}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PRIMARY CONTACT CARD */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-theme-divider pb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-theme-primary flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-outfit font-extrabold text-base text-theme-text">Primary Contact Details</h4>
                        <p className="text-theme-text-muted text-xs font-semibold">Who should we contact for onboarding review steps?</p>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">Applicant Coordinator Name *</label>
                        <input
                          name="applicantName"
                          value={formData.applicantName}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('applicantName')}`}
                          placeholder="e.g. Alex Carter"
                        />
                        {touchedFields.applicantName && errors.applicantName && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.applicantName}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider flex items-center justify-between">
                          <span>Official Email Address *</span>
                          <span className="text-[10px] text-theme-text-muted font-semibold normal-case">verification key</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('email')}`}
                          placeholder="you@example.com"
                        />
                        {touchedFields.email && errors.email && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                      {/* Phone */}
                      <div className="space-y-1 sm:col-span-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">Phone Number *</label>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('phone')}`}
                          placeholder="+91 XXXXX XXXXX"
                        />
                        {touchedFields.phone && errors.phone && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* City */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">City *</label>
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('city')}`}
                          placeholder="Surat"
                        />
                        {touchedFields.city && errors.city && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.city}
                          </p>
                        )}
                      </div>

                      {/* Country */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">Country *</label>
                        <input
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('country')}`}
                          placeholder="India"
                        />
                        {touchedFields.country && errors.country && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: EXPERIENCE & INTENT */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-theme-divider pb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-theme-primary flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-outfit font-extrabold text-base text-theme-text">Experience & Intent</h4>
                        <p className="text-theme-text-muted text-xs font-semibold">Share your institutional hosting strategy.</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-550 uppercase tracking-wider">
                        <span>Describe your organization *</span>
                        <span className="text-[10px] text-theme-text-muted font-medium normal-case">
                          {formData.description.length}/1000 chars
                        </span>
                      </div>
                      <textarea
                        rows="4"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        maxLength="1000"
                        className={`w-full resize-none rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('description')}`}
                        placeholder="Provide details about your institution history, core team size, technical achievements..."
                      />
                      {touchedFields.description && errors.description && (
                        <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Purpose */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-550 uppercase tracking-wider">
                        <span>Why do you want to host events on Enginow? *</span>
                        <span className="text-[10px] text-theme-text-muted font-medium normal-case">
                          {formData.purpose.length}/1000 chars
                        </span>
                      </div>
                      <textarea
                        rows="4"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        maxLength="1000"
                        className={`w-full resize-none rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('purpose')}`}
                        placeholder="Explain the type of contests, target student groups, and rewards you plan to establish..."
                      />
                      {touchedFields.purpose && errors.purpose && (
                        <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          {errors.purpose}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: SCALE & PLANNING */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-theme-divider pb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-theme-primary flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-outfit font-extrabold text-base text-theme-text">Scale & Planning Metrics</h4>
                        <p className="text-theme-text-muted text-xs font-semibold">Help us size your event hosting resources.</p>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Events Count */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">Approximate events per year *</label>
                        <input
                          type="number"
                          name="expectedEvents"
                          value={formData.expectedEvents}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('expectedEvents')}`}
                          placeholder="e.g. 5"
                        />
                        {touchedFields.expectedEvents && errors.expectedEvents && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.expectedEvents}
                          </p>
                        )}
                      </div>

                      {/* Participant Size */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-550 uppercase tracking-wider">Expected participants per event *</label>
                        <input
                          type="number"
                          name="expectedParticipants"
                          value={formData.expectedParticipants}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className={`w-full rounded-xl border px-4 py-3 text-theme-text text-sm font-semibold outline-none transition duration-200 ${getValidationClass('expectedParticipants')}`}
                          placeholder="e.g. 150"
                        />
                        {touchedFields.expectedParticipants && errors.expectedParticipants && (
                          <p className="text-[11px] text-theme-error font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            {errors.expectedParticipants}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: REVIEW APPLICATION SUMMARY */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 text-xs sm:text-sm text-theme-text-secondary"
                  >
                    <div className="flex items-center gap-3 border-b border-theme-divider pb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-theme-primary flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-outfit font-extrabold text-base text-theme-text font-sans">Review Application Summary</h4>
                        <p className="text-theme-text-muted text-xs font-semibold">Verify all entered values before declaration submission.</p>
                      </div>
                    </div>

                    {/* Section 1 */}
                    <div className="bg-theme-bg border border-theme-border rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-theme-border pb-2">
                        <h5 className="font-bold text-theme-text text-xs uppercase tracking-wider flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-theme-primary" />
                          Organization Profile
                        </h5>
                        <button
                          type="button"
                          onClick={() => handleEditSection(1)}
                          className="flex items-center gap-1 text-[11px] font-bold text-theme-primary hover:text-blue-700 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 text-xs font-semibold">
                        <div><span className="text-theme-text-muted">Name:</span> {formData.organizationName}</div>
                        <div><span className="text-theme-text-muted">Type:</span> {formData.organizationType}</div>
                        <div><span className="text-theme-text-muted">Website:</span> {formData.website || <span className="text-theme-text-muted italic">None</span>}</div>
                        <div><span className="text-theme-text-muted">LinkedIn:</span> {formData.linkedin || <span className="text-theme-text-muted italic">None</span>}</div>
                      </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-theme-bg border border-theme-border rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-theme-border pb-2">
                        <h5 className="font-bold text-theme-text text-xs uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-4 h-4 text-theme-primary" />
                          Primary Coordinator
                        </h5>
                        <button
                          type="button"
                          onClick={() => handleEditSection(2)}
                          className="flex items-center gap-1 text-[11px] font-bold text-theme-primary hover:text-blue-700 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 text-xs font-semibold">
                        <div><span className="text-theme-text-muted">Full Name:</span> {formData.applicantName}</div>
                        <div><span className="text-theme-text-muted">Official Email:</span> {formData.email}</div>
                        <div><span className="text-theme-text-muted">Phone:</span> {formData.phone}</div>
                        <div><span className="text-theme-text-muted">Location:</span> {formData.city}, {formData.country}</div>
                      </div>
                    </div>

                    {/* Section 3 & 4 */}
                    <div className="bg-theme-bg border border-theme-border rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-theme-border pb-2">
                        <h5 className="font-bold text-theme-text text-xs uppercase tracking-wider flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-theme-primary" />
                          Event Planning & Scope
                        </h5>
                        <button
                          type="button"
                          onClick={() => handleEditSection(3)}
                          className="flex items-center gap-1 text-[11px] font-bold text-theme-primary hover:text-blue-700 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                      <div className="space-y-2 text-xs font-semibold">
                        <div><span className="text-theme-text-muted">Description:</span> <p className="mt-1 text-theme-text-secondary whitespace-pre-wrap leading-relaxed">{formData.description}</p></div>
                        <div className="border-t border-theme-border/50 pt-2"><span className="text-theme-text-muted">Purpose / Intent:</span> <p className="mt-1 text-theme-text-secondary whitespace-pre-wrap leading-relaxed">{formData.purpose}</p></div>
                        <div className="grid gap-3 sm:grid-cols-2 border-t border-theme-border/50 pt-2">
                          <div><span className="text-theme-text-muted">Expected Events/Year:</span> {formData.expectedEvents}</div>
                          <div><span className="text-theme-text-muted">Expected Participants/Event:</span> {formData.expectedParticipants}</div>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* STEP 6: DECLARATION & SUBMIT */}
                {currentStep === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-theme-divider pb-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-theme-primary flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-outfit font-extrabold text-base text-theme-text">Declaration & Verification</h4>
                        <p className="text-theme-text-muted text-xs font-semibold">Agree to hosting terms and finalize submission.</p>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-555 uppercase tracking-wider">
                        <span>Additional Remarks (optional)</span>
                        <span className="text-[10px] text-theme-text-muted font-medium normal-case">
                          {formData.additionalInformation.length}/1000 chars
                        </span>
                      </div>
                      <textarea
                        rows="3"
                        name="additionalInformation"
                        value={formData.additionalInformation}
                        onChange={handleInputChange}
                        maxLength="1000"
                        className="w-full resize-none rounded-xl border border-theme-border bg-theme-bg px-4 py-3 text-theme-text text-sm font-semibold outline-none transition focus:border-blue-600 focus:bg-theme-surface focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Any extra comments or specific onboarding needs you wish to communicate to admins..."
                      />
                    </div>

                    {/* Declaration check */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer font-bold text-theme-text-secondary text-xs leading-5">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                          className="w-5 h-5 mt-0.5 rounded border-theme-border text-theme-primary focus:ring-blue-500 focus:ring-offset-0 cursor-pointer shrink-0"
                        />
                        <span>I confirm that the details provided here represent a certified coordinator of the organization. I understand that submitting fake information will lead to immediate denial and email bans. *</span>
                      </label>
                      {touchedFields.termsAccepted && errors.termsAccepted && (
                        <p className="text-[11px] text-theme-error font-bold flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          {errors.termsAccepted}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Wizard Control Buttons */}
              <div className="pt-4 border-t border-theme-divider flex justify-between items-center">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={loading}
                    className="inline-flex items-center gap-2 border border-theme-border hover:bg-theme-bg text-theme-text-secondary font-bold px-6 py-3 rounded-xl transition duration-200 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 bg-theme-primary hover:bg-theme-primary text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-theme-primary hover:bg-theme-primary text-white font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Registering...
                      </>
                    ) : (
                      <>
                        Submit Organizer Application
                        <Check className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
