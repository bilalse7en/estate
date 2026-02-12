'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function LandingLoader() {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
      }}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[var(--bg-main)]"
    >
      <div className="relative flex flex-col items-center">
        {/* LOGO ANIMATION */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="mb-8"
        >
          <BrandLogo size="xl" variant={theme === 'light' ? 'dark' : 'light'} />
        </motion.div>

        {/* PREMIUM PROGRESS BAR */}
        <div className="w-40 h-[2px] bg-[var(--border-subtle)] rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 bottom-0 w-2/3 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
          />
        </div>

        {/* SUBTLE TEXT */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-6 text-[10px] uppercase tracking-[0.4em] font-medium text-[var(--text-main)]"
        >
          Securing Your Legacy
        </motion.p>
      </div>

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full" />
      </div>
    </motion.div>
  );
}
