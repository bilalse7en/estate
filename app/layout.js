import { Syne, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

// Modern, bold font for headings - sophisticated and impactful
const syne = Syne({ 
  subsets: ['latin'], 
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

// Clean, elegant font for body text - highly readable
const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://ahmedkapadia.com'),
  title: {
    default: 'Ahmed Kapadia | Premium Dubai Real Estate Investment Consultant',
    template: '%s | Ahmed Kapadia Real Estate',
  },
  description: 'Expert real estate consulting and luxury property portfolio management in Dubai. Exclusive investment opportunities in Dubai\'s most prestigious locations with Ahmed Kapadia.',
  keywords: ['Dubai Real Estate', 'Luxury Property Dubai', 'Real Estate Investment', 'Ahmed Kapadia', 'Dubai Property Consultant', 'Premium Real Estate', 'Dubai Downtown Properties', 'Investment Portfolio Management'],
  authors: [{ name: 'Ahmed Kapadia' }],
  creator: 'Ahmed Kapadia',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ahmedkapadia.com',
    siteName: 'Ahmed Kapadia Real Estate',
    title: 'Ahmed Kapadia | Premium Dubai Real Estate',
    description: 'Expert real estate consulting and luxury property portfolio management in Dubai',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ahmed Kapadia Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahmed Kapadia | Premium Dubai Real Estate',
    description: 'Expert real estate consulting and luxury property portfolio management in Dubai',
    images: ['/og-image.jpg'],
    creator: '@ahmedkapadia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ahmed Kapadia Real Estate',
  url: 'https://ahmedkapadia.com',
  logo: 'https://uykgpmgcayncaddtsspu.supabase.co/storage/v1/object/public/media/1770897883828-c9o4uj39666.webp',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+971-00-000-0000',
    contactType: 'customer service',
    areaServed: 'AE',
    availableLanguage: ['en', 'ar'],
  },
  sameAs: [
    'https://twitter.com/ahmedkapadia',
    'https://linkedin.com/in/ahmedkapadia',
    'https://instagram.com/ahmedkapadia',
  ],
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ahmed Kapadia',
  jobTitle: 'Premium Real Estate Investment Consultant',
  description: 'Expert real estate consulting and luxury property portfolio management in Dubai.',
  url: 'https://ahmedkapadia.com',
  sameAs: [
    'https://linkedin.com/in/ahmedkapadia',
    'https://twitter.com/ahmedkapadia',
  ],
};

import { ToastProvider } from '@/components/ui/ToastProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen transition-colors duration-300" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
