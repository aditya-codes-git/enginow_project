import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

// Auth components
import HeroPanel from '../../components/auth/HeroPanel';
import AnimatedInput from '../../components/auth/AnimatedInput';
import PasswordStrengthBar from '../../components/auth/PasswordStrengthBar';
import AnimatedCheckbox from '../../components/auth/AnimatedCheckbox';
import PrimaryButton from '../../components/auth/PrimaryButton';
import ThemeSwitcher from '../../components/ThemeSwitcher';

const authConfig = {
  login: {
    title: 'Welcome back',
    subtitle: 'Enter your credentials to manage your events or explore hackathons.',
    cta: 'Sign In to Account',
    switchText: "Don't have an account?",
    switchLinkText: 'Create one for free',
    switchRoute: '/signup',
    badge: 'Sign In',
  },
  signup: {
    title: 'Create an account',
    subtitle: 'Join the platform to discover hackathons or host your own events.',
    cta: 'Create Account',
    switchText: 'Already have an account?',
    switchLinkText: 'Sign in here',
    switchRoute: '/login',
    badge: 'Register',
  },
};

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const mode = location.pathname.includes('/signup') ? 'signup' : 'login';
  const config = authConfig[mode];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        const user = await register({ name, email, password });
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
    <main className="h-screen w-full grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] overflow-hidden bg-theme-surface text-theme-text font-sans relative">
      {/* ─── Theme switcher: top-left corner ─── */}
      <div className="absolute top-4 left-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* ─── Left: Immersive Hero Panel ─── */}
      <HeroPanel />

      {/* ─── Right: Authentication Form ─── */}
      <section className="relative flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-10 xl:px-16 bg-theme-surface overflow-hidden">
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <motion.div
          className="relative z-10 w-full max-w-[390px] mx-auto py-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Mode toggle tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-theme-border bg-theme-bg/60 mb-4">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeToggle(m)}
                className={`flex-1 relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                  mode === m
                    ? 'text-theme-text'
                    : 'text-theme-text-muted hover:text-theme-text-secondary'
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="auth-tab-indicator"
                    className="absolute inset-0 rounded-lg bg-theme-surface shadow-sm border border-theme-border/50"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{m === 'login' ? 'Sign In' : 'Register'}</span>
              </button>
            ))}
          </div>

          {/* Auth card */}
          <div className="rounded-xl border border-theme-border bg-theme-surface p-5 sm:p-6 shadow-xl shadow-black/[0.03]">
            {/* Header */}
            <div className="space-y-1 mb-4">
              <motion.span
                key={config.badge}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] rounded-full px-2.5 py-0.5 border"
                style={{
                  color: 'var(--color-primary)',
                  backgroundColor: 'rgba(var(--color-primary-rgb), 0.08)',
                  borderColor: 'rgba(var(--color-primary-rgb), 0.15)',
                }}
              >
                {config.badge}
              </motion.span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h1 className="text-xl font-extrabold tracking-tight text-theme-text font-outfit">
                    {config.title}
                  </h1>
                  <p className="text-[12px] text-theme-text-secondary leading-5 mt-0.5">
                    {config.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg border border-theme-error-border bg-theme-error-bg px-3 py-2 text-xs font-semibold text-theme-error mb-3"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name field (signup only) */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AnimatedInput
                      label="Full Name"
                      icon={User}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Carter"
                      required
                      autoComplete="name"
                      name="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <AnimatedInput
                label="Email Address"
                icon={Mail}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                name="email"
              />

              {/* Password */}
              <AnimatedInput
                label="Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                name="password"
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded-lg text-theme-text-muted hover:text-theme-text-secondary hover:bg-theme-bg transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                }
              />

              {/* Password strength (signup only) */}
              {mode === 'signup' && <PasswordStrengthBar password={password} />}

              {/* Forgot password link (login only) */}
              {mode === 'login' && (
                <div className="flex justify-end">
                  <a
                    href="#forgot"
                    className="text-[11px] font-bold hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Terms & Privacy (signup only) */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 rounded-lg border border-theme-border bg-theme-bg/50 p-2.5"
                  >
                    <AnimatedCheckbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    >
                      I agree to the{' '}
                      <Link
                        to="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Terms of Service
                      </Link>
                      .
                    </AnimatedCheckbox>

                    <AnimatedCheckbox
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    >
                      I consent to the{' '}
                      <Link
                        to="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold hover:underline"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Privacy Policy
                      </Link>
                      .
                    </AnimatedCheckbox>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <div className="pt-1">
                <PrimaryButton loading={loading}>
                  {loading
                    ? `${mode === 'login' ? 'Signing in' : 'Creating account'}...`
                    : config.cta}
                </PrimaryButton>
              </div>
            </form>

            {/* Switch */}
            <div className="mt-4 pt-3 border-t border-theme-divider">
              <p className="text-center text-xs font-semibold text-theme-text-secondary">
                {config.switchText}{' '}
                <button
                  type="button"
                  onClick={() => handleModeToggle(config.switchRoute === '/signup' ? 'signup' : 'login')}
                  className="font-bold hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {config.switchLinkText}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
