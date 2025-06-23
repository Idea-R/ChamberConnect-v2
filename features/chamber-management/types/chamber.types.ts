// Chamber Management Feature Types
// Complete type definitions for chamber admin functionality

export interface Chamber {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  membership_tiers: MembershipTier[];
  settings: ChamberSettings;
  created_at: string;
  updated_at: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  duration_months: number;
  is_active: boolean;
}

export interface ChamberAdmin {
  id: string;
  chamber_id: string;
  user_id: string;
  role: AdminRole;
  permissions: AdminPermissions;
  mobile_permissions: MobilePermissions;
  created_at: string;
  last_active: string;
}

export type AdminRole = 'owner' | 'admin' | 'moderator' | 'editor';

export interface AdminPermissions {
  members: boolean;
  events: boolean;
  settings: boolean;
  analytics: boolean;
  billing: boolean;
  messaging: boolean;
}

export interface MobilePermissions {
  push_notifications: boolean;
  offline_access: boolean;
  camera_access: boolean;
  location_access: boolean;
}

export interface ChamberSettings {
  id: string;
  chamber_id: string;
  mobile_theme: MobileTheme;
  notification_settings: NotificationSettings;
  feature_flags: FeatureFlags;
  business_settings: BusinessSettings;
  settings: Record<string, any>;
  updated_at: string;
}

export interface MobileTheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  dark_mode: boolean;
  logo_url?: string;
  background_image_url?: string;
}

export interface NotificationSettings {
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  member_updates: boolean;
  event_reminders: boolean;
  payment_reminders: boolean;
  system_notifications: boolean;
}

export interface FeatureFlags {
  analytics: boolean;
  events: boolean;
  messaging: boolean;
  advanced_reporting: boolean;
  ai_insights: boolean;
  mobile_app: boolean;
  payment_processing: boolean;
  member_portal: boolean;
}

export interface BusinessSettings {
  business_hours: BusinessHours;
  contact_info: ContactInfo;
  social_media: SocialMediaLinks;
  location: LocationInfo;
  policies: BusinessPolicies;
}

export interface BusinessHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  open: string; // HH:mm format
  close: string; // HH:mm format
  closed: boolean;
  breaks?: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  label?: string;
}

export interface ContactInfo {
  primary_phone: string;
  secondary_phone?: string;
  primary_email: string;
  support_email?: string;
  mailing_address: string;
  physical_address: string;
  website: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

export interface LocationInfo {
  latitude?: number;
  longitude?: number;
  timezone: string;
  region: string;
  country: string;
  state_province: string;
  city: string;
  postal_code: string;
}

export interface BusinessPolicies {
  terms_of_service_url?: string;
  privacy_policy_url?: string;
  refund_policy_url?: string;
  membership_agreement_url?: string;
  code_of_conduct_url?: string;
}

// Chamber Analytics & Statistics
export interface ChamberStatistics {
  total_members: number;
  active_members: number;
  inactive_members: number;
  pending_members: number;
  suspended_members: number;
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  cancelled_events: number;
  monthly_new_members: number;
  monthly_lost_members: number;
  membership_revenue: number;
  event_revenue: number;
  total_revenue: number;
  engagement_rate: number;
  event_attendance_rate: number;
  member_retention_rate: number;
  growth_rate: number;
}

// UI/State Management Types
export interface ChamberManagementState {
  chamber: Chamber | null;
  admins: ChamberAdmin[];
  settings: ChamberSettings | null;
  statistics: ChamberStatistics | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Action Types for State Management
export type ChamberManagementAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CHAMBER'; payload: Chamber }
  | { type: 'SET_ADMINS'; payload: ChamberAdmin[] }
  | { type: 'SET_SETTINGS'; payload: ChamberSettings }
  | { type: 'SET_STATISTICS'; payload: ChamberStatistics }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ChamberSettings> }
  | { type: 'ADD_ADMIN'; payload: ChamberAdmin }
  | { type: 'REMOVE_ADMIN'; payload: string }
  | { type: 'UPDATE_ADMIN'; payload: { id: string; updates: Partial<ChamberAdmin> } }
  | { type: 'RESET_STATE' };

// Form Types for UI Components
export interface ChamberSettingsForm {
  mobile_theme: Partial<MobileTheme>;
  notification_settings: Partial<NotificationSettings>;
  business_settings: Partial<BusinessSettings>;
  feature_flags: Partial<FeatureFlags>;
}

export interface AdminInviteForm {
  email: string;
  role: AdminRole;
  permissions: Partial<AdminPermissions>;
  send_welcome_email: boolean;
  custom_message?: string;
}

// API Response Types
export interface ChamberAPIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// Error Types
export interface ChamberError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// Mobile-Specific Types
export interface MobileNavigationParams {
  ChamberDashboard: undefined;
  ChamberSettings: { section?: string };
  AdminManagement: undefined;
  ChamberAnalytics: { timeframe?: string };
  MemberManagement: undefined;
  EventManagement: undefined;
  NotificationCenter: undefined;
}

export interface ChamberQuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
  badge?: number;
  disabled?: boolean;
}

// Offline/Sync Types
export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  retry_count: number;
  chamber_id: string;
}

export interface SyncStatus {
  last_sync: string;
  pending_actions: number;
  sync_in_progress: boolean;
  last_error?: string;
} 