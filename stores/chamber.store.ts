import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../lib/supabase';

export interface ChamberMember {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  category: string;
  description?: string;
  logo_url?: string;
  membership_status: 'active' | 'inactive' | 'pending' | 'suspended';
  membership_type: 'standard' | 'premium' | 'corporate';
  membership_level: 'basic' | 'silver' | 'gold' | 'platinum';
  joined_date: string;
  renewal_date?: string;
  dues_amount?: number;
  payment_status: 'current' | 'overdue' | 'cancelled';
  tags: string[];
  services: string[];
  created_at: string;
  updated_at: string;
}

export interface ChamberEvent {
  id: string;
  chamber_id: string;
  title: string;
  description?: string;
  event_date: string;
  end_date?: string;
  location?: string;
  address?: string;
  max_attendees?: number;
  current_attendees: number;
  registration_required: boolean;
  registration_deadline?: string;
  event_type: 'networking' | 'workshop' | 'conference' | 'social' | 'meeting';
  price: number;
  image_url?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ChamberStats {
  total_members: number;
  active_members: number;
  pending_members: number;
  total_events: number;
  upcoming_events: number;
  monthly_new_members: number;
  membership_revenue: number;
  event_revenue: number;
  engagement_rate: number;
}

export interface ChamberSettings {
  id: string;
  chamber_id: string;
  mobile_theme: {
    primary_color: string;
    dark_mode: boolean;
  };
  notification_settings: {
    push_enabled: boolean;
    email_enabled: boolean;
    member_updates: boolean;
    event_reminders: boolean;
  };
  feature_flags: {
    analytics: boolean;
    events: boolean;
    messaging: boolean;
    advanced_reporting: boolean;
  };
  business_settings: {
    business_hours: Record<string, { open: string; close: string; closed: boolean }>;
    contact_info: {
      phone: string;
      email: string;
      website: string;
      address: string;
    };
  };
}

interface ChamberStore {
  // State
  currentChamber?: any; // From auth context
  members: ChamberMember[];
  events: ChamberEvent[];
  stats: ChamberStats | null;
  settings: ChamberSettings | null;
  isLoading: boolean;
  error: string | null;

  // Search and filters
  memberSearchQuery: string;
  memberFilters: {
    status: string[];
    category: string[];
    membershipType: string[];
  };

