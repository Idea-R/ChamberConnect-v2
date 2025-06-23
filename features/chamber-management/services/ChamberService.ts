// Chamber Management Service - Complete Vertical Slice
// All chamber management business logic in one cohesive service

import { supabase } from '../../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Chamber,
  ChamberAdmin,
  ChamberSettings,
  ChamberStatistics,
  AdminInviteForm,
  ChamberSettingsForm,
  AdminPermissions,
  AdminRole,
  ChamberAPIResponse,
  OfflineAction,
  SyncStatus
} from '../types/chamber.types';

export class ChamberService {
  private static instance: ChamberService;
  private offlineActions: OfflineAction[] = [];
  private syncInProgress = false;

  static getInstance(): ChamberService {
    if (!ChamberService.instance) {
      ChamberService.instance = new ChamberService();
    }
    return ChamberService.instance;
  }

  // ==========================================
  // CHAMBER CRUD OPERATIONS
  // ==========================================

  async getChamber(chamberId: string): Promise<Chamber> {
    try {
      // Try offline cache first
      const cached = await this.getCachedChamber(chamberId);
      if (cached && !this.isStale(cached.updated_at)) {
        return cached;
      }

      const { data, error } = await supabase
        .from('chambers')
        .select('*')
        .eq('id', chamberId)
        .single();

      if (error) throw error;

      // Cache for offline access
      await this.cacheChamber(data);
      return data;
    } catch (error: any) {
      // Return cached version if available during offline
      const cached = await this.getCachedChamber(chamberId);
      if (cached) return cached;
      throw new Error(`Failed to fetch chamber: ${error.message}`);
    }
  }

  async updateChamber(chamberId: string, updates: Partial<Chamber>): Promise<Chamber> {
    try {
      const { data, error } = await supabase
        .from('chambers')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', chamberId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await this.cacheChamber(data);
      return data;
    } catch (error: any) {
      // Queue for offline sync
      await this.queueOfflineAction({
        type: 'UPDATE_CHAMBER',
        payload: { chamberId, updates },
        chamber_id: chamberId,
      });
      throw new Error(`Failed to update chamber: ${error.message}`);
    }
  }

  // ==========================================
  // CHAMBER ADMIN MANAGEMENT
  // ==========================================

