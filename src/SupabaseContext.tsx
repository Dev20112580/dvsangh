import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

interface SupabaseContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  isAuthReady: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // 1. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        // 2. Fetch profile from 'profiles' table
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
          if (data) {
            setUserProfile(data);
          } else if (error) {
            console.error('Error fetching user profile:', error);
          }
        } catch (error) {
          console.error('Unexpected error fetching profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
      setIsAuthReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ user, userProfile, loading, isAuthReady }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

// Also export a 'useFirebase' alias temporarily to avoid breaking components during migration if they use that name
export const useFirebase = useSupabase;
