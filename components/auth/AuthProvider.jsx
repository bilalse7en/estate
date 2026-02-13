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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, name')
            .eq('id', currentUser.id)
            .single();
          
          setIsAdmin(profile?.role === 'admin');
          setUserName(profile?.name || currentUser.email?.split('@')[0] || 'User');
        } catch (error) {
          console.error('AuthProvider onAuthStateChange profile error:', error);
        }
      } else {
        setIsAdmin(false);
        setUserName('');
      }
      
      setLoading(false);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, userName, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
