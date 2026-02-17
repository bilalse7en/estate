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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
        },
      });
      
      if (googleError) throw googleError;
    } catch (err) {
      setError(err.message || 'Error signing in with Google');
      setGoogleLoading(false);
    }
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
      <div className="max-w-md w-full glass p-10 rounded-3xl shadow-2xl gradient-border-brown">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-[var(--text-main)] mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-[var(--text-muted)]">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 glass-light rounded-xl flex items-center space-x-3 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-500/10">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {message && !error && (
          <div className={`mb-6 p-4 glass-light rounded-xl flex items-center space-x-3 border ${message.includes('failed') || message.includes('Could not') ? 'text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50 bg-red-500/10' : 'text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-500/10'}`}>
            {message.includes('failed') || message.includes('Could not') ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full py-4 px-6 glass rounded-xl border border-[var(--glass-border)] hover:border-primary-500/50 transition-all duration-300 flex items-center justify-center space-x-3 group mb-6 shadow-lg hover:shadow-xl"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[var(--text-main)]" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-semibold text-[var(--text-main)] group-hover:text-primary-500 transition-colors">
                Continue with Google
              </span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--glass-border)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[var(--bg-main)] text-[var(--text-muted)] font-medium uppercase tracking-wider text-xs">
              Or continue with email
            </span>
          </div>
        </div>

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
            disabled={loading || googleLoading}
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
