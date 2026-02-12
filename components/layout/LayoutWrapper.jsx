'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import LandingLoader from '@/components/ui/LandingLoader';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Premium entry timing
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LandingLoader key="loader" />}
      </AnimatePresence>
      
      {!loading && (
        <>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </>
      )}
    </>
  );
}
