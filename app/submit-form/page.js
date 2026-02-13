'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import { User, Mail, Phone, Home, MessageSquare, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubmitFormPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    propertyInterest: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const propertyTypes = [
    'Residential Apartment',
    'Luxury Villa',
    'Commercial Property',
    'Investment Opportunity',
    'Land/Plot',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      // 1. Save to Supabase
      const { error: insertError } = await supabase
        .from('client_forms')
        .insert([
          {
            user_id: user?.id || null,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            property_interest: formData.propertyInterest,
            message: formData.message,
          },
        ]);

      if (insertError) throw insertError;

      // 2. Trigger email API (Silent fail if environment variables missing on Vercel)
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            to: formData.email,
            name: formData.name,
            formData: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              property_interest: formData.propertyInterest,
              message: formData.message,
            },
          }),
        });
      } catch (emailErr) {
        console.warn('Email notification skipped or failed:', emailErr);
        // We don't throw here - the data is already in Supabase!
      }

      clearTimeout(timeoutId);
      setSuccess(true);
      
      // Give user time to see the success message before redirecting
      setTimeout(() => {
        router.push('/');
      }, 4000);

    } catch (err) {
      setError(err.message || 'Transmission failed. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 md:py-32 bg-[var(--bg-main)] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <span className="h-[1px] w-10 bg-primary-500" />
            <span className="text-primary-600 font-bold tracking-[0.4em] text-[10px] uppercase">Private Acquisition</span>
            <span className="h-[1px] w-10 bg-primary-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[var(--text-main)] mb-6 leading-tight tracking-tighter"
          >
            SECURE YOUR <span className="gradient-text">LEGACY</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed"
          >
            Our private office provides tailored real estate solutions for distinguished clients. Start your inquiry below.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass p-8 md:p-16 rounded-[2.5rem] shadow-3xl border border-[var(--glass-border)] relative overflow-hidden"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {success ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-10 rotate-12 transition-transform duration-700 animate-pulse">
                <CheckCircle className="w-12 h-12 text-primary-500" />
              </div>
              <h2 className="text-3xl font-display font-bold text-[var(--text-main)] mb-6">Inquiry Received</h2>
              <p className="text-[var(--text-muted)] text-lg max-w-sm mx-auto">
                Your request has been prioritized. A consultant will reach out via your preferred method shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium flex items-center space-x-3"
                  >
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {/* Full Name */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500 ml-1">Client Name *</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl text-[var(--text-main)] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all placeholder:text-[var(--text-muted)]/40"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500 ml-1">Correspondence Email *</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl text-[var(--text-main)] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all placeholder:text-[var(--text-muted)]/40"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500 ml-1">Secure Contact No. *</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl text-[var(--text-main)] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all placeholder:text-[var(--text-muted)]/40"
                      placeholder="+971 -- --- ----"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500 ml-1">Asset Category *</label>
                  <div className="relative group">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                    <select
                      name="propertyInterest"
                      required
                      value={formData.propertyInterest}
                      onChange={handleChange}
                      className="w-full pl-12 pr-6 py-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-2xl text-[var(--text-main)] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none appearance-none transition-all cursor-pointer"
                    >
                      <option value="">Select interest...</option>
                      {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500 ml-1">Acquisition Details / Specific Requirements</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-6 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-5 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-3xl text-[var(--text-main)] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all placeholder:text-[var(--text-muted)]/40 resize-none"
                    placeholder="Briefly describe your investment objectives or specific property interests..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full py-6 flex items-center justify-center space-x-3 text-base shadow-2xl group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>TRANSMIT INQUIRY</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
