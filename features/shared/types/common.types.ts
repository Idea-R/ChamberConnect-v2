// Shared Types - Cross-Feature Communication
// Common types used across multiple vertical slices

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// API Response wrapper
export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    pagination?: PaginationMeta;
    timestamp?: string;
    version?: string;
  };
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Error handling
export interface AppError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
  stack?: string;
}

// User context (minimal for cross-feature use)
export interface UserContext {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  permissions: string[];
  chamber_id?: string;
}

// Feature flags
export interface FeatureFlags {
  [key: string]: boolean;
}

// Offline support
export interface OfflineCapable {
  canWorkOffline: boolean;
  syncStatus: 'synced' | 'pending' | 'error';
  lastSync?: string;
}

// Mobile-specific interfaces
export interface MobileOptimized {
  loadingState: 'idle' | 'loading' | 'success' | 'error';
  refreshing: boolean;
  pullToRefresh: boolean;
}

// Navigation types (generic)
export interface NavigationState {
  routeName: string;
  params?: Record<string, any>;
  history: string[];
}

// Form validation
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings?: Record<string, string[]>;
}

// Data transformation
export interface DataTransformer<T, U> {
  transform: (input: T) => U;
  reverse: (output: U) => T;
}

// Feature registry
export interface FeatureRegistry {
  [featureName: string]: {
    version: string;
    dependencies: string[];
    exports: string[];
    initialized: boolean;
  };
} 