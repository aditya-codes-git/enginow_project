import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';

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
    subtitle: 'Discover hackathons and engineering events.',
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
  const { login, register, signInWithGoogle, isAuthenticated, user, loading: authLoading } = useAuth();
  const mode = location.pathname.includes('/signup') ? 'signup' : 'login';

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const fromPath = location.state?.from;
      if (user.role === 'admin') {
        navigate('/admin/users', { replace: true });
      } else if (user.role === 'organiser') {
        navigate('/organiser', { replace: true });
      } else {
        navigate(fromPath || '/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const config = authConfig[mode];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const role = 'participant';

  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  // privacyAccepted is kept for API compatibility but driven by the combined checkbox
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-surface">
        <span className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

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
        const user = await register({ name, email, password, role });
        if (user?.role === 'admin') {
          navigate('/admin/users');
        } else if (user?.role === 'organiser') {
          navigate('/organiser');
        } else if (user) {
          navigate(fromPath || '/dashboard');
        }
      } else {
        const user = await login({ email, password });
        if (user?.role === 'admin') {
          navigate('/admin/users');
        } else if (user?.role === 'organiser') {
          navigate('/organiser');
        } else if (user) {
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
      {/* ─── Theme switcher & Return to Home: top-left corner ─── */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <ThemeSwitcher />
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg/60 border border-theme-border/60 hover:border-theme-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 h-9 bg-theme-surface shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
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
                className={`flex-1 relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${mode === m
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
            {/* Logo at the top of the card */}
            <div className="mb-2">
              <Link to="/" className="inline-block group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg">
                <Logo imageClassName="h-7 group-hover:scale-[1.02] transition-transform duration-200" textClassName="text-lg" />
              </Link>
            </div>

            {/* Header */}
            <div className="space-y-0.5 mb-3">
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

              {/* Terms & Privacy combined (signup only) */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg border border-theme-border bg-theme-bg/50 p-2"
                  >
                    <AnimatedCheckbox
                      checked={termsAccepted && privacyAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        setPrivacyAccepted(e.target.checked);
                      }}
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
                      {' '}and{' '}
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

            {/* Divider */}
            <div className="relative my-2.5 flex items-center justify-center">
              <span className="absolute w-full border-t border-theme-divider"></span>
              <span className="relative bg-theme-surface px-3 text-xs font-semibold text-theme-text-muted">Or continue with</span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={async () => {
                setError('');
                try {
                  await signInWithGoogle();
                } catch (err) {
                  setError(err.message || 'Google OAuth failed');
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-bg px-4 py-3 text-sm font-semibold text-theme-text transition-all duration-200"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* Switch */}
            <div className="mt-2.5 pt-2 border-t border-theme-divider">
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
