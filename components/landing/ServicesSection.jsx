'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { Home, LineChart, ShieldCheck, Briefcase, Globe, Zap, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const services = [
  {
    title: 'Investment Advisory',
    description: 'Data-driven insights to maximize your portfolio growth in the UAE market.',
    icon: LineChart,
  },
  {
    title: 'Property Acquisition',
    description: 'Exclusive access to off-market properties and early developer releases.',
    icon: Home,
  },
  {
    title: 'Portfolio Management',
    description: 'End-to-end management services for domestic and international investors.',
    icon: ShieldCheck,
  },
  {
    title: 'Corporate Services',
    description: 'Strategic real estate solutions for businesses and institutional entities.',
    icon: Briefcase,
  },
];

export default function ServicesSection() {
  const [header, setHeader] = useState({
    title: "BEYOND THE CONVENTIONAL",
    subtitle: "We define a new standard in real estate consulting, where every detail is managed with surgical precision."
  });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [hoveredStatIndex, setHoveredStatIndex] = useState(null);

  useEffect(() => {
    async function fetchHeader() {
      try {
        if (!supabase) return;
        const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').single();
        if (data?.content?.services) {
          setHeader({
            ...data.content.services,
            title: "BEYOND THE CONVENTIONAL"
          });
        }
      } catch (error) {
        // Silently use default values
      }
    }
    fetchHeader();
  }, []);

  const statsData = [
    { label: "Market Access", value: "Unlimited", icon: <Globe className="w-5 h-5" /> },
    { label: "Client Satisfaction", value: "100", suffix: "%", icon: <Zap className="w-5 h-5" /> },
    { label: "Asset Valuation", value: "2", prefix: "$", suffix: "B+", icon: <LineChart className="w-5 h-5" /> },
    { label: "Acquisition Time", value: "10", suffix: " Days", icon: <Sparkles className="w-5 h-5" /> }
  ];

  return (
    <section id="services" className="relative py-20 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary-600) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
          <div className="lg:w-1/2">
            <div className="flex items-center space-x-4 mb-8">
              <span className="h-[1px] w-10 bg-primary-500" />
              <span className="text-primary-600 font-bold tracking-wider text-[10px] uppercase block">Elite Services</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-main)] mb-8 tracking-tighter leading-tight">
              BEYOND THE <br />
              <span className="gradient-text">CONVENTIONAL</span>
            </h2>
            <p className="text-base text-[var(--text-muted)] leading-relaxed mb-12 max-w-lg">
              {header.subtitle}
            </p>
            
            <div className="flex items-center space-x-6 p-6 glass rounded-2xl inline-flex border-[var(--glass-border)]">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-secondary)] bg-gray-200 overflow-hidden shadow-xl">
                    <img src={`https://i.pravatar.cc/150?u=${i+40}`} alt="client" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="h-8 w-px bg-[var(--glass-border)]" />
              <div>
                <div className="flex items-center text-primary-500 text-[10px] mb-1">
                  {[1,2,3,4,5].map(i => <Sparkles key={i} className="w-3 h-3 fill-current mx-0.5" />)}
                </div>
                <p className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-[0.2em]">Private Client Verified</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                animate={{
                  scale: hoveredIndex === null ? 1 : hoveredIndex === index ? 1.05 : 0.95,
                  opacity: hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.4,
                  filter: hoveredIndex === null ? 'grayscale(0%)' : hoveredIndex === index ? 'grayscale(0%) brightness(1.1)' : 'grayscale(50%) blur(1.5px)',
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="glass p-10 rounded-[2.5rem] group border border-[var(--glass-border)] premium-card-border cursor-pointer flex flex-col items-center text-center h-full hover:shadow-2xl hover:shadow-primary-500/10"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-600 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary-500/30">
                  <service.icon className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold text-[var(--text-main)] mb-4 tracking-tight">{service.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Stats Cards Grid with Focus Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pt-24 premium-border-t">
          {statsData.map((stat, i) => (
            <StatCard 
              key={i}
              {...stat}
              delay={0.1 * (i + 1)}
              isHovered={hoveredStatIndex === i}
              isAnyHovered={hoveredStatIndex !== null}
              onHover={() => setHoveredStatIndex(i)}
              onLeave={() => setHoveredStatIndex(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, prefix = "", suffix = "", icon, delay = 0, isHovered, isAnyHovered, onHover, onLeave }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  
  const isNumeric = !isNaN(value);
  const [displayValue, setDisplayValue] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (isInView && isNumeric) {
      let start = 0;
      const end = parseInt(value);
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentValue = Math.floor(easeProgress * end);
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else if (!isInView && isNumeric) {
      setDisplayValue(0);
    }
  }, [isInView, value, isNumeric]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      animate={{
        scale: !isAnyHovered ? 1 : isHovered ? 1.05 : 0.95,
        opacity: !isAnyHovered ? 1 : isHovered ? 1 : 0.4,
        filter: !isAnyHovered ? 'grayscale(0%)' : isHovered ? 'grayscale(0%) brightness(1.1)' : 'grayscale(50%) blur(1.5px)',
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative p-7 glass rounded-[2rem] border border-[var(--glass-border)] premium-card-border bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 flex flex-col justify-between min-h-[160px] cursor-pointer"
    >
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 group-hover:text-primary-600 transition-all duration-700">
        {icon}
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-baseline space-x-0.5">
          <span className="text-4xl md:text-5xl font-display font-bold text-[var(--text-main)] tracking-tighter group-hover:text-primary-600 transition-colors">
            {prefix}{displayValue}{suffix}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-[2px] w-4 bg-primary-500/40 group-hover:w-8 group-hover:bg-primary-500 transition-all duration-500 shrink-0" />
          <p className="text-[10px] md:text-[11px] uppercase tracking-wider text-primary-500 font-bold leading-tight">
            {label}
          </p>
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.div>
  );
}
