'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Menu, X, Sun, Moon, LogIn, LogOut, User, 
  ShieldCheck, LayoutDashboard, Settings, ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTheme } from '@/components/theme/ThemeProvider';

export default function Navbar() {
  const { user, userName, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Portfolio', href: '/#portfolio' },
    { name: 'Services', href: '/#services' },
    { name: 'Insights', href: '/blog' },
    { name: 'Inquiry', href: '/submit-form' },
  ];

  // Ensure text is ALWAYS white on hero (since it has dark slides)
  // When scrolled, we force dark text to contrast with the glass-light (white) background
  const navTextColorClass = isScrolled 
    ? 'text-gray-900' 
    : 'text-white';

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-4 glass-light mx-4 mt-4 rounded-2xl shadow-2xl border border-[var(--glass-border)]' 
          : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="group flex flex-col">
          <span className={`text-xl sm:text-2xl font-display font-bold tracking-tighter ${navTextColorClass} transition-colors`}>
            AHMED <span className="gradient-text">KAPADIA</span>
          </span>
          <span className="text-[8px] uppercase tracking-[0.6em] font-bold text-primary-500 opacity-80 group-hover:opacity-100 transition-opacity">
            Private Office
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] ${navTextColorClass} hover:text-primary-500 transition-colors cursor-pointer`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className={`h-4 w-px ${theme === 'light' ? 'bg-[var(--glass-border)]' : 'bg-white/10'} mx-2`} />

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all active:scale-90 shadow-md ${
              isScrolled
                ? 'bg-gray-100 border border-black/5 text-gray-900'
                : theme === 'light'
                ? 'bg-white/80 border border-[var(--glass-border)] text-gray-900 backdrop-blur-sm'
                : 'bg-white/10 border border-white/20 text-white backdrop-blur-sm'
            } hover:bg-primary-500/10 hover:border-primary-500`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* User Section */}
          <div className="pl-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold border border-primary-500 shadow-xl shadow-primary-500/30 hover:bg-primary-700 transition-all duration-300 group"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                    <span className="text-[9px] tracking-[0.2em] uppercase whitespace-nowrap">Control Center</span>
                  </Link>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center space-x-3 px-3 py-1.5 rounded-xl transition-all border ${
                      isScrolled 
                        ? 'bg-gray-100/50 border-black/5 hover:bg-gray-200/50' 
                        : 'glass bg-white/10 border-white/10 hover:border-primary-500'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary-500" />
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform ${userDropdownOpen ? 'rotate-180' : ''} ${navTextColorClass}`} />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-72 glass p-3 rounded-2xl shadow-3xl border border-[var(--glass-border)] z-[110]"
                      >
                        {/* User Info Header */}
                        <div className="px-4 py-4 border-b border-[var(--glass-border)] mb-2">
                          <p className=" text-[9px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-bold mb-2">Authorized Account</p>
                          <p className="text-base font-display font-bold text-[var(--text-main)] mb-1">{userName}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                        </div>

                        {/* Admin Dashboard Link (Only for Admins) */}
                        {isAdmin && (
                          <Link 
                            href="/admin" 
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-500/10 transition-all mb-1 group"
                          >
                            <ShieldCheck className="w-4 h-4 text-primary-500 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-semibold text-[var(--text-main)] group-hover:text-primary-600">Admin Dashboard</span>
                          </Link>
                        )}

                        {/* My Inquiries */}
                        <Link 
                          href="/submit-form" 
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-500/10 transition-all group"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[var(--text-muted)] group-hover:text-primary-500" />
                          <span className="text-sm font-medium text-[var(--text-main)] group-hover:text-primary-500">My Inquiries</span>
                        </Link>

                        {/* Sign Out */}
                        <button 
                          onClick={signOut}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all mt-1 group"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-500 group-hover:text-red-600">Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="btn-premium px-8 !py-3 text-[10px]"
              >
                CLIENT LOGIN
              </Link>
            )}
          </div>
        </div>

        <div className="flex lg:hidden items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] hover:bg-primary-500/10 ${navTextColorClass} shadow-md`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 ${navTextColorClass}`}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-y-0 right-0 w-80 glass border-l border-[var(--glass-border)] z-[110] p-10 flex flex-col pt-32 shadow-3xl"
          >
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-10 right-10 text-[var(--text-main)]"><X className="w-8 h-8" /></button>
            <div className="space-y-8 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-display font-medium text-[var(--text-main)] hover:text-primary-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px w-full bg-[var(--glass-border)] !my-10" />
              {user ? (
                <>
                  <div className="mb-6">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Email Account</p>
                    <p className="text-sm font-bold text-[var(--text-main)] truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-premium w-full text-center py-4 text-xs tracking-[0.2em]"
                    >
                      CONTROL CENTER
                    </Link>
                  )}
                  <button 
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="text-red-500 font-bold uppercase tracking-widest text-xs mt-6 hover:text-red-600 transition-colors"
                  >
                    Disconnect Session
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-premium w-full text-center py-5"
                >
                  CLIENT LOGIN
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
