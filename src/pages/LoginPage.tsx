import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AgencyConfig } from '../types';
import { AGENCY_CONFIG, CLIENT_CONFIG } from '../data/portalData';

interface LoginPageProps {
  agency?: AgencyConfig;
}

export const LoginPage: React.FC<LoginPageProps> = ({ agency }) => {
  const activeAgency = agency || AGENCY_CONFIG;
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState(CLIENT_CONFIG.email);
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const result = await login(email, password);
    if (!result.success && result.message) {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 transition-colors dark:bg-slate-950 sm:p-6 lg:p-8">
      {/* Container Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {/* Brand Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700" />

        {/* Agency Brand Header */}
        <div className="text-center pt-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-600/30">
            <span className="font-extrabold text-2xl tracking-tight">SD</span>
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {activeAgency.name}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Client Portal
          </p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-left dark:border-indigo-900/50 dark:bg-indigo-950/30">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Client Sign In
              </p>
              <p className="mt-0.5 text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
                Access client dashboard for <span className="font-semibold">{CLIENT_CONFIG.name}</span>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={demoLogin}
            disabled={isLoading}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-98 transition disabled:opacity-50"
          >
            <span>{isLoading ? 'Accessing Portal...' : 'Launch Dashboard'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-[10px] font-semibold tracking-wider text-slate-400 dark:bg-slate-900">
              Or sign in with email
            </span>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 active:scale-98 transition dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
          <p className="text-[11px] text-slate-400">
            Powered by <span className="font-semibold text-indigo-600 dark:text-indigo-400">{activeAgency.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
