'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Menu, X, Sun, Moon, LogIn, LogOut, User, 
  ShieldCheck, LayoutDashboard, Settings, ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTheme } from '@/components/theme/ThemeProvider';
import BrandLogo from '@/components/ui/BrandLogo';

export default function Navbar() {
  const { user, userName, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Check if we are on the landing page
  const isLandingPage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on pathname change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const navLinks = [
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Services', href: '/#services' },
    { name: 'Insights', href: '/blog' },
    { name: 'Inquiry', href: '/submit-form' },
  ];

  // Logic for Dynamic Background and Text Colors
  // On landing page: starts transparent with white text, becomes glass with theme-aware text
  // On other pages: starts with more opacity/glass and theme-aware text immediately
  
  // Desktop navbar background (with margins and rounded corners)
  const desktopNavBgClass = isLandingPage 
    ? (isScrolled ? 'glass mx-4 mt-4 rounded-2xl shadow-2xl border border-[var(--glass-border)]' : 'bg-transparent')
    : ('glass mx-4 mt-4 rounded-2xl border border-[var(--glass-border)] shadow-xl');
  
  // Mobile navbar background (NO margins, full width, theme-aware glass)
  const mobileNavBgClass = isLandingPage
    ? (isScrolled ? 'glass shadow-xl' : 'bg-transparent')
    : 'glass shadow-xl';

  const navTextColorClass = (isLandingPage && !isScrolled)
    ? 'text-white' // Landing page hero is dark, so white text looks great
    : (theme === 'light' ? 'text-gray-950 font-bold' : 'text-white font-medium');

  const logoVariant = (isLandingPage && !isScrolled)
    ? 'light'
    : (theme === 'light' ? 'dark' : 'light');

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${mobileNavBgClass} md:${desktopNavBgClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 flex justify-between items-center min-h-[72px]">
        {/* LOGO */}
        <Link href="/" className="group flex items-center shrink-0">
          <BrandLogo 
            size="md" 
            className="md:scale-100 scale-90 transition-transform" 
            variant={logoVariant} 
          />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[10px] font-bold uppercase tracking-[0.25em] ${navTextColorClass} hover:text-primary-500 transition-all cursor-pointer relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-primary-500 after:transition-all hover:after:w-full`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className={`h-4 w-px ${theme === 'light' ? 'bg-black/10' : 'bg-white/10'} mx-2`} />

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all active:scale-95 shadow-lg border border-[var(--glass-border)] ${
              theme === 'light' 
                ? 'bg-white text-gray-900 shadow-gray-200/50' 
                : 'bg-white/5 text-white backdrop-blur-md shadow-black/20'
            } hover:border-primary-500 hover:text-primary-500`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* User Section */}
          <div className="pl-4">
            {user ? (
              <div className="relative user-dropdown-container">
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center space-x-3 px-3 py-1.5 rounded-xl transition-all ${theme === 'dark' ? 'gradient-border-brown' : 'border border-[var(--glass-border)]'} ${
                    theme === 'light' 
                      ? 'bg-gray-100/80 hover:bg-white' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {user.user_metadata?.avatar_url ? (
                    <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-primary-500/30 ring-2 ring-primary-500/10">
                      <Image 
                        src={user.user_metadata.avatar_url} 
                        alt={userName || 'User'}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-500" />
                    </div>
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${userDropdownOpen ? 'rotate-180' : ''} ${navTextColorClass}`} />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 mt-3 w-72 glass p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] ${theme === 'dark' ? 'gradient-border-brown' : 'border border-[var(--glass-border)]'} z-[110]`}
                    >
                      <div className="px-4 py-4 border-b border-[var(--glass-border)] mb-2">
                        <p className="text-[9px] text-primary-500 uppercase tracking-[0.3em] font-bold mb-2">Private Access</p>
                        <p className="text-sm font-display font-bold text-[var(--text-main)] mb-1 truncate">{userName}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate opacity-70">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link 
                          href="/admin" 
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-500/10 transition-all mb-1 group"
                        >
                          <ShieldCheck className="w-4 h-4 text-primary-500 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">Control Center</span>
                        </Link>
                      )}

                      <Link 
                        href="/submit-form" 
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary-500/10 transition-all group"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[var(--text-muted)] group-hover:text-primary-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">My Inquiries</span>
                      </Link>

                      <button 
                        onClick={signOut}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all mt-1 group"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-red-500">Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="btn-premium px-8 !py-3.5 text-[9px] shadow-primary-500/20"
              >
                CLIENT LOGIN
              </Link>
            )}
          </div>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex lg:hidden items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className={`p-2.5 rounded-2xl border border-[var(--glass-border)] transition-all active:scale-95 shadow-md ${
              theme === 'light' ? 'bg-white text-gray-900' : 'bg-white/5 text-white'
            }`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 transition-all active:scale-90 ${navTextColorClass}`}
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* MOBILE FULLSCREEN MENU - COMPACT & PROFESSIONAL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] flex flex-col"
          >
            {/* Premium Glass Backdrop with Blur */}
            <div className="absolute inset-0 glass backdrop-blur-3xl z-0 border-r-4 border-primary-500/10" />
            
            {/* Scrollable Content Container - Full Height */}
            <div className="relative z-10 flex flex-col h-full min-h-screen overflow-y-auto">
              {/* Header with Logo and Close Button */}
              <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0">
                <BrandLogo size="sm" variant={theme === 'light' ? 'dark' : 'light'} />
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2.5 glass rounded-xl border border-[var(--glass-border)] transition-all active:scale-90"
                >
                  <X className="w-6 h-6 text-[var(--text-main)]" />
                </button>
              </div>

              {/* Main Menu Content */}
              <div className="flex flex-col px-6 pb-6 space-y-6 flex-1 justify-between">
                {/* Navigation Links - Compact */}
                <div className="space-y-3 pt-4">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-2xl font-display font-bold text-[var(--text-main)] hover:text-primary-500 transition-colors py-2"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-primary-500/20" />

                {/* User Section - Compact */}
                {user ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    {/* Profile Card - Compact */}
                    <div className="glass p-4 rounded-2xl gradient-border-brown">
                      <div className="flex items-center gap-3">
                        {user.user_metadata?.avatar_url ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary-500/30 ring-2 ring-primary-500/10 flex-shrink-0">
                            <Image 
                              src={user.user_metadata.avatar_url} 
                              alt={userName || 'User'}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center border-2 border-primary-500/30 flex-shrink-0">
                            <User className="w-6 h-6 text-primary-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] text-primary-500 uppercase tracking-[0.3em] font-bold mb-0.5">Account</p>
                          <p className="text-sm font-display font-bold text-[var(--text-main)] truncate">{userName}</p>
                          <p className="text-[9px] text-[var(--text-muted)] opacity-70 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Compact */}
                    <div className="space-y-2">
                      {isAdmin && (
                        <Link 
                          href="/admin" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="btn-premium w-full py-3 text-[10px] font-bold tracking-[0.25em] flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          CONTROL CENTER
                        </Link>
                      )}
                      
                      <Link 
                        href="/submit-form" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="glass w-full py-3 rounded-xl border border-[var(--glass-border)] text-[10px] font-bold text-[var(--text-main)] tracking-[0.25em] hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        MY INQUIRIES
                      </Link>
                      
                      <button 
                        onClick={() => { signOut(); setMobileMenuOpen(false); }}
                        className="w-full py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 font-bold uppercase tracking-[0.25em] text-[10px] hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        SIGN OUT
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-premium w-full py-4 text-[10px] font-bold tracking-[0.3em]"
                    >
                      CLIENT LOGIN
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
