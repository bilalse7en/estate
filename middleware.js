import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Basic validation to ensure it's not a Stripe key
  if (supabaseKey && (supabaseKey.startsWith('sb_publishable_') || supabaseKey.startsWith('pk_'))) {
    console.error('Middleware: Detected a Stripe key instead of a Supabase key');
    return supabaseResponse;
  }

  let supabase = null;
  try {
    supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });
  } catch (error) {
    console.error('Middleware: Supabase initialization failed:', error.message);
    return supabaseResponse;
  }

  if (!supabase) return supabaseResponse;

  // Get user info
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch (err) {
    console.error('Middleware Auth Error:', err.message);
  }

  // Protect /submit-form and /admin routes
  if (
    request.nextUrl.pathname.startsWith('/submit-form') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    if (!user) {
      const redirectUrl = new URL('/auth/signin', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Check admin access
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role !== 'admin') {
        const redirectUrl = new URL('/', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (err) {
      console.error('Middleware Profile Error:', err.message);
      const redirectUrl = new URL('/', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/submit-form', '/admin/:path*'],
};
