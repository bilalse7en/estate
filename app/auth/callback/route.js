import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Use the defined SITE_URL if available, otherwise fallback to request origin
        const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
        return NextResponse.redirect(`${redirectUrl}${next}`);
      }
      console.error('Auth callback exchange error:', error.message);
    }
  }

  // If we reach here, something went wrong
  const redirectBase = process.env.NEXT_PUBLIC_SITE_URL || origin;
  return NextResponse.redirect(`${redirectBase}/auth/signin?message=Authentication failed. Please try again.`);
}
