'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, MapPin, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useEffect } from 'react';

const initialProperties = [
  {
    title: 'Palm Jumeirah Villa',
    location: 'The Palm, Dubai',
    price: '$12.5M',
    type: 'Exclusive Villa',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Downtown Penthouse',
    location: 'Burj Khalifa District',
    price: '$8.2M',
    type: 'Luxury Penthouse',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Marina Luxury Suite',
    location: 'Dubai Marina',
    price: '$3.4M',
    type: 'Sky Suite',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  },
];

export default function PortfolioSection() {
  const [header, setHeader] = useState({
    title: "A LEGACY IN BRICK & MORTAR",
    subtitle: "Selected for architectural brilliance and investment potential in Dubai's most coveted areas."
  });

  useEffect(() => {
    async function fetchHeader() {
      const { data } = await supabase.from('site_settings').select('content').eq('id', 'homepage').single();
      if (data?.content?.portfolio) setHeader(data.content.portfolio);
    }
    fetchHeader();
  }, []);

  return (
    <section id="portfolio" className="relative py-24 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <span className="h-[1px] w-10 bg-primary-500" />
              <span className="text-primary-600 font-bold tracking-[0.4em] text-[10px] uppercase block">Curated Listings</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--text-main)] leading-tight tracking-tighter">
              {header.title.split(' ').slice(0, -2).join(' ')} <br />
              <span className="gradient-text">{header.title.split(' ').slice(-2).join(' ')}</span>
            </h2>
          </div>
          <p className="text-[var(--text-muted)] md:max-w-xs text-sm leading-relaxed md:text-right">
            {header.subtitle}
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {initialProperties.map((property, index) => (
            <PropertyCard key={index} property={property} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ property, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative rounded-[2.5rem] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--glass-border)] premium-card-border hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 aspect-[4/5] cursor-pointer"
    >
      {/* Base Image */}
      <img 
        src={property.image} 
        alt={property.title}
        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
      />

      {/* Static Info (Visible before hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />
      <div className="absolute bottom-8 left-8 right-8 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
        <div className="flex items-center space-x-2 !text-white/80 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{property.location}</span>
        </div>
        <h3 className="text-2xl font-display font-bold !text-white tracking-tight">{property.title}</h3>
      </div>

      {/* SLIDING OVERLAY (From Top to Bottom) */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: isHovered ? '0%' : '-100%' }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0 glass backdrop-blur-xl z-10 flex flex-col items-center justify-center p-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto shadow-2xl text-white shadow-primary-500/20">
            <Eye className="w-7 h-7" />
          </div>
          
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-primary-600 block mb-2">{property.type}</span>
            <h3 className="text-2xl font-display font-bold text-[var(--text-main)] mb-2 leading-tight">{property.title}</h3>
            <p className="text-[var(--text-muted)] text-sm flex items-center justify-center">
              <MapPin className="w-3 h-3 mr-2 text-primary-500" /> {property.location}
            </p>
          </div>

          <div className="pt-6 premium-border-t">
            <p className="text-3xl font-display font-bold text-primary-600 mb-1 tracking-tighter">{property.price}</p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">Estimated Valuation</p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-white bg-primary-600 py-3 px-6 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 group/btn">
            <span>VIEW ANALYSIS</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </div>
        </motion.div>
      </motion.div>

      {/* Static Tag (Always visible) */}
      <div className="absolute top-6 left-6 z-20">
        <span className="!bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold !text-white uppercase tracking-widest border border-white/10 group-hover:bg-white/20">
          {property.type}
        </span>
      </div>
    </motion.div>
  );
}
