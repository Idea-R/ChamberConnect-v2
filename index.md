# ChamberConnect - Project Overview

## 📋 High-Level Overview

**ChamberConnect** is a React Native mobile application built with Expo Router that serves as a digital platform for local Chambers of Commerce. The app facilitates networking, business discovery, event management, and community engagement for chamber members while providing multiple revenue streams through B2B-focused monetization features.

## 🏗️ Architecture & Technology Stack

### Core Technologies
- **React Native** (v0.79.1) with React (v19.0.0)
- **Expo** (v53.0.0) with Expo Router for navigation
- **TypeScript** for type safety
- **Supabase** for backend services (authentication, database)
- **Zustand** for state management

### Key Dependencies
- **UI/Navigation**: expo-router, @react-navigation/*
- **Backend**: @supabase/supabase-js
- **Styling**: expo-linear-gradient, expo-blur
- **Icons**: lucide-react-native, @expo/vector-icons
- **Typography**: @expo-google-fonts (Inter, Poppins)

## 📁 Project Structure

### Main Directories
```
/app                    # Main application screens (Expo Router)
  ├── (tabs)/          # Tab navigation screens
  ├── (auth)/          # Authentication screens
  ├── (modals)/        # Modal screens
  └── _layout.tsx      # Root layout with providers

/components             # Reusable UI components
  ├── ui/              # Basic UI components (Button, Card, Input)
  ├── auth/            # Authentication-specific components
  ├── feed/            # Social feed components
  ├── directory/       # Business directory components
  ├── messaging/       # Chat/messaging components
  └── profile/         # User profile components

/lib                   # Core configurations
  └── supabase.ts      # Supabase client configuration

/utils                 # Utilities and helpers
  ├── auth.tsx         # Authentication context and hooks
  ├── types.ts         # TypeScript type definitions
  ├── data.ts          # Sample/mock data
  └── helpers.ts       # Utility functions

/supabase              # Database migrations and configuration
  └── migrations/      # SQL migration files

/hooks                 # Custom React hooks
/assets                # Static assets (images, fonts)
```

## 🔍 Core Features Analysis

### 1. Authentication System
- **Location**: `utils/auth.tsx`, `app/(auth)/`
- **Features**: Email/password, Google OAuth, user profiles
- **Database**: Supabase Auth with custom profiles table
- **Security**: Row Level Security (RLS) enabled

### 2. Chamber Management
- **Multi-chamber support**: Users can select from multiple chambers
- **Chamber data**: Currently uses mock data in `utils/data.ts`
- **Integration**: Chamber selection affects content filtering

### 3. Social Feed
- **Location**: `app/(tabs)/feed.tsx`, `components/feed/`
- **Features**: Posts (events, updates, questions), filtering, creation
- **UI**: Card-based layout with category filters

### 4. Business Directory
- **Location**: `app/(tabs)/directory.tsx`, `components/directory/`
- **Features**: Business listings, search, category filtering
- **Data**: 12 business categories, comprehensive business profiles

### 5. Messaging System
- **Location**: `app/(tabs)/messages.tsx`, `components/messaging/`
- **Features**: Private messaging between members
- **Status**: Authenticated users only

### 6. User Profiles
- **Location**: `app/(tabs)/profile.tsx`, `components/profile/`
- **Features**: Personal and business profile management
- **Integration**: Connected to Supabase profiles table

## 💰 Business Model & Revenue Opportunities

### Chamber-Focused Revenue Streams
- **Chamber Subscriptions**: Monthly/annual fees for roster access ($50-200/month)
- **Member Database Integration**: Tools for importing existing chamber member lists
- **Dues Collection Platform**: Integrated payment processing (2-3% fee)
- **Chamber Admin Dashboard**: Management interface for chamber administrators

### B2B Business Promotion
- **Business Highlighting**: Paid promotion in feeds and directory ($25-100/month)
- **Premium Business Profiles**: Enhanced listing features for paying businesses
- **Sponsored Content**: Non-intrusive promotion system for B2B context
- **Directory Advertisement**: Premium placement in search results

### B2B Referral Network
- **Cross-Business Recommendations**: Companies recommend trusted partners
- **Referral Code System**: Personalized tracking codes for each business
- **Commission Payouts**: Automated payments for successful referrals (2-5%)
- **Referral Analytics**: Track success rates and business relationships

### Business Profile Management
- **Profile Claiming**: Owners can claim pre-populated business listings
- **Verification System**: Document upload and validation process
- **Ownership Transfer**: Tools for transferring profile ownership

### Market Opportunity
- **Target Market**: 7,000+ Chambers of Commerce in US
- **Average Chamber Size**: 100-500 members each
- **Revenue Potential**: $50K-500K monthly at scale
- **High-Value B2B Transactions**: Significant referral commission potential

## 📊 File Size Analysis (Rule #1 Compliance)

### Large Files Requiring Attention:
- `app/(tabs)/index.tsx`: **305 lines** ⚠️ (approaching 450-line limit)
- `app/(tabs)/feed.tsx`: **204 lines** ✅
- `app/(tabs)/directory.tsx`: **215 lines** ✅
- `app/(tabs)/profile.tsx`: **191 lines** ✅
- `utils/auth.tsx`: **227 lines** ✅
- `utils/data.ts`: **312 lines** ✅

### Components Analysis:
- `components/ui/Button.tsx`: **167 lines** ✅
- `components/feed/PostCard.tsx`: **179 lines** ✅
- Most component files are well under the 500-line limit

## 🗄️ Database Schema

### Current Implementation
```sql
profiles (
  id uuid PRIMARY KEY,           -- References auth.users
  username text UNIQUE,
  email text UNIQUE,
  full_name text,
  title text,
  company text,
  bio text,
  phone text,
  linkedin text,
  chamber_id text,
  avatar_url text,
  created_at timestamptz,
  updated_at timestamptz
)
```

### Planned Business Model Tables
```sql
-- Chamber management and subscriptions
chambers (id, name, location, subscription_tier, billing_info)
chamber_subscriptions (id, chamber_id, plan_type, status, billing_cycle)

-- Business profiles and claiming
businesses (id, chamber_id, owner_id, claimed_status, verification_status)
business_claims (id, business_id, user_id, claim_status, documents)

-- Referral network system
referrals (id, referrer_id, referred_business_id, status, commission_rate)
referral_payouts (id, referral_id, amount, status, payout_date)

-- Promotion and highlighting
business_promotions (id, business_id, promotion_type, start_date, end_date)
sponsored_content (id, content_id, business_id, budget, impressions)
```

## 🎨 Design System

### Typography
- **Primary**: Inter (Regular, Medium, SemiBold)
- **Display**: Poppins (SemiBold, Bold)

### Color Palette
- **Primary**: #2563EB (Blue)
- **Secondary**: #FFFFFF (White)
- **Danger**: #DC2626 (Red)
- **Warning**: #D97706 (Orange)
- **Success**: #0D9488 (Teal)
- **Background**: #F9FAFB (Light Gray)

### Component System
- Consistent Button variants (primary, secondary, outline, danger)
- Card-based layouts for content display
- Standardized spacing and typography scales

## 📱 Navigation Structure

```
Root Stack Navigator
├── Landing Screen (Onboarding)
├── Auth Stack
│   ├── Login
│   ├── Register
│   └── Chamber Selection
├── Tab Navigator (Main App)
│   ├── Home (Dashboard)
│   ├── Feed (Social Content)
│   ├── Directory (Business Listings)
│   ├── Messages (Chat) - Auth Required
│   └── Profile (User Management)
└── Modal Stack (Overlays)
    ├── Create Post
    ├── Business Claiming
    ├── Referral Management
    └── Payment/Subscription
```

## 🔧 Configuration Files

### Key Configurations
- `app.json`: Expo configuration (needs name update from "bolt-expo-nativewind")
- `tsconfig.json`: TypeScript with strict mode enabled
- `.prettierrc`: Code formatting rules
- `package.json`: Dependencies and scripts

## 🚀 Development Status

### Implemented ✅
- Complete authentication flow
- Tab navigation system
- Social feed with filtering
- Business directory with search
- User profile management
- Database schema and migrations
- UI component library

### Mock Data Usage ⚠️
- Chamber data is currently hardcoded
- Business listings use sample data
- Posts are mock data
- Need migration to live Supabase data

### Areas Needing Development 🔨
- Live data integration
- Messaging functionality completion
- Push notifications
- Advanced search and filtering
- Image upload capabilities
- Real-time features

### Business Model Features (Planned) 🎯
- Chamber subscription and billing system
- Business highlighting and promotion tools
- B2B referral network with commission tracking
- Business profile claiming and verification
- Payment processing integration
- Chamber admin dashboard
- Advanced analytics and reporting

## 📋 Compliance with User Rules

### ✅ Rule Compliances
- **File Size**: All files under 450-line threshold
- **Separation of Concerns**: Well-organized component structure
- **Type Safety**: Comprehensive TypeScript implementation
- **Authentication**: Secure Supabase integration

### ⚠️ Areas for Improvement
- Need to create folder-specific `ai.md` and `_change.logs` files
- Missing `/logs/` directory structure (now created)
- Some configuration names need updating (app.json)

## 🎯 Recommendations

### Immediate Actions
1. Update `app.json` name from "bolt-expo-nativewind" to "chamber-connect"
2. Create `/logs/` directory structure ✅ Complete
3. Implement live data integration with Supabase
4. Complete messaging system functionality

### Business Model Development
1. Design chamber subscription and onboarding workflows
2. Implement business highlighting and promotion systems
3. Build B2B referral network with commission tracking
4. Create business profile claiming and verification process
5. Integrate payment processing (Stripe/PayPal)
6. Develop chamber admin dashboard

### Future Enhancements
1. Add push notification system
2. Implement real-time messaging and updates
3. Add image upload for profiles and businesses
4. Create advanced analytics and reporting
5. Add event calendar functionality
6. Implement AI-powered business recommendation engine

## 📈 Project Health Score: 8.5/10

**Strengths**: Well-structured architecture, comprehensive type system, modern tech stack, good separation of concerns, strong revenue model potential

**Areas for Growth**: Live data integration, messaging completion, configuration updates, business model feature implementation

**Market Potential**: Excellent - addresses clear market need with multiple monetization opportunities in underserved B2B chamber space 