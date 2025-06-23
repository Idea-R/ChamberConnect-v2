import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../config/app.config';
import { Logger } from './utils/logger.service';

// Database types (will be generated from Supabase CLI)
export interface Database {
  public: {
    Tables: {
      chambers: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          website?: string;
          phone?: string;
          email?: string;
          address?: string;
          city?: string;
          state?: string;
          zip?: string;
          logo_url?: string;
          banner_url?: string;
          settings?: any;
          subscription_status?: string;
          subscription_tier?: string;
          admin_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          website?: string;
          phone?: string;
          email?: string;
          address?: string;
          city?: string;
          state?: string;
          zip?: string;
          logo_url?: string;
          banner_url?: string;
          settings?: any;
          subscription_status?: string;
          subscription_tier?: string;
          admin_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          website?: string;
          phone?: string;
          email?: string;
          address?: string;
          city?: string;
          state?: string;
          zip?: string;
          logo_url?: string;
          banner_url?: string;
          settings?: any;
          subscription_status?: string;
          subscription_tier?: string;
          admin_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chamber_members: {
        Row: {
          id: string;
          chamber_id: string;
          user_id: string;
          role: string;
          status: string;
          joined_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chamber_id: string;
          user_id: string;
          role?: string;
          status?: string;
          joined_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chamber_id?: string;
          user_id?: string;
          role?: string;
          status?: string;
          joined_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
          phone?: string;
          title?: string;
          company?: string;
          bio?: string;
          website?: string;
          linkedin?: string;
          preferences?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
          phone?: string;
          title?: string;
          company?: string;
          bio?: string;
          website?: string;
          linkedin?: string;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
          phone?: string;
          title?: string;
          company?: string;
          bio?: string;
          website?: string;
          linkedin?: string;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

class SupabaseService {
  private client: SupabaseClient<Database>;
  private initialized: boolean = false;

  constructor() {
    this.client = createClient<Database>(
      APP_CONFIG.supabase.url,
      APP_CONFIG.supabase.anonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            'X-Client-Info': `${APP_CONFIG.name}@${APP_CONFIG.version}`,
          },
        },
      }
    );

    this.initialize();
  }

  private async initialize() {
    try {
      // Set up auth state change listener
      this.client.auth.onAuthStateChange((event, session) => {
        Logger.debug('Auth state changed', { event, userId: session?.user?.id });
        
        switch (event) {
          case 'SIGNED_IN':
            Logger.info('User signed in', { userId: session?.user?.id });
            break;
          case 'SIGNED_OUT':
            Logger.info('User signed out');
            break;
          case 'TOKEN_REFRESHED':
            Logger.debug('Token refreshed', { userId: session?.user?.id });
            break;
          case 'USER_UPDATED':
            Logger.debug('User updated', { userId: session?.user?.id });
            break;
        }
      });

      this.initialized = true;
      Logger.info('Supabase service initialized');
    } catch (error) {
      Logger.error('Failed to initialize Supabase service', { error });
      throw error;
    }
  }

  // Getter for the client
  get instance(): SupabaseClient<Database> {
    if (!this.initialized) {
      Logger.warn('Supabase service not yet initialized');
    }
    return this.client;
  }

  // Auth methods
  get auth() {
    return this.client.auth;
  }

  // Database methods
  get from() {
    return this.client.from.bind(this.client);
  }

  get storage() {
    return this.client.storage;
  }

  get functions() {
    return this.client.functions;
  }

  get realtime() {
    return this.client.realtime;
  }

  // Utility methods
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from('chambers')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      Logger.error('Supabase health check failed', { error });
      return false;
    }
  }

  async testConnection(): Promise<{ success: boolean; latency?: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      const { error } = await this.client
        .from('chambers')
        .select('id')
        .limit(1);
      
      const latency = Date.now() - startTime;
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, latency };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Row Level Security helpers
  async enableRLS(table: string): Promise<void> {
    try {
      await this.client.rpc('enable_rls', { table_name: table });
      Logger.info(`RLS enabled for table: ${table}`);
    } catch (error) {
      Logger.error(`Failed to enable RLS for table: ${table}`, { error });
      throw error;
    }
  }

  // Batch operations
  async batchInsert<T extends keyof Database['public']['Tables']>(
    table: T,
    records: Database['public']['Tables'][T]['Insert'][]
  ): Promise<Database['public']['Tables'][T]['Row'][]> {
    try {
      const { data, error } = await this.client
        .from(table)
        .insert(records)
        .select();
      
      if (error) throw error;
      
      Logger.info(`Batch inserted ${records.length} records into ${String(table)}`);
      return data as Database['public']['Tables'][T]['Row'][];
    } catch (error) {
      Logger.error(`Batch insert failed for table: ${String(table)}`, { error });
      throw error;
    }
  }

  // Real-time subscriptions
  subscribeToTable<T extends keyof Database['public']['Tables']>(
    table: T,
    callback: (payload: any) => void,
    filter?: string
  ) {
    const channel = this.client
      .channel(`${String(table)}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: String(table),
          filter,
        },
        callback
      )
      .subscribe();

    Logger.debug(`Subscribed to real-time changes for table: ${String(table)}`);
    
    return channel;
  }

  // File upload helpers
  async uploadFile(
    bucket: string,
    path: string,
    file: File | Blob,
    options?: { cacheControl?: string; contentType?: string; upsert?: boolean }
  ) {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(path, file, options);
      
      if (error) throw error;
      
      Logger.info(`File uploaded successfully`, { bucket, path });
      return data;
    } catch (error) {
      Logger.error(`File upload failed`, { bucket, path, error });
      throw error;
    }
  }

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  // Analytics and metrics
  async logEvent(event: string, properties?: Record<string, any>) {
    try {
      await this.client
        .from('analytics_events')
        .insert({
          event,
          properties,
          timestamp: new Date().toISOString(),
        });
    } catch (error) {
      // Silently fail analytics - don't break the app
      Logger.debug('Analytics event failed', { event, error });
    }
  }
}

// Export singleton instance
export const supabase = new SupabaseService().instance;
export const supabaseService = new SupabaseService();

// Export types
export type { Database };
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']; 