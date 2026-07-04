import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Sparkles } from 'lucide-react';
import { InteractiveRobotSpline } from '../../components/ui/interactive-3d-robot';
import { useAuth } from '../../hooks/useAuth';

const authConfig = {
  login: {
    title: 'Welcome back',
    subtitle: 'Enter your credentials to manage your events or explore hackathons.',
    cta: 'Sign In to Account',
    switchText: "Don't have an account?",
    switchLinkText: 'Create one for free',
    switchRoute: '/signup',
    badge: 'Sign In',
    panelTitle: 'Real-time event collaboration',
    panelText: 'Sync your team, track progress, and manage hackathons with confidence.',
  },
  signup: {
    title: 'Create an account',
    subtitle: 'Join the platform to discover hackathons or host your own events.',
    cta: 'Create Account',
    switchText: 'Already have an account?',
    switchLinkText: 'Sign in here',
    switchRoute: '/login',
    badge: 'Register',
    panelTitle: 'Build your developer community',
    panelText: 'Host events, collaborate in real time, and grow your network effortlessly.',
  },
};

const roles = [
  { value: 'Participant', label: 'Participant (Discover & Register)' },
  { value: 'Organiser', label: 'Organiser (Host & Manage)' },
];

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const mode = location.pathname.includes('/signup') ? 'signup' : 'login';
  const config = authConfig[mode];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Participant');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && (!termsAccepted || !privacyAccepted)) {
      setError('Please accept the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);

    try {
      const fromPath = location.state?.from;
      if (mode === 'signup') {
        const normalizedRole = role.toLowerCase();
        const user = await register({ name, email, password, role: normalizedRole });
        if (user.role === 'admin') {
          navigate('/admin/users');
        } else if (user.role === 'organiser') {
          navigate('/organiser');
        } else {
          navigate(fromPath || '/dashboard');
        }
      } else {
        const user = await login({ email, password });
        if (user.role === 'admin') {
          navigate('/admin/users');
        } else if (user.role === 'organiser') {
          navigate('/organiser');
        } else {
          navigate(fromPath || '/dashboard');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = (target) => {
    if (target === mode) return;
    setError('');
    setTermsAccepted(false);
    setPrivacyAccepted(false);
    navigate(target === 'signup' ? '/signup' : '/login');
  };

  return (
    <main className="h-[calc(100vh-68px)] w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] overflow-hidden bg-white text-slate-900 font-sans">
      <section className="hidden lg:flex relative items-center justify-center bg-slate-950 overflow-hidden border-r border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle closest-side at 0 0,rgba(37,99,235,0.12),transparent_35%),radial-gradient(circle closest-side at 100% 100%,rgba(6,182,212,0.08),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,23,42,0.84))]" />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-10">
          <div className="max-w-sm space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 shadow-lg shadow-slate-950/20">
              <Sparkles className="w-4 h-4 text-blue-400" />
              {config.badge}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
              {config.panelTitle}
            </h2>
            <p className="text-sm leading-7 text-slate-350">
              {config.panelText}
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-4 py-3 text-sm text-slate-305 shadow-lg shadow-slate-950/40 border border-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-450" />
                Live collaboration with event teams
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-4 py-3 text-sm text-slate-305 shadow-lg shadow-slate-950/40 border border-slate-800">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-450" />
                Clean, modern workflows for organisers
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[radial-gradient(circle closest-side at 50% 50%,rgba(6,182,212,0.08),transparent_48%)] pointer-events-none" />
        <div className="absolute inset-0 z-20 opacity-30">
          <InteractiveRobotSpline
            scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="relative flex flex-col justify-center px-6 sm:px-16 md:px-20 lg:px-24 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 mt-16 mr-16 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute bottom-12 left-10 h-44 w-44 rounded-full bg-cyan-100/20 blur-3xl" />
        <div className="relative z-20 w-full max-w-md mx-auto">
          <div className="flex items-center justify-between gap-3 mb-10 p-1.5 rounded-xl border border-slate-200 bg-slate-100/60 shadow-sm shadow-slate-200/40">
            <button
              type="button"
              onClick={() => handleModeToggle('login')}
              className={`flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeToggle('signup')}
              className={`flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Register
            </button>
          </div>

          <div className="space-y-6 bg-white border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                {config.badge}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">
                {config.title}
              </h1>
              <p className="text-sm text-slate-500 leading-6">
                {config.subtitle}
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-750 shadow-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-slate-50"
                      placeholder="Alex Carter"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-slate-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <a href="#forgot" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-slate-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    I want to join as a
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-slate-50 cursor-pointer"
                  >
                    {roles.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <label className="flex items-start gap-2.5 cursor-pointer font-semibold text-slate-600 text-xs leading-5">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-200 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>
                      I have read and agree to the{' '}
                      <Link
                        to="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-600 hover:text-blue-700"
                      >
                        Terms of Service
                      </Link>
                      .
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer font-semibold text-slate-600 text-xs leading-5">
                    <input
                      type="checkbox"
                      required
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-200 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>
                      I consent to the collection and use of my information as described in the{' '}
                      <Link
                        to="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-600 hover:text-blue-700"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 text-sm"
              >
                {loading ? `${mode === 'login' ? 'Signing in' : 'Creating account'}...` : config.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs font-medium text-slate-500 pt-3 border-t border-slate-100">
              {mode === 'login' && (
                <p className="mb-3 leading-5">
                  By signing in, you continue under Enginow's{' '}
                  <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-700">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                  .
                </p>
              )}
              {config.switchText}{' '}
              <button
                type="button"
                onClick={() => handleModeToggle(config.switchRoute === '/signup' ? 'signup' : 'login')}
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                {config.switchLinkText}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