  // Actions - Members
  fetchMembers: (chamberId: string, options?: { refresh?: boolean }) => Promise<void>;
  addMember: (member: Omit<ChamberMember, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateMember: (memberId: string, updates: Partial<ChamberMember>) => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
  searchMembers: (query: string) => void;
  setMemberFilters: (filters: Partial<ChamberStore['memberFilters']>) => void;
  bulkUpdateMembers: (memberIds: string[], updates: Partial<ChamberMember>) => Promise<void>;

  // Actions - Events
  fetchEvents: (chamberId: string, options?: { refresh?: boolean }) => Promise<void>;
  createEvent: (event: Omit<ChamberEvent, 'id' | 'chamber_id' | 'created_at'>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<ChamberEvent>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;

  // Actions - Analytics
  fetchStats: (chamberId: string) => Promise<void>;
  refreshStats: (chamberId: string) => Promise<void>;

  // Actions - Settings
  fetchSettings: (chamberId: string) => Promise<void>;
  updateSettings: (settings: Partial<ChamberSettings>) => Promise<void>;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  members: [],
  events: [],
  stats: null,
  settings: null,
  isLoading: false,
  error: null,
  memberSearchQuery: '',
  memberFilters: {
    status: [],
    category: [],
    membershipType: [],
  },
};

export const useChamberStore = create<ChamberStore>()(
  immer((set, get) => ({
    ...initialState,
    currentChamber: undefined,

    // Members Actions
    fetchMembers: async (chamberId: string, options = {}) => {
      const { refresh = false } = options;
      
      if (!refresh && get().members.length > 0) {
        return; // Use cached data
      }

      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('chamber_id', chamberId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        set((state) => {
          state.members = data || [];
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
      }
    },

    addMember: async (memberData) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase
          .from('members')
          .insert([memberData])
          .select()
          .single();

        if (error) throw error;

        set((state) => {
          state.members.unshift(data);
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
        throw error;
      }
    },

    updateMember: async (memberId: string, updates) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase
          .from('members')
          .update(updates)
          .eq('id', memberId)
          .select()
          .single();

        if (error) throw error;

        set((state) => {
          const index = state.members.findIndex(m => m.id === memberId);
          if (index !== -1) {
            state.members[index] = { ...state.members[index], ...data };
          }
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
        throw error;
      }
    },

    deleteMember: async (memberId: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { error } = await supabase
          .from('members')
          .delete()
          .eq('id', memberId);

        if (error) throw error;

        set((state) => {
          state.members = state.members.filter(m => m.id !== memberId);
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
        throw error;
      }
    },

    searchMembers: (query: string) => {
      set((state) => {
        state.memberSearchQuery = query;
      });
    },

    setMemberFilters: (filters) => {
      set((state) => {
        state.memberFilters = { ...state.memberFilters, ...filters };
      });
    },

    bulkUpdateMembers: async (memberIds: string[], updates) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { error } = await supabase
          .from('members')
          .update(updates)
          .in('id', memberIds);

        if (error) throw error;

        // Refresh members after bulk update
        const chamberId = get().currentChamber?.id;
        if (chamberId) {
          await get().fetchMembers(chamberId, { refresh: true });
        }
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
        throw error;
      }
    },

    // Events Actions
    fetchEvents: async (chamberId: string, options = {}) => {
      const { refresh = false } = options;
      
      if (!refresh && get().events.length > 0) {
        return;
      }

      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('chamber_id', chamberId)
          .order('event_date', { ascending: true });

        if (error) throw error;

        set((state) => {
          state.events = data || [];
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
      }
    },

    createEvent: async (eventData) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase
          .from('events')
          .insert([{ ...eventData, chamber_id: get().currentChamber?.id }])
          .select()
          .single();

        if (error) throw error;

        set((state) => {
          state.events.push(data);
          state.events.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
        throw error;
      }
    },

    updateEvent: async (eventId: string, updates) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase
          .from('events')
          .update(updates)
          .eq('id', eventId)
          .select()
          .single();

        if (error) throw error;

        set((state) => {
          const index = state.events.findIndex(e => e.id === eventId);
          if (index !== -1) {
            state.events[index] = { ...state.events[index], ...data };
          }
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
        throw error;
      }
    },

    deleteEvent: async (eventId: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', eventId);

        if (error) throw error;

        set((state) => {
          state.events = state.events.filter(e => e.id !== eventId);
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
        throw error;
      }
    },

    // Analytics Actions
    fetchStats: async (chamberId: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Fetch basic stats from different tables
        const [membersResult, eventsResult] = await Promise.all([
          supabase
            .from('members')
            .select('membership_status, dues_amount, created_at')
            .eq('chamber_id', chamberId),
          supabase
            .from('events')
            .select('status, price, current_attendees, created_at')
            .eq('chamber_id', chamberId)
        ]);

        if (membersResult.error) throw membersResult.error;
        if (eventsResult.error) throw eventsResult.error;

        const members = membersResult.data || [];
        const events = eventsResult.data || [];

        // Calculate stats
        const stats: ChamberStats = {
          total_members: members.length,
          active_members: members.filter(m => m.membership_status === 'active').length,
          pending_members: members.filter(m => m.membership_status === 'pending').length,
          total_events: events.length,
          upcoming_events: events.filter(e => e.status === 'upcoming').length,
          monthly_new_members: members.filter(m => {
            const joinDate = new Date(m.created_at);
            const now = new Date();
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return joinDate >= monthAgo;
          }).length,
          membership_revenue: members.reduce((sum, m) => sum + (m.dues_amount || 0), 0),
          event_revenue: events.reduce((sum, e) => sum + (e.price * e.current_attendees), 0),
          engagement_rate: members.length > 0 ? (members.filter(m => m.membership_status === 'active').length / members.length) * 100 : 0,
        };

        set((state) => {
          state.stats = stats;
          state.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
          state.isLoading = false;
        });
      }
    },

    refreshStats: async (chamberId: string) => {
      await get().fetchStats(chamberId);
    },

    // Settings Actions
    fetchSettings: async (chamberId: string) => {
      try {
        const { data, error } = await supabase
          .from('chamber_settings')
          .select('*')
          .eq('chamber_id', chamberId)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore not found error

        set((state) => {
          state.settings = data || null;
        });
      } catch (error: any) {
        set((state) => {
          state.error = error.message;
        });
      }
    },

    updateSettings: async (settingsUpdate) => {
      const chamberId = get().currentChamber?.id;
      if (!chamberId) return;

      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const { data, error } = await supabase
          .from('chamber_settings')
          .upsert({
            chamber_id: chamberId,
            ...settingsUpdate,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        set((state) => {
          state.settings = data;
          state.isLoading = false;
        });
      } catch (error: any) {
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

    reset: () => {
      set(() => initialState);
    },
  }))
); 