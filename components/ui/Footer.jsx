'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useTheme } from '@/components/theme/ThemeProvider';
import BrandLogo from '@/components/ui/BrandLogo';

export default function Footer() {
  const { theme } = useTheme();
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

  return (
    <footer className="relative mt-auto premium-border-t pt-20 pb-10 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-20">
          <div className="lg:col-span-2 space-y-10">
            <Link href="/" className="inline-block group">
              <div className="flex items-center space-x-3 mb-4">
                <BrandLogo size="lg" variant={theme === 'light' ? 'dark' : 'light'} />
                <div className="flex flex-col">
                  <span className="text-xl font-display font-bold text-[var(--text-main)] tracking-tight uppercase">
                    Ahmed <span className="gradient-text">Kapadia</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary-500/80">
                    Private Office
                  </span>
                </div>
              </div>
              <span className="block h-px w-0 group-hover:w-full bg-primary-500 transition-all duration-500" />
            </Link>
            <p className="text-[var(--text-muted)] leading-relaxed max-w-md text-sm">
              Premium real estate consulting and luxury property portfolio management in Dubai. Delivering excellence through integrity and market intelligence.
            </p>
            <div className="flex space-x-6">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:text-primary-600 hover:bg-primary-500/10 border-[var(--glass-border)] hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 active:scale-90">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-primary-500">Quick Portal</h4>
            <ul className="space-y-4 text-sm font-semibold text-[var(--text-muted)]">
              <li><Link href="/#portfolio" className="hover:text-primary-500 transition-all flex items-center group"><span className="w-0 group-hover:w-4 h-[1px] bg-primary-500 transition-all mr-0 group-hover:mr-2" />Portfolio</Link></li>
              <li><Link href="/#services" className="hover:text-primary-500 transition-all flex items-center group"><span className="w-0 group-hover:w-4 h-[1px] bg-primary-500 transition-all mr-0 group-hover:mr-2" />Services</Link></li>
              <li><Link href="/blog" className="hover:text-primary-500 transition-all flex items-center group"><span className="w-0 group-hover:w-4 h-[1px] bg-primary-500 transition-all mr-0 group-hover:mr-2" />Market Insights</Link></li>
              <li><Link href="/auth/signin" className="hover:text-primary-500 transition-all flex items-center group"><span className="w-0 group-hover:w-4 h-[1px] bg-primary-500 transition-all mr-0 group-hover:mr-2" />Client Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-primary-500">Dubai HQ</h4>
            <ul className="space-y-5 text-sm font-semibold text-[var(--text-muted)]">
              <li className="flex items-start space-x-4 group">
                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-primary-500 border border-[var(--glass-border)] group-hover:border-primary-500/50 group-hover:bg-primary-500/10 group-hover:text-primary-600 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all"><Phone className="w-3.5 h-3.5" /></div>
                <span className="pt-1.5 text-[var(--text-main)]">{contact.phone}</span>
              </li>
              <li className="flex items-start space-x-4 group">
                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-primary-500 border border-[var(--glass-border)] group-hover:border-primary-500/50 group-hover:bg-primary-500/10 group-hover:text-primary-600 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all"><Mail className="w-3.5 h-3.5" /></div>
                <span className="pt-1.5 text-[var(--text-main)]">{contact.email}</span>
              </li>
              <li className="flex items-start space-x-4 group">
                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-primary-500 border border-[var(--glass-border)] group-hover:border-primary-500/50 group-hover:bg-primary-500/10 group-hover:text-primary-600 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all"><MapPin className="w-3.5 h-3.5" /></div>
                <span className="pt-1.5 uppercase tracking-tighter text-[11px] leading-relaxed text-[var(--text-main)]">{contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 premium-border-t flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] uppercase text-[var(--text-muted)] font-bold">
            © {currentYear} Ahmed Kapadia. Exclusive Assets Group.
          </p>
          <div className="flex space-x-10 text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)]">
            <a href="#" className="hover:text-primary-500 transition-colors">Privacy Charter</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Terms of Engagement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
