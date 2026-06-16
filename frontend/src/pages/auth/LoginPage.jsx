import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import { InteractiveRobotSpline } from '../../components/ui/interactive-3d-robot';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login and redirect
    setTimeout(() => {
      setLoading(false);
      navigate('/organiser');
    }, 1200);
  };

  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
    <main className="h-[calc(100vh-68px)] w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden bg-white text-slate-800 font-sans">
      
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

      {/* Right Column: Premium Login Form (Occupying complete space, no card margins) */}
      <section className="flex flex-col justify-center px-6 sm:px-16 md:px-20 lg:px-24 bg-white relative h-full overflow-hidden">
        {/* Top-Right Glows */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md mx-auto space-y-6 relative z-20">
          
          {/* Form Header */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full inline-block">
              Sign In
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-outfit pt-2">
              Welcome back
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Enter your credentials to manage your events or explore hackathons.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3.5">
              
              {/* Email */}
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-200 bg-slate-50/50 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#forgot" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    Forgot?
                  </a>
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
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-200 bg-slate-50/50 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-600 text-xs">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
                />
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {loading ? (
                  'Signing in...'
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Footer Link */}
          <div className="text-center text-xs font-medium text-slate-500 pt-3 border-t border-slate-100">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700">
              Create one for free
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
