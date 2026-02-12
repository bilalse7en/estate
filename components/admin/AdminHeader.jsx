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

  return (
    <header className="sticky top-0 z-30 glass border-b border-[var(--glass-border)] px-8 py-4">
      <div className="flex items-center justify-end space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] hover:bg-primary-500/10 hover:border-primary-500/30 text-[var(--text-main)] transition-all active:scale-90 shadow-md"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-3 glass px-3 py-1.5 rounded-xl border border-[var(--glass-border)] hover:border-primary-500 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary-500" />
            </div>
            <ChevronDown className={`w-3 h-3 transition-transform ${userDropdownOpen ? 'rotate-180' : ''} text-[var(--text-main)]`} />
          </button>

          <AnimatePresence>
            {userDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-72 glass p-3 rounded-2xl shadow-3xl border border-[var(--glass-border)]"
              >
                {/* User Info */}
                <div className="px-4 py-4 border-b border-[var(--glass-border)] mb-2">
                  <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-bold mb-2">Admin Account</p>
                  <p className="text-base font-display font-bold text-[var(--text-main)] mb-1">{userName}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                </div>

                {/* Back to Site */}
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-500/10 transition-all mb-1 group"
                >
                  <span className="text-sm font-medium text-[var(--text-main)] group-hover:text-primary-500 transition-colors">← Back to Site</span>
                </Link>

                {/* Sign Out */}
                <button 
                  onClick={signOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all group"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500 group-hover:text-red-600 transition-colors">Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
