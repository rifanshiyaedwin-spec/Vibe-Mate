import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getProfile, saveProfile } from '../lib/storage';
import { UserProfile, CompanionPersona, CompanionLanguage } from '../types/database';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  is_demo?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isSupabaseLive: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string; requiresEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
  updateProfilePreferences: (persona: CompanionPersona, language: CompanionLanguage, displayName?: string) => Promise<void>;
  loginAsDemo: (name?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = 'vibemate_demo_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Vibe Explorer',
              avatar_url: session.user.user_metadata?.avatar_url,
              is_demo: false,
            };
            setUser(authUser);
            const prof = await getProfile(authUser.id);
            if (prof && mounted) setProfile(prof);
            setLoading(false);
            return;
          }

          // Listen for Supabase auth state changes
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            if (session?.user) {
              const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Vibe Explorer',
                avatar_url: session.user.user_metadata?.avatar_url,
                is_demo: false,
              };
              setUser(authUser);
              const prof = await getProfile(authUser.id);
              if (prof && mounted) setProfile(prof);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setProfile(null);
            }
          });

          return () => {
            authListener.subscription.unsubscribe();
          };
        }

        // Check local demo session
        const savedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
        if (savedDemo && mounted) {
          try {
            const parsed = JSON.parse(savedDemo);
            setUser(parsed);
            const prof = await getProfile(parsed.id);
            if (prof && mounted) setProfile(prof);
          } catch {
            localStorage.removeItem(DEMO_USER_STORAGE_KEY);
          }
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { error: error.message };
        }
        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            is_demo: false,
          };
          setUser(authUser);
          const prof = await getProfile(authUser.id);
          if (prof) setProfile(prof);
        }
        return {};
      } catch (err: any) {
        return { error: err.message || 'Login failed' };
      }
    }

    // Demo / fallback mode
    const demoUser: AuthUser = {
      id: `demo_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      full_name: email.split('@')[0] || 'Vibe Explorer',
      is_demo: true,
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    return {};
  };

  const signUp = async (
    email: string, 
    password: string, 
    fullName: string
  ): Promise<{ error?: string; requiresEmailConfirmation?: boolean }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              name: fullName,
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        // If email confirmation is enabled on Supabase project
        if (data.user && !data.session) {
          return { requiresEmailConfirmation: true };
        }

        if (data.user && data.session) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            is_demo: false,
          };
          setUser(authUser);
          const newProfile: UserProfile = {
            id: authUser.id,
            email,
            display_name: fullName,
            preferred_language: 'english',
            companion_persona: 'friendly',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await saveProfile(newProfile);
          setProfile(newProfile);
        }

        return {};
      } catch (err: any) {
        return { error: err.message || 'Failed to create account.' };
      }
    }

    // Demo sign up
    const demoUser: AuthUser = {
      id: `user_${Date.now()}`,
      email,
      full_name: fullName,
      is_demo: true,
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    const newProfile: UserProfile = {
      id: demoUser.id,
      email,
      display_name: fullName,
      preferred_language: 'english',
      companion_persona: 'friendly',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await saveProfile(newProfile);
    setProfile(newProfile);
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string): Promise<{ error?: string; message?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
        });
        if (error) return { error: error.message };
        return { message: 'Password reset link sent to your email.' };
      } catch (err: any) {
        return { error: err.message || 'Failed to send reset link.' };
      }
    }

    return { message: 'Demo mode: Reset link simulated. You can log in directly!' };
  };

  const updateProfilePreferences = async (
    persona: CompanionPersona,
    language: CompanionLanguage,
    displayName?: string
  ) => {
    if (!user) return;
    const current = profile || {
      id: user.id,
      email: user.email,
      display_name: displayName || user.full_name,
      preferred_language: language,
      companion_persona: persona,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated: UserProfile = {
      ...current,
      companion_persona: persona,
      preferred_language: language,
      display_name: displayName || current.display_name,
    };

    const saved = await saveProfile(updated);
    setProfile(saved);
  };

  const loginAsDemo = (name: string = 'Alex Rivera') => {
    const demoUser: AuthUser = {
      id: 'demo_user_vibemate',
      email: 'alex@vibemate.space',
      full_name: name,
      is_demo: true,
    };
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    const demoProf: UserProfile = {
      id: demoUser.id,
      email: demoUser.email,
      display_name: name,
      preferred_language: 'english',
      companion_persona: 'friendly',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProfile(demoProf);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isSupabaseLive: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfilePreferences,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