  async getChamberAdmins(chamberId: string): Promise<ChamberAdmin[]> {
    try {
      const { data, error } = await supabase
        .from('chamber_admins')
        .select(`
          *,
          profiles!inner(id, username, email, full_name, avatar_url)
        `)
        .eq('chamber_id', chamberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch chamber admins: ${error.message}`);
    }
  }

  async inviteAdmin(chamberId: string, invite: AdminInviteForm): Promise<void> {
    try {
      // Check if user exists
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', invite.email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (existingUser) {
        // User exists, add as admin directly
        const { error: adminError } = await supabase
          .from('chamber_admins')
          .insert({
            chamber_id: chamberId,
            user_id: existingUser.id,
            role: invite.role,
            permissions: invite.permissions,
          });

        if (adminError) throw adminError;
      }

      // Send invitation email (would integrate with email service)
      await this.sendAdminInvitation(invite.email, chamberId, invite);

    } catch (error: any) {
      throw new Error(`Failed to invite admin: ${error.message}`);
    }
  }

  async updateAdminRole(adminId: string, role: AdminRole, permissions: AdminPermissions): Promise<void> {
    try {
      const { error } = await supabase
        .from('chamber_admins')
        .update({
          role,
          permissions,
          last_active: new Date().toISOString(),
        })
        .eq('id', adminId);

      if (error) throw error;
    } catch (error: any) {
      throw new Error(`Failed to update admin role: ${error.message}`);
    }
  }

  async removeAdmin(adminId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chamber_admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;
    } catch (error: any) {
      throw new Error(`Failed to remove admin: ${error.message}`);
    }
  }

  async checkAdminPermissions(chamberId: string, userId: string): Promise<ChamberAdmin | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_chamber_admin_status', { chamber_uuid: chamberId });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error: any) {
      console.error('Failed to check admin permissions:', error.message);
      return null;
    }
  }

  // ==========================================
  // CHAMBER SETTINGS MANAGEMENT
  // ==========================================

  async getChamberSettings(chamberId: string): Promise<ChamberSettings | null> {
    try {
      const { data, error } = await supabase
        .from('chamber_settings')
        .select('*')
        .eq('chamber_id', chamberId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error: any) {
      throw new Error(`Failed to fetch chamber settings: ${error.message}`);
    }
  }

  async updateChamberSettings(
    chamberId: string, 
    settings: ChamberSettingsForm
  ): Promise<ChamberSettings> {
    try {
      const { data, error } = await supabase
        .from('chamber_settings')
        .upsert({
          chamber_id: chamberId,
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      // Queue for offline sync
      await this.queueOfflineAction({
        type: 'UPDATE_CHAMBER_SETTINGS',
        payload: { chamberId, settings },
        chamber_id: chamberId,
      });
      throw new Error(`Failed to update chamber settings: ${error.message}`);
    }
  }

  // ==========================================
  // CHAMBER ANALYTICS & STATISTICS
  // ==========================================

  async getChamberStatistics(chamberId: string): Promise<ChamberStatistics> {
    try {
      // Use the optimized database function
      const { data, error } = await supabase
        .rpc('get_chamber_stats', { chamber_uuid: chamberId });

      if (error) throw error;
      
      const stats = data?.[0];
      if (!stats) {
        throw new Error('No statistics available');
      }

      return {
        total_members: stats.total_members || 0,
        active_members: stats.active_members || 0,
        inactive_members: (stats.total_members || 0) - (stats.active_members || 0),
        pending_members: stats.pending_members || 0,
        suspended_members: 0, // Calculate if needed
        total_events: stats.total_events || 0,
        upcoming_events: stats.upcoming_events || 0,
        completed_events: (stats.total_events || 0) - (stats.upcoming_events || 0),
        cancelled_events: 0, // Calculate if needed
        monthly_new_members: stats.monthly_new_members || 0,
        monthly_lost_members: 0, // Calculate if needed
        membership_revenue: parseFloat(stats.membership_revenue || '0'),
        event_revenue: parseFloat(stats.event_revenue || '0'),
        total_revenue: parseFloat(stats.membership_revenue || '0') + parseFloat(stats.event_revenue || '0'),
        engagement_rate: parseFloat(stats.engagement_rate || '0'),
        event_attendance_rate: 0, // Calculate if needed
        member_retention_rate: 0, // Calculate if needed
        growth_rate: 0, // Calculate if needed
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch chamber statistics: ${error.message}`);
    }
  }

