import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'chamber_admin' | 'business_owner' | 'trial_user'
          chamber_id?: string | null
          trial_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'chamber_admin' | 'business_owner' | 'trial_user'
          chamber_id?: string | null
          trial_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chambers: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          website: string | null
          address: string | null
          phone: string | null
          admin_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          address?: string | null
          phone?: string | null
          admin_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          address?: string | null
          phone?: string | null
          admin_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          logo_url: string | null
          website: string | null
          phone: string | null
          email: string | null
          address: string | null
          owner_id: string
          chamber_id: string
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          logo_url?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          owner_id: string
          chamber_id: string
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          logo_url?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          owner_id?: string
          chamber_id?: string
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          location: string | null
          organizer_id: string
          chamber_id: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          location?: string | null
          organizer_id: string
          chamber_id: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          location?: string | null
          organizer_id?: string
          chamber_id?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          content: string
          sender_id: string
          recipient_id: string
          chamber_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          sender_id: string
          recipient_id: string
          chamber_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          sender_id?: string
          recipient_id?: string
          chamber_id?: string
          created_at?: string
        }
      }
    }
  }
}

