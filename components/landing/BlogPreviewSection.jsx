'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { formatDate, calculateReadTime } from '@/lib/utils';

export default function BlogPreviewSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) setBlogs(data);
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  if (loading || blogs.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-[var(--bg-main)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-xl">
            <div className="flex items-center space-x-4 mb-6">
              <span className="h-[1px] w-10 bg-primary-500" />
              <span className="text-primary-600 font-bold tracking-[0.4em] text-[10px] uppercase block">Market Intelligence</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-main)] leading-tight tracking-tighter">
              BEYOND THE <br />
              <span className="gradient-text">HORIZON</span>
            </h2>
          </div>
          <Link 
            href="/blog" 
            className="group flex items-center space-x-4 text-[var(--text-main)] font-bold tracking-[0.3em] text-[10px] py-4 px-10 glass rounded-2xl border-white/10 hover:border-primary-500 hover:bg-primary-500/5 transition-all"
          >
            <span>VIEW ALL INSIGHTS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-primary-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ blog, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative glass rounded-[2.5rem] overflow-hidden border-[var(--glass-border)] premium-card-border bg-[var(--bg-secondary)] hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 aspect-[4/5] cursor-pointer"
    >
      <Link href={`/blog/${blog.slug}`} className="block h-full w-full">
        {/* Base Image */}
        <div className="relative h-full w-full">
          <img 
            src={blog.featured_image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800'} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-10 flex flex-col justify-end transition-opacity duration-500 group-hover:opacity-0">
             <div className="space-y-4">
                <div className="flex items-center space-x-4 text-[9px] uppercase tracking-widest text-primary-400 font-bold">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-2" /> {formatDate(blog.created_at)}</span>
                </div>
                <h3 className="text-2xl font-display font-bold !text-white leading-tight line-clamp-2 drop-shadow-lg">
                  {blog.title}
                </h3>
             </div>
          </div>
        </div>

        {/* SLIDING OVERLAY (From Top to Bottom) */}
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: isHovered ? '0%' : '-100%' }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 glass backdrop-blur-xl z-10 flex flex-col p-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-full flex flex-col"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest block mb-1">MARKET REPORT</p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{formatDate(blog.created_at)}</p>
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-bold text-[var(--text-main)] mb-6 leading-tight tracking-tight">
              {blog.title}
            </h3>

            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-auto line-clamp-4">
              {blog.excerpt || 'Exclusive insights into the Dubai luxury real estate market and investment opportunities.'}
            </p>

            <div className="pt-8 mt-auto premium-border-t flex items-center justify-between">
              <span className="flex items-center text-[10px] font-bold text-primary-600 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 mr-2" /> {calculateReadTime(blog.content)}
              </span>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-white bg-primary-600 py-3 px-6 rounded-xl shadow-lg shadow-primary-500/20 group/btn hover:bg-primary-700 transition-colors">
                <span>READ REPORT</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
