'use client';

import AdminCard from '@/components/admin/AdminCard';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Layout, User, Building2, Award, Briefcase, Mail, Edit, Loader2, CheckCircle, Palette } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const sections = [
    { 
      id: 'theme', 
      title: 'Frontend Theme', 
      description: 'Customize colors, borders, and visual appearance.', 
      icon: Palette,
      path: '/admin/settings/theme'
    },
    { 
      id: 'hero', 
      title: 'Hero Showcase', 
      description: 'Manage main landing page slides and visual impact.', 
      icon: Layout,
      path: '/admin/settings/hero'
    },
    { 
      id: 'about', 
      title: 'Executive Biography', 
      description: 'Historical context and strategic depth overview.', 
      icon: User,
      path: '/admin/settings/about'
    },
    { 
      id: 'portfolio', 
      title: 'Portfolio Showcase', 
      description: 'Configure the narrative for featured property assets.', 
      icon: Building2,
      path: '/admin/settings/portfolio'
    },
    { 
      id: 'profile', 
      title: 'Professional Profile', 
      description: 'Master record of achievements, stats, and milestones.', 
      icon: Award,
      path: '/admin/settings/profile'
    },
    { 
      id: 'services', 
      title: 'Service Philosophy', 
      description: 'Define the surgical precision of your consulting services.', 
      icon: Briefcase,
      path: '/admin/settings/services'
    },
    { 
      id: 'contact', 
      title: 'Contact Information', 
      description: 'Global headquarters and correspondence channels.', 
      icon: Mail,
      path: '/admin/settings/contact'
    }
  ];

  useEffect(() => {
    // Just a small delay to simulate loading for UX consistency
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--text-main)] mb-1">Corporate System</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">CMS Master Terminal</p>
        </div>
      </div>

      <AdminCard 
        title="Configuration Modules"
        className="overflow-hidden"
      >
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Accessing Core Settings</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 -mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)]/50 border-b border-[var(--border-subtle)]">
                  <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] w-12">Component</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Configuration Target</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                  <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {sections.map((section) => (
                  <tr key={section.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--color-gold)] border border-[var(--border-subtle)] group-hover:border-[var(--color-gold)]/30 transition-all">
                        <section.icon className="w-5 h-5" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-bold text-[var(--text-main)] mb-0.5">{section.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)] max-w-md line-clamp-1">{section.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
                        <CheckCircle className="w-2.5 h-2.5 mr-1" />
                        Operational
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={section.path}
                        className="btn-premium inline-flex items-center space-x-2 py-1.5 px-4"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Configure</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminCard title="System Intelligence">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            All system configurations are synchronized in real-time with the master database. Changes committed here will be reflected across the entire enterprise platform instantly.
          </p>
        </AdminCard>
        <AdminCard title="Security Protocol">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Authorized access only. Every modification is logged with executive precision to maintain the integrity of the Ahmed Kapadia digital legacy.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
