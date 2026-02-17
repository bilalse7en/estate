import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient = null;

export const createClient = () => {
  if (typeof window === 'undefined') {
    return createBrowserClient(supabaseUrl, supabaseKey);
  }

  if (!browserClient) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are required. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
    browserClient = createBrowserClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        // Kept memory locking to solve AbortError
        lockType: 'memory'
      }
    });
  }
  
  return browserClient;
};

// Singleton instance for general use
export const supabase = (() => {
  if (typeof window === 'undefined') return null;
  return createClient();
})();
