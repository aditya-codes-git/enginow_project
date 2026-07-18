import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Sparkles } from 'lucide-react';
import { InteractiveRobotSpline } from '../../components/ui/interactive-3d-robot';
import { useAuth } from '../../hooks/useAuth';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Participant');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('Please agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);

    try {
      const fromPath = location.state?.from;
      const normalizedRole = role.toLowerCase();
      const user = await register({ name, email, password, role: normalizedRole });
      if (user.role === 'admin') {
        navigate('/admin/users');
      } else if (user.role === 'organiser') {
        navigate('/organiser');
      } else {
        navigate(fromPath || '/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
    <main className="h-[calc(100vh-68px)] w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-theme-surface text-theme-text font-sans">
      
      {/* Left Column: Interactive 3D Robot (50% volume) */}
      <section className="hidden lg:flex bg-slate-950 flex-col justify-end relative overflow-hidden border-r border-slate-900 h-full">
        {/* Subtle background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* 3D Robot Spline Asset */}
        <div className="absolute inset-0 z-10">
          <InteractiveRobotSpline scene={ROBOT_SCENE_URL} className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Right Column: Premium Signup Form (Occupying complete space, no card margins) */}
      <section className="flex flex-col justify-center px-6 sm:px-16 md:px-20 lg:px-24 bg-theme-surface relative h-full overflow-hidden">
        {/* Top-Right Glows */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md mx-auto space-y-5 relative z-20">
          
          {/* Form Header */}
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-theme-primary" />
              Register
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-theme-text font-outfit pt-2">
              Create an account
            </h1>
            <p className="text-xs font-medium text-theme-text-secondary">
              Join the platform to discover hackathons or host your own events.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-xl border border-theme-error-border bg-theme-error-bg px-4 py-3 text-sm font-semibold text-theme-error shadow-sm break-words">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-text-muted">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-theme-border text-theme-text placeholder:text-theme-text-muted text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-theme-focus transition-all duration-200 bg-theme-bg/50 focus:bg-theme-surface"
                    placeholder="Alex Carter"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-text-muted">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-theme-border text-theme-text placeholder:text-theme-text-muted text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-theme-focus transition-all duration-200 bg-theme-bg/50 focus:bg-theme-surface"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-text-muted">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-theme-border text-theme-text placeholder:text-theme-text-muted text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-theme-focus transition-all duration-200 bg-theme-bg/50 focus:bg-theme-surface"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text-secondary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Account Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wider">
                  I want to join as a
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-theme-border text-theme-text text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-theme-focus transition-all duration-200 bg-theme-bg/50 focus:bg-theme-surface cursor-pointer"
                >
                  <option value="Participant">Participant (Discover & Register)</option>
                  <option value="Organiser">Organiser (Host & Manage)</option>
                </select>
              </div>

            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <label className="flex items-start gap-2.5 cursor-pointer font-semibold text-theme-text-secondary text-xs leading-tight">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-theme-border text-theme-primary focus:ring-theme-focus focus:ring-offset-0 cursor-pointer"
                />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-theme-primary hover:bg-theme-primary text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {loading ? (
                  'Creating Account...'
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Footer Link */}
          <div className="text-center text-xs font-medium text-theme-text-secondary pt-3 border-t border-theme-divider">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-theme-primary hover:text-blue-700">
              Sign in here
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