  async getAdvancedAnalytics(
    chamberId: string, 
    timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<any> {
    try {
      // Advanced analytics queries
      const timeframeDays = {
        week: 7,
        month: 30,
        quarter: 90,
        year: 365,
      };

      const days = timeframeDays[timeframe];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Member growth over time
      const { data: memberGrowth, error: memberError } = await supabase
        .from('members')
        .select('created_at, membership_status')
        .eq('chamber_id', chamberId)
        .gte('created_at', startDate.toISOString())
        .order('created_at');

      if (memberError) throw memberError;

      // Event attendance trends
      const { data: eventTrends, error: eventError } = await supabase
        .from('events')
        .select('event_date, current_attendees, max_attendees, price')
        .eq('chamber_id', chamberId)
        .gte('event_date', startDate.toISOString())
        .order('event_date');

      if (eventError) throw eventError;

      return {
        memberGrowth: this.processGrowthData(memberGrowth || []),
        eventTrends: this.processEventTrends(eventTrends || []),
        timeframe,
        generated_at: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch advanced analytics: ${error.message}`);
    }
  }

  // ==========================================
  // OFFLINE & SYNC FUNCTIONALITY
  // ==========================================

  async queueOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retry_count'>): Promise<void> {
    const offlineAction: OfflineAction = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      retry_count: 0,
      ...action,
    };

    this.offlineActions.push(offlineAction);
    await AsyncStorage.setItem('offline_actions', JSON.stringify(this.offlineActions));
  }

  async syncOfflineActions(): Promise<SyncStatus> {
    if (this.syncInProgress) {
      return this.getSyncStatus();
    }

    this.syncInProgress = true;
    let successCount = 0;
    let errorCount = 0;
    let lastError: string | undefined;

    try {
      const actionsJson = await AsyncStorage.getItem('offline_actions');
      const actions: OfflineAction[] = actionsJson ? JSON.parse(actionsJson) : [];

      for (const action of actions) {
        try {
          await this.processOfflineAction(action);
          successCount++;
        } catch (error: any) {
          errorCount++;
          lastError = error.message;
          action.retry_count++;

          // Remove action if too many retries
          if (action.retry_count >= 3) {
            this.removeOfflineAction(action.id);
          }
        }
      }

      // Update offline actions list
      await AsyncStorage.setItem('offline_actions', JSON.stringify(this.offlineActions));

    } catch (error: any) {
      lastError = error.message;
    } finally {
      this.syncInProgress = false;
    }

    const syncStatus: SyncStatus = {
      last_sync: new Date().toISOString(),
      pending_actions: this.offlineActions.length,
      sync_in_progress: false,
      last_error: lastError,
    };

    await AsyncStorage.setItem('sync_status', JSON.stringify(syncStatus));
    return syncStatus;
  }

  async getSyncStatus(): Promise<SyncStatus> {
    try {
      const statusJson = await AsyncStorage.getItem('sync_status');
      if (statusJson) {
        return JSON.parse(statusJson);
      }
    } catch (error) {
      console.error('Failed to get sync status:', error);
    }

    return {
      last_sync: new Date().toISOString(),
      pending_actions: this.offlineActions.length,
      sync_in_progress: this.syncInProgress,
    };
  }

  // ==========================================
  // PRIVATE HELPER METHODS
  // ==========================================

  private async processOfflineAction(action: OfflineAction): Promise<void> {
    switch (action.type) {
      case 'UPDATE_CHAMBER':
        await this.updateChamber(action.payload.chamberId, action.payload.updates);
        break;
      case 'UPDATE_CHAMBER_SETTINGS':
        await this.updateChamberSettings(action.payload.chamberId, action.payload.settings);
        break;
      default:
        console.warn('Unknown offline action type:', action.type);
    }
  }

  private removeOfflineAction(actionId: string): void {
    this.offlineActions = this.offlineActions.filter(action => action.id !== actionId);
  }

  private async cacheChamber(chamber: Chamber): Promise<void> {
    try {
      await AsyncStorage.setItem(`chamber_${chamber.id}`, JSON.stringify(chamber));
    } catch (error) {
      console.error('Failed to cache chamber:', error);
    }
  }

  private async getCachedChamber(chamberId: string): Promise<Chamber | null> {
    try {
      const cached = await AsyncStorage.getItem(`chamber_${chamberId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to get cached chamber:', error);
      return null;
    }
  }

  private isStale(timestamp: string, maxAgeMinutes = 30): boolean {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMinutes = (now.getTime() - updated.getTime()) / (1000 * 60);
    return diffMinutes > maxAgeMinutes;
  }

  private async sendAdminInvitation(email: string, chamberId: string, invite: AdminInviteForm): Promise<void> {
    // Integration point for email service
    // This would typically send an email with invitation link
    console.log('Sending admin invitation to:', email);
  }

  private processGrowthData(data: any[]): any[] {
    // Process member growth data for charts
    const growthByDay = data.reduce((acc, member) => {
      const day = member.created_at.split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(growthByDay).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private processEventTrends(data: any[]): any[] {
    // Process event trends data for analytics
    return data.map(event => ({
      date: event.event_date,
      attendance_rate: event.max_attendees > 0 ? 
        (event.current_attendees / event.max_attendees) * 100 : 0,
      revenue: event.price * event.current_attendees,
    }));
  }

  // ==========================================
  // VALIDATION HELPERS
  // ==========================================

  validateAdminPermissions(currentRole: AdminRole, targetRole: AdminRole): boolean {
    const roleHierarchy = {
      owner: 4,
      admin: 3,
      moderator: 2,
      editor: 1,
    };

    return roleHierarchy[currentRole] > roleHierarchy[targetRole];
  }

  validateSettingsUpdate(settings: ChamberSettingsForm): string[] {
    const errors: string[] = [];

    if (settings.mobile_theme?.primary_color && 
        !this.isValidHexColor(settings.mobile_theme.primary_color)) {
      errors.push('Invalid primary color format');
    }

    if (settings.business_settings?.contact_info?.primary_email && 
        !this.isValidEmail(settings.business_settings.contact_info.primary_email)) {
      errors.push('Invalid email format');
    }

    return errors;
  }

  private isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
} 