'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  github_id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'builder' | 'sponsor' | 'admin';
  company_name: string | null;
  company_logo_url: string | null;
  company_website: string | null;
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);

        // If user doesn't exist, try to create it from session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('Creating user profile from session...');
          const githubUser = session.user.user_metadata;

        // Try to insert, but ignore duplicate key errors
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: session.user.id,
            github_id: session.user.id,
            username: githubUser.user_name || githubUser.preferred_username || githubUser.name || 'anonymous',
            email: session.user.email,
            avatar_url: githubUser.avatar_url,
            bio: githubUser.bio || null,
            role: 'builder', // Default role
          })
          .select()
          .single();

        if (insertError) {
          // If it's a duplicate key error, try to fetch the existing profile
          if (insertError.code === '23505') {
            const { data: existingProfile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (existingProfile) {
              console.log('Profile already exists:', existingProfile);
              setProfile(existingProfile);
            } else {
              setProfile(null);
            }
          } else {
            console.error('Error creating profile:', insertError);
            setProfile(null);
          }
        } else {
          console.log('Profile created successfully:', newUser);
          setProfile(newUser);
        }
        } else {
          setProfile(null);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error in fetchProfile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    // Redirect to homepage after sign out
    window.location.href = '/';
  };

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isSponsor: profile?.role === 'sponsor',
    isBuilder: profile?.role === 'builder',
    isAdmin: profile?.role === 'admin',
    signOut,
  };
}
