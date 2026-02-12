'use client';

import React from 'react';

export default function BrandLogo({ className = '', size = 'md', variant = 'auto' }) {
  const sizeClasses = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-24'
  };

  const logoUrl = "https://uykgpmgcayncaddtsspu.supabase.co/storage/v1/object/public/media/1770897883828-c9o4uj39666.webp";

  // Control visibility based on background/theme context
  const filterClass = 
    variant === 'dark' ? 'brightness-90 contrast-125 saturate-110 grayscale-0' : 
    variant === 'light' ? 'brightness-125 contrast-100 saturate-100' :
    'brightness-110';

  return (
    <div className={`relative flex items-center ${className}`}>
      <img 
        src={logoUrl} 
        alt="Ahmed Kapadia Logo" 
        className={`${sizeClasses[size] || sizeClasses.md} w-auto object-contain transition-all duration-300 ${filterClass}`}
      />
    </div>
  );
}
