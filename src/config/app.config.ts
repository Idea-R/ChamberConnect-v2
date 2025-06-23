import Constants from 'expo-constants';

// Environment configuration
export const ENV = {
  DEV: 'development',
  STAGING: 'staging',
  PROD: 'production',
} as const;

export type Environment = typeof ENV[keyof typeof ENV];

// Get current environment
export const getCurrentEnv = (): Environment => {
  if (__DEV__) return ENV.DEV;
  if (Constants.expoConfig?.extra?.environment === 'staging') return ENV.STAGING;
  return ENV.PROD;
};

// App configuration
export const APP_CONFIG = {
  // App Info
  name: 'ChamberConnect',
  version: Constants.expoConfig?.version || '1.0.0',
  bundleId: Constants.expoConfig?.ios?.bundleIdentifier || 'com.chamberconnect.app',
  
  // Environment
  environment: getCurrentEnv(),
  
  // API Configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.chamberconnect.com',
    timeout: 30000,
    retryAttempts: 3,
  },
  
  // Supabase Configuration
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    serviceKey: process.env.EXPO_PUBLIC_SUPABASE_SERVICE_KEY,
  },
  
  // Authentication
  auth: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    refreshThreshold: 5 * 60 * 1000, // 5 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  
  // Cache Configuration
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 50 * 1024 * 1024, // 50MB
    gcInterval: 60 * 60 * 1000, // 1 hour
  },
  
  // Performance
  performance: {
    enableMetrics: getCurrentEnv() !== ENV.DEV,
    sampleRate: getCurrentEnv() === ENV.PROD ? 0.1 : 1.0,
    maxBundleSize: 10 * 1024 * 1024, // 10MB
  },
  
  // Features Flags
  features: {
    enableAnalytics: getCurrentEnv() === ENV.PROD,
    enableCrashReporting: getCurrentEnv() !== ENV.DEV,
    enablePushNotifications: true,
    enableBiometrics: true,
    enableOfflineMode: true,
    enableAI: true,
    enableVideoChat: false, // Future feature
    enablePayments: false, // Future feature
  },
  
  // UI Configuration
  ui: {
    theme: {
      primary: '#2563EB',
      secondary: '#64748B',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      background: '#FFFFFF',
      surface: '#F8FAFC',
    },
    animation: {
      duration: 200,
      easing: 'ease-in-out',
    },
    layout: {
      maxContentWidth: 1200,
      sidebarWidth: 280,
      headerHeight: 64,
    },
  },
  
  // Business Logic
  business: {
    chamber: {
      maxMembers: 10000,
      maxEvents: 1000,
      maxAnnouncements: 500,
    },
    subscription: {
      trialPeriod: 30, // days
      gracePeriod: 7, // days
    },
    upload: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
      allowedDocTypes: ['application/pdf', 'application/msword'],
    },
  },
  
  // External Services
  services: {
    stripe: {
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
    sentry: {
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    },
    analytics: {
      googleAnalyticsId: process.env.EXPO_PUBLIC_GA_ID,
    },
  },
  
  // Development
  dev: {
    enableFlipperIntegration: __DEV__,
    enableReactotron: __DEV__,
    enableStorybook: false,
    logLevel: getCurrentEnv() === ENV.DEV ? 'debug' : 'error',
  },
} as const;

// Type exports
export type AppConfig = typeof APP_CONFIG;
export type ThemeConfig = typeof APP_CONFIG.ui.theme;
export type BusinessConfig = typeof APP_CONFIG.business;

// Validation
const requiredEnvVars = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
];

export const validateConfig = (): void => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Initialize validation
if (getCurrentEnv() !== ENV.DEV) {
  validateConfig();
} 