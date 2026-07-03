/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Stethoscope, Lock, Mail, Eye, EyeOff, CheckCircle, ShieldAlert, Heart, Activity } from 'lucide-react';
import { Doctor } from '../types';
import { mockDoctor } from '../mockData';

interface LoginProps {
  key?: string | number;
  onLoginSuccess: (doctor: Doctor) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('doctor@docohealth.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your clinical email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate login verification latency
    setTimeout(() => {
      setIsLoading(false);
      // Demo authentication permits any credentials, but preloads our premium doctor
      onLoginSuccess({
        ...mockDoctor,
        email: email
      });
    }, 1200);
  };

  const handleQuickLogin = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(mockDoctor);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative overflow-hidden font-sans">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00a8cc]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Left Column: Visual/SaaS Presentation (hidden on small devices) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-50 via-slate-100 to-white p-12 flex-col justify-between relative border-r border-slate-250">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,168,204,0.05),transparent)]" />
        
        {/* Header Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-[#00a8cc]/10 border border-[#00a8cc]/20 p-2.5 rounded-xl shadow-md shadow-[#00a8cc]/5">
            <Stethoscope className="w-6 h-6 text-[#00a8cc]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
            DOCO <span className="text-[#00a8cc] font-medium text-lg ml-1">Portal</span>
          </span>
        </div>

        {/* Center Presentation */}
        <div className="my-auto relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00a8cc]/10 text-[#006f8e] border border-[#00a8cc]/25 mb-6">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Phase 1 Foundation Live
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Clinical intelligence, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#007198] to-[#00a8cc]">
                seamlessly organized.
              </span>
            </h2>
            <p className="text-slate-600 mt-4 text-sm leading-relaxed font-medium">
              Empowering cardiologists and care teams with unified patient directories, automated appointment schedulers, and sub-second vital metrics analysis.
            </p>
          </motion.div>

          {/* Core Feature bullet points */}
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-1.5 rounded-lg mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">HIPAA Compliant Ledger Architecture</h4>
                <p className="text-xs text-slate-500 font-medium">Restricted access and audited transactions ensure absolute privacy.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-1.5 rounded-lg mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Real-time Clinical Sync Engine</h4>
                <p className="text-xs text-slate-500 font-medium font-sans">Instantly synchronize with wearable telemetry and hospital databases.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 flex justify-between items-center relative z-10">
          <span>&copy; 2026 DOCO Healthcare, Inc.</span>
          <span className="flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer font-semibold">
            Security Certifications <Lock className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Right Column: Interactive Login gate */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-150 p-8 rounded-[32px] shadow-xl relative">
          
          {/* Mobile logo (visible on mobile only) */}
          <div className="flex md:hidden items-center gap-2 mb-6 justify-center">
            <div className="bg-[#00a8cc]/10 border border-[#00a8cc]/25 p-2 rounded-xl">
              <Stethoscope className="w-5 h-5 text-[#00a8cc]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">DOCO Portal</span>
          </div>

          <div className="text-center md:text-left mb-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Clinician Authentication</h3>
            <p className="text-slate-500 text-xs font-semibold mt-1">Sign in with your corporate DOCO credentials</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-2xl mb-4 text-xs flex items-center gap-2 font-medium animate-pulse">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Clinical Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc] rounded-2xl py-2.5 pl-11 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all font-semibold"
                  placeholder="name@docohealth.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="login-password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-[#006f8e] hover:text-[#00a8cc] font-bold transition-all">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc] rounded-2xl py-2.5 pl-11 pr-11 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all font-semibold"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 bg-slate-50 text-[#00a8cc] focus:ring-0 w-4.5 h-4.5"
                />
                <span className="text-xs text-slate-500 font-semibold">Remember my session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00a8cc] hover:bg-[#007198] text-white font-extrabold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-[#00a8cc]/10 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Secure Sign In'
              )}
            </button>
          </form>

          {/* Quick Preset Access */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-150" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
              <span className="bg-white px-3 text-slate-400">OR DEMO ENTRY</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickLogin}
            disabled={isLoading}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-extrabold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a8cc]"></span>
            </div>
            <span>Fast Login (Preset: Dr. Adithi)</span>
          </button>

          {/* Portal metadata */}
          <div className="mt-8 pt-4 border-t border-slate-150 text-center text-[11px] text-slate-400 flex justify-center items-center gap-4 font-semibold">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500/80" /> Cardiologist Module v1.0.4</span>
            <span>•</span>
            <span>Demo: Any credentials pass</span>
          </div>
        </div>
      </div>
    </div>
  );
}
