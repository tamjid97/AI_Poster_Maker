'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import type { AuthUser, Profile, UserRole } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async (authUser: User): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }

    if (!data) {
      // Profile might not be created yet by trigger — create it manually
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: authUser.id, name: (authUser.user_metadata?.name as string) || '' })
        .select('*')
        .maybeSingle();

      if (insertError) {
        console.error('Error creating profile:', insertError.message);
        return null;
      }
      return newProfile as Profile;
    }

    return data as Profile;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    const profile = await fetchProfile(session.user);
    if (profile) {
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        name: profile.name,
        role: profile.role as UserRole,
      });
    }
  }, [session, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        const profile = await fetchProfile(currentSession.user);
        if (mounted && profile) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            name: profile.name,
            role: profile.role as UserRole,
          });
        }
      }

      setLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      (async () => {
        if (!mounted) return;
        setSession(newSession);

        if (newSession?.user) {
          const profile = await fetchProfile(newSession.user);
          if (mounted && profile) {
            setUser({
              id: newSession.user.id,
              email: newSession.user.email || '',
              name: profile.name,
              role: profile.role as UserRole,
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      // The trigger should create the profile, but let's also do it manually to be safe
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        role: 'USER',
      });
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signUp, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
