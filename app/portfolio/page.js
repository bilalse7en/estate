'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { 
  Linkedin, Twitter, Instagram, ArrowRight, Award, 
  MapPin, Briefcase, GraduationCap, TrendingUp, ShieldCheck 
} from 'lucide-react';

export default function PortfolioPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').single();
      if (data?.content?.profile) {
        setProfile(data.content.profile);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
      <div className="w-12 h-12 border-t-2 border-primary-500 rounded-full animate-spin" />
    </div>
  );

  if (!profile) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass border border-[var(--glass-border)] mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)]">Exclusive Assets Group</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold text-[var(--text-main)] leading-[1.1] mb-6">
                {profile.name.split(' ')[0]} <br />
                <span className="gradient-text">{profile.name.split(' ').slice(1).join(' ')}</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-[var(--text-muted)] font-light max-w-xl mb-10 leading-relaxed italic">
                "{profile.title}"
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <a href="#milestones" className="btn-premium px-8 py-4">Explore Legacy</a>
                <div className="flex items-center space-x-6 px-6">
                  {profile.socials.linkedin && (
                    <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary-500 transition-colors">
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {profile.socials.twitter && (
                    <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary-500 transition-colors">
                      <Twitter className="w-6 h-6" />
                    </a>
                  )}
                  {profile.socials.instagram && (
                    <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary-500 transition-colors">
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden premium-card-border relative z-10">
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-transparent opacity-60" />
              </div>
              {/* Background Accents */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 blur-3xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary-500/5 blur-3xl rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS BENTO */}
      <section className="py-20 bg-[var(--bg-secondary)]/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl border border-[var(--glass-border)] flex flex-col justify-between h-full group hover:border-primary-500/50 transition-colors"
              >
                <TrendingUp className="w-8 h-8 text-primary-500 mb-6 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-4xl font-display font-bold text-[var(--text-main)] mb-2">{stat.value}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--text-muted)]">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BIOGRAPHY SECTION */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-main)]">
                Strategic <span className="text-primary-500">Excellence</span> <br />in Every Acquisition.
              </h2>
              <p className="text-xl text-[var(--text-muted)] leading-relaxed font-light">
                {profile.bio}
              </p>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)]">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="aspect-square bg-primary-500/5 rounded-3xl flex items-center justify-center border border-primary-500/10">
                <ShieldCheck className="w-16 h-16 text-primary-500 opacity-20" />
              </div>
              <div className="aspect-square bg-primary-500/5 rounded-3xl mt-12 flex items-center justify-center border border-primary-500/10">
                <Award className="w-16 h-16 text-primary-500 opacity-20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MILESTONES TIMELINE */}
      <section id="milestones" className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-display font-bold text-[var(--text-main)] mb-4">Professional Timeline</h2>
            <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full" />
          </motion.div>

          <div className="space-y-12 relative before:absolute before:left-0 md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-primary-500/20">
            {profile.milestones.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col md:flex-row gap-8 relative items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 w-full">
                  <div className="glass p-8 rounded-3xl border border-[var(--glass-border)] relative group hover:border-primary-500/50 transition-colors">
                    <span className="text-primary-500 font-display font-bold text-lg mb-2 block">{m.year}</span>
                    <h3 className="text-xl font-bold text-[var(--text-main)] mb-1">{m.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-gold)] font-bold mb-4">{m.company}</p>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{m.description}</p>
                  </div>
                </div>
                <div className="absolute left-[-5px] md:left-1/2 md:translate-x-[-50%] w-3 h-3 rounded-full bg-primary-500 shadow-[0_0_15px_rgba(var(--primary-500-rgb),0.5)] z-10" />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-light p-16 rounded-[3rem] border border-white/20 shadow-4xl relative overflow-hidden"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-[var(--bg-main)] dark:text-white mb-8">
              Let's Secure Your <br /><span className="text-primary-600">Investment Legacy</span>.
            </h2>
            <p className="text-[var(--text-main)] opacity-70 mb-10 max-w-xl mx-auto font-medium">
              Available for private consultations and portfolio management strategies across Dubai's most prestigious developments.
            </p>
            <a href="mailto:info@ahmedkapadia.com" className="btn-premium px-12 py-5 text-sm tracking-[0.2em]">Initiate Correspondence</a>
            
            {/* Visual Accents */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-500/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-500/10 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
