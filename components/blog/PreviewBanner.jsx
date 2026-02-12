'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PreviewBanner() {
  const router = useRouter();

  const exitPreview = () => {
    // Remove preview params from URL
    router.push(window.location.pathname);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <p className="font-semibold text-sm md:text-base">
            Preview Mode - This blog post is not published yet
          </p>
        </div>
        
        <button
          onClick={exitPreview}
          className="flex items-center space-x-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 text-sm font-medium"
          aria-label="Exit preview mode"
        >
          <span className="hidden sm:inline">Exit Preview</span>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
