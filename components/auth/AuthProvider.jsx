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
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    const checkUser = async () => {
      try {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user ?? null);
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, name')
            .eq('id', user.id)
            .single();
          
          setIsAdmin(profile?.role === 'admin');
          setUserName(profile?.name || user.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('AuthProvider checkUser error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for changes on auth state (sign in, sign out, etc.)
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setUserName('');
        setLoading(false);
        router.push('/');
        router.refresh();
        return;
      }

      setUser(currentUser);
      
      if (currentUser) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, name')
            .eq('id', currentUser.id)
            .maybeSingle();
          
          setIsAdmin(profile?.role === 'admin');
          setUserName(profile?.name || currentUser.email?.split('@')[0] || 'User');
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('AuthProvider onAuthStateChange profile error:', error);
          }
        }
      } else {
        setIsAdmin(false);
        setUserName('');
      }
      
      setLoading(false);
      
      if (event === 'SIGNED_IN') {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
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
