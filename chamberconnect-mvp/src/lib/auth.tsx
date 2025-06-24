'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'chamber_admin' | 'business_owner' | 'trial_user'
  chamber_id: string | null
  trial_expires_at: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>
  signUpWithEmail: (email: string, password: string, fullName: string, role: 'chamber_admin' | 'business_owner') => Promise<{ error?: any }>
  signOut: () => Promise<void>
  createTrialAccount: (email: string) => Promise<{ error?: any }>
  isTrialExpired: () => boolean
  // Demo mode functions
  enableDemoMode: (role: 'chamber_admin' | 'business_owner' | 'trial_user') => void
  disableDemoMode: () => void
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user profiles for testing
const DEMO_PROFILES = {
  chamber_admin: {
    id: 'demo-admin-123',
    email: 'admin@demo-chamber.com',
    full_name: 'Sarah Johnson',
    avatar_url: null,
    role: 'chamber_admin' as const,
    chamber_id: 'demo-chamber-456',
    trial_expires_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  business_owner: {
    id: 'demo-business-123',
    email: 'owner@demo-business.com',
    full_name: 'Mike Rodriguez',
    avatar_url: null,
    role: 'business_owner' as const,
    chamber_id: 'demo-chamber-456',
    trial_expires_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  trial_user: {
    id: 'demo-trial-123',
    email: 'trial@demo-user.com',
    full_name: 'Emma Chen',
    avatar_url: null,
    role: 'trial_user' as const,
    chamber_id: null,
    trial_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@chamberconnect.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
} as User

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Demo mode functions
  const enableDemoMode = (role: 'chamber_admin' | 'business_owner' | 'trial_user') => {
    setIsDemoMode(true)
    setUser(DEMO_USER)
    setProfile(DEMO_PROFILES[role])
    setSession({ user: DEMO_USER } as Session)
    setLoading(false)
    
    // Store demo mode in localStorage for persistence
    localStorage.setItem('chamberconnect_demo_mode', role)
  }

  const disableDemoMode = () => {
    setIsDemoMode(false)
    setUser(null)
    setProfile(null)
    setSession(null)
    setLoading(false)
    
    // Remove demo mode from localStorage
    localStorage.removeItem('chamberconnect_demo_mode')
  }

  useEffect(() => {
    // Check for demo mode in localStorage first
    const demoMode = localStorage.getItem('chamberconnect_demo_mode')
    if (demoMode && ['chamber_admin', 'business_owner', 'trial_user'].includes(demoMode)) {
      enableDemoMode(demoMode as 'chamber_admin' | 'business_owner' | 'trial_user')
      return
    }

    // Get initial session if not in demo mode
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isDemoMode) return // Don't override demo mode
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [isDemoMode])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // Create a basic profile if none exists
        setProfile({
          id: userId,
          email: user?.email || '',
          full_name: null,
          avatar_url: null,
          role: 'trial_user',
          chamber_id: null,
          trial_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    if (isDemoMode) return
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (isDemoMode) return { error: null }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUpWithEmail = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: 'chamber_admin' | 'business_owner'
  ) => {
    if (isDemoMode) return { error: null }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    })
    return { error }
  }

  const signOut = async () => {
    if (isDemoMode) {
      disableDemoMode()
      return
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const createTrialAccount = async (email: string) => {
    if (isDemoMode) return { error: null }
    
    // For now, just create a trial profile without authentication
    // In production, this would create a proper trial account
    return { error: null }
  }

  const isTrialExpired = () => {
    if (!profile?.trial_expires_at) return false
    return new Date(profile.trial_expires_at) < new Date()
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    createTrialAccount,
    isTrialExpired,
    enableDemoMode,
    disableDemoMode,
    isDemoMode,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

