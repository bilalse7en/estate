'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        // Use a more resilient session check first
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        
        if (!mounted) return;
        setUser(currentUser);
        
        if (currentUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, name')
            .eq('id', currentUser.id)
            .maybeSingle();
          
          if (!mounted) return;
          setIsAdmin(profile?.role === 'admin');
          setUserName(profile?.name || currentUser.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        const isAbort = error.name === 'AbortError' || error.message?.includes('AbortError') || error.message?.includes('aborted');
        if (mounted && !isAbort) {
          console.error('AuthProvider checkUser error:', error);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setUserName('');
        setLoading(false);
        router.push('/');
        router.refresh();
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setUser(currentUser);
        if (currentUser) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role, name')
              .eq('id', currentUser.id)
              .maybeSingle();
            
            if (!mounted) return;
            setIsAdmin(profile?.role === 'admin');
            setUserName(profile?.name || currentUser.email?.split('@')[0] || 'User');
          } catch (error) {
            if (mounted && error.name !== 'AbortError') {
              console.error('AuthProvider onAuthStateChange profile error:', error);
            }
          }
        }
        setLoading(false);
        if (event === 'SIGNED_IN') router.refresh();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      // Reset local state just in case
      setUser(null);
      setIsAdmin(false);
      setUserName('');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, userName, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
