// Global type definitions for React Native environment

declare global {
  var __DEV__: boolean;
  
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_SUPABASE_SERVICE_KEY?: string;
      EXPO_PUBLIC_API_BASE_URL?: string;
      EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
      EXPO_PUBLIC_SENTRY_DSN?: string;
      EXPO_PUBLIC_GA_ID?: string;
    }
  }
}

export {}; 