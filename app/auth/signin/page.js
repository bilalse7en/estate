'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signinError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signinError) throw signinError;

      router.push('/');
    } catch (err) {
      setError(err.message || 'Error signing in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] px-4 py-12">
      <div className="max-w-md w-full glass p-10 rounded-3xl shadow-2xl border border-[var(--glass-border)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-[var(--text-main)] mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-[var(--text-muted)]">Enter your credentials to continue</p>
        </div>

        {message && (
          <div className="mb-6 p-4 glass-light rounded-xl flex items-center space-x-3 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 glass-light rounded-xl flex items-center space-x-3 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 btn-premium rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-xl"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>

        <p className="mt-8 text-center text-[var(--text-muted)]">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
