'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Moon, Sun, User, ChevronDown, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useTheme } from '@/components/theme/ThemeProvider';

export default function AdminHeader() {
  const { user, userName, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-30 transition-all duration-500 px-6 ${
      isScrolled 
        ? `py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/80 backdrop-blur-md shadow-sm` 
        : `py-4 bg-transparent border-transparent`
    }`}>
      <div className="flex items-center justify-end space-x-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-main)] transition-all hover:bg-[var(--hover-bg)] focus-ring shadow-sm"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:bg-[var(--hover-bg)] transition-all focus-ring shadow-sm"
          >
            <div className="w-6 h-6 rounded bg-primary-500/10 flex items-center justify-center">
              <User className="w-3 h-3 text-[var(--color-gold)]" />
            </div>
            <ChevronDown className={`w-3 h-3 transition-transform ${userDropdownOpen ? 'rotate-180' : ''} text-[var(--text-muted)]`} />
          </button>

          <AnimatePresence>
            {userDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute right-0 mt-2 w-64 p-2 rounded-xl shadow-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] z-50"
              >
                {/* User Info */}
                <div className="px-3 py-3 border-b border-[var(--border-subtle)] mb-1">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-1">Admin Account</p>
                  <p className="text-sm font-bold text-[var(--text-main)] leading-none">{userName}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 truncate">{user?.email}</p>
                </div>

                {/* Back to Site */}
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition-all mb-0.5 group text-[var(--text-main)]"
                >
                  <span className="text-xs font-semibold group-hover:text-[var(--color-gold)] transition-colors">← Back to Site</span>
                </Link>

                {/* Sign Out */}
                <button 
                  onClick={signOut}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all group"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-semibold text-red-500 group-hover:text-red-600 transition-colors">Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
