import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    if (typeof window === 'undefined') {
      console.warn('Supabase credentials missing during server-side execution.');
      return null;
    }
    throw new Error('Supabase credentials are required. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
};

// Default export for backward compatibility with a safe initialization
export const supabase = (() => {
  try {
    if (!supabaseUrl || !supabaseKey) return null;
    
    // Basic validation to ensure it's not a Stripe key (very common mistake)
    if (supabaseKey.startsWith('sb_publishable_') || supabaseKey.startsWith('pk_')) {
      console.warn('Supabase: Detected a Stripe key instead of a Supabase key. Please check your .env.local');
      return null;
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Supabase client initialization failed:', error.message);
    return null;
  }
})();
