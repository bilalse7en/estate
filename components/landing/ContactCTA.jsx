'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function ContactCTA() {
  const currentYear = new Date().getFullYear();
  const [contact, setContact] = useState({
    phone: "+971 4 XXX XXXX",
    email: "info@ahmedkapadia.com",
    address: "Downtown Dubai, UAE"
  });

  useEffect(() => {
    async function fetchContact() {
      const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').single();
      if (data?.content?.contact) setContact(data.content.contact);
    }
    fetchContact();
  }, []);

  const counterRef = useRef(null);
  const isCounterInView = useInView(counterRef, { once: false, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isCounterInView) {
      let start = 0;
      const end = 100;
      const duration = 2000; // 2 seconds
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      const increment = end / totalFrames;
      
      let currentFrame = 0;
      const timer = setInterval(() => {
        currentFrame++;
        start += increment;
        if (currentFrame >= totalFrames) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, frameDuration);
      
      return () => clearInterval(timer);
    } else {
      setCount(0); // Reset when out of view
    }
  }, [isCounterInView]);

  return (
    <section id="contact" className="relative overflow-hidden py-32 bg-[var(--bg-main)]">
      {/* Visual Separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="relative overflow-hidden rounded-[3rem] glass p-10 md:p-24 shadow-2xl bg-[var(--bg-secondary)] premium-card-border border border-[var(--glass-border)] mx-auto">
          {/* Decorative Backdrops */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none -ml-48 -mb-48" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="text-left">
              <div className="flex items-center space-x-4 mb-8">
                <span className="h-[2px] w-10 bg-primary-500" />
                <span className="text-primary-600 font-bold tracking-wider text-[10px] uppercase block">Inquire Privately</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-main)] mb-10 leading-[1.1] tracking-tighter">
                SECURE <br />
                <span className="gradient-text">YOUR LEGACY</span>
              </h2>
              <p className="text-base text-[var(--text-muted)] mb-12 max-w-lg leading-relaxed">
                Experience the pinnacle of discretion and expertise. Our private office is open for a limited number of high-net-worth acquisitions this quarter.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  href="/submit-form" 
                  className="btn-premium group flex items-center justify-center space-x-3 px-12 !py-5 shadow-2xl scale-105 border-2 border-primary-400/20 hover:border-primary-400/40"
                >
                  <span className="tracking-[0.2em] text-[10px] font-bold">START ACQUISITION</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href={`mailto:${contact.email}`} 
                  className="btn-glass flex items-center justify-center space-x-3 font-bold tracking-[0.2em] text-[10px] px-10 py-5 border-2 hover:shadow-lg group/btn"
                >
                  <span className="group-hover/btn:text-primary-600 transition-colors">DIRECT OFFICE LINE</span>
                </a>
              </div>
            </div>

            <div className="hidden lg:block relative group">
              <div className="aspect-square rounded-[3rem] overflow-hidden rotate-2 group-hover:rotate-0 transition-all duration-1000 shadow-[0_50px_100px_-20px_rgba(184,115,51,0.2)] border-[12px] border-[var(--glass-border)] premium-card-border bg-[var(--bg-main)]">
                <img 
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1000" 
                  alt="Dubai Skyline" 
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
              {/* Floating Highlight Stat */}
              <motion.div 
                ref={counterRef}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-8 -left-8 glass p-8 px-10 rounded-[2.5rem] border border-[var(--glass-border)] premium-card-border shadow-3xl animate-float z-20 group hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500"
              >
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-display font-bold text-primary-600 transition-colors tracking-tighter">${count}</span>
                  <span className="text-4xl font-display font-bold text-primary-600 transition-colors tracking-tighter">M+</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold mt-1">Single Asset Record</p>
              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
