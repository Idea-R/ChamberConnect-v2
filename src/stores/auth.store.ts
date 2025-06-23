import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase.service';
import { Logger } from '../services/utils/logger.service';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  title?: string;
  company?: string;
  chamberId?: string;
  chamberRole?: 'admin' | 'member' | 'guest';
  permissions?: string[];
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  // State
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  
  // Profile Actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // Session Management
  refreshSession: () => Promise<void>;
  checkSession: () => Promise<void>;
  
  // Chamber Actions
  joinChamber: (chamberId: string, role?: string) => Promise<void>;
  leaveChamber: () => Promise<void>;
  updateChamberRole: (role: string) => Promise<void>;
  
  // Utility Actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // Auth Actions
      signIn: async (email: string, password: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          Logger.info('Attempting sign in', { email });
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          set((state) => {
            state.user = data.user;
            state.session = data.session;
            state.isAuthenticated = true;
            state.isLoading = false;
          });

          // Fetch user profile
          await get().refreshProfile();
          
          Logger.info('Sign in successful', { userId: data.user?.id });
        } catch (error: any) {
          Logger.error('Sign in failed', { error: error.message, email });
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string, userData: Partial<UserProfile>) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          Logger.info('Attempting sign up', { email });
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData,
            },
          });

          if (error) throw error;

          set((state) => {
            state.user = data.user;
            state.session = data.session;
            state.isAuthenticated = !!data.session;
            state.isLoading = false;
          });

          Logger.info('Sign up successful', { userId: data.user?.id });
        } catch (error: any) {
          Logger.error('Sign up failed', { error: error.message, email });
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      signOut: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          Logger.info('Attempting sign out');
          
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set((state) => {
            state.user = null;
            state.profile = null;
            state.session = null;
            state.isAuthenticated = false;
            state.isLoading = false;
          });

          Logger.info('Sign out successful');
        } catch (error: any) {
          Logger.error('Sign out failed', { error: error.message });
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          Logger.info('Requesting password reset', { email });
          
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;

          set((state) => {
            state.isLoading = false;
          });

          Logger.info('Password reset email sent', { email });
        } catch (error: any) {
          Logger.error('Password reset failed', { error: error.message, email });
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      updatePassword: async (newPassword: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          Logger.info('Updating password');
          
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });

          if (error) throw error;

          set((state) => {
            state.isLoading = false;
          });

          Logger.info('Password updated successfully');
        } catch (error: any) {
          Logger.error('Password update failed', { error: error.message });
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      // Profile Actions
      updateProfile: async (updates: Partial<UserProfile>) => {
        const { user } = get();
        if (!user) throw new Error('No authenticated user');

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          Logger.info('Updating profile', { updates });
          
          const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

          if (error) throw error;

          set((state) => {
            state.profile = { ...state.profile, ...data } as UserProfile;
            state.isLoading = false;
          });

          Logger.info('Profile updated successfully', { userId: user.id });
        } catch (error: any) {
          Logger.error('Profile update failed', { error: error.message });
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      refreshProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          Logger.debug('Refreshing user profile', { userId: user.id });
          
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') throw error;

          set((state) => {
            state.profile = data;
          });

          Logger.debug('Profile refreshed successfully', { userId: user.id });
        } catch (error: any) {
          Logger.error('Profile refresh failed', { error: error.message });
          set((state) => {
            state.error = error.message;
          });
        }
      },

      // Session Management
      refreshSession: async () => {
        try {
          Logger.debug('Refreshing session');
          
          const { data, error } = await supabase.auth.refreshSession();
          if (error) throw error;

          set((state) => {
            state.session = data.session;
            state.user = data.user;
            state.isAuthenticated = !!data.session;
          });

          Logger.debug('Session refreshed successfully');
        } catch (error: any) {
          Logger.error('Session refresh failed', { error: error.message });
          set((state) => {
            state.error = error.message;
          });
        }
      },

      checkSession: async () => {
        try {
          Logger.debug('Checking session');
          
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          set((state) => {
            state.session = data.session;
            state.user = data.session?.user || null;
            state.isAuthenticated = !!data.session;
          });

          if (data.session?.user) {
            await get().refreshProfile();
          }

          Logger.debug('Session check completed');
        } catch (error: any) {
          Logger.error('Session check failed', { error: error.message });
          set((state) => {
            state.error = error.message;
          });
        }
      },

      // Chamber Actions
      joinChamber: async (chamberId: string, role: string = 'member') => {
        const { user } = get();
        if (!user) throw new Error('No authenticated user');

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          Logger.info('Joining chamber', { chamberId, role });
          
          const { error } = await supabase
            .from('chamber_members')
            .insert({
              user_id: user.id,
              chamber_id: chamberId,
              role,
            });

          if (error) throw error;

          // Update profile with chamber info
          await get().updateProfile({
            chamberId,
            chamberRole: role as 'admin' | 'member' | 'guest',
          });

          Logger.info('Joined chamber successfully', { chamberId, role });
        } catch (error: any) {
          Logger.error('Failed to join chamber', { error: error.message, chamberId });
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      leaveChamber: async () => {
        const { user, profile } = get();
        if (!user || !profile?.chamberId) throw new Error('No chamber to leave');

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          Logger.info('Leaving chamber', { chamberId: profile.chamberId });
          
          const { error } = await supabase
            .from('chamber_members')
            .delete()
            .eq('user_id', user.id)
            .eq('chamber_id', profile.chamberId);

          if (error) throw error;

          // Update profile to remove chamber info
          await get().updateProfile({
            chamberId: undefined,
            chamberRole: undefined,
          });

          Logger.info('Left chamber successfully');
        } catch (error: any) {
          Logger.error('Failed to leave chamber', { error: error.message });
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      updateChamberRole: async (role: string) => {
        const { user, profile } = get();
        if (!user || !profile?.chamberId) throw new Error('No chamber membership');

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          Logger.info('Updating chamber role', { role, chamberId: profile.chamberId });
          
          const { error } = await supabase
            .from('chamber_members')
            .update({ role })
            .eq('user_id', user.id)
            .eq('chamber_id', profile.chamberId);

          if (error) throw error;

          await get().updateProfile({
            chamberRole: role as 'admin' | 'member' | 'guest',
          });

          Logger.info('Chamber role updated successfully', { role });
        } catch (error: any) {
          Logger.error('Failed to update chamber role', { error: error.message });
          set((state) => {
            state.error = error.message;
            state.isLoading = false;
          });
          throw error;
        }
      },

      // Utility Actions
      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      reset: () => {
        set(() => initialState);
      },
    })),
    {
      name: 'chamber-connect-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 