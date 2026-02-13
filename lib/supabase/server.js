import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Supabase credentials missing. Deployment may fail if database access is required during build.');
  }
}

export async function createClient() {
  const cookieStore = await cookies();

  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Supabase: Credentials missing. Returning null client for safe build/execution.');
      return null;
    }
    throw new Error('Supabase credentials are required. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  // Basic validation to ensure it's not a Stripe key
  if (supabaseKey.startsWith('sb_publishable_') || supabaseKey.startsWith('pk_')) {
    console.error('Supabase: Detected a Stripe key instead of a Supabase key in NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return null;
  }

  try {
    return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
  } catch (error) {
    console.error('Supabase server-side initialization failed:', error.message);
    return null;
  }
}

// Removed legacy export that conflicted with @supabase/ssr import
