# ChamberConnect

A React Native mobile application for local Chambers of Commerce, built with Expo Router and Supabase.

## 🏢 Overview

ChamberConnect is a digital platform designed to facilitate networking, business discovery, event management, and community engagement for chamber of commerce members. The app provides a modern, mobile-first experience for local business communities.

## ✨ Features

### Core Functionality
- **🔐 Authentication**: Secure login with email/password and Google OAuth
- **🏢 Multi-Chamber Support**: Users can join and switch between different chambers
- **📱 Social Feed**: Post events, updates, and questions with filtering capabilities
- **📋 Business Directory**: Searchable directory with category filtering
- **💬 Messaging**: Private messaging between chamber members
- **👤 Profile Management**: Personal and business profile customization

### User Experience
- **🎨 Modern UI**: Clean, accessible design with consistent theming
- **📱 Mobile Optimized**: Native mobile experience with smooth animations
- **🔍 Advanced Search**: Filter and search across all content types
- **🔔 Real-time Updates**: Live notifications and messaging (planned)

## 🛠️ Technology Stack

- **React Native** 0.79.1 with **React** 19.0.0
- **Expo** 53.0.0 with **Expo Router** 5.0.2
- **TypeScript** for type safety
- **Supabase** for backend services (auth, database, real-time)
- **Zustand** for client-side state management
- **Lucide React Native** for icons
- **Inter & Poppins** fonts via Google Fonts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Idea-R/ChamberConnect.git
   cd ChamberConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Run on device/simulator**
   - iOS: Press `i` in the terminal or scan QR code with Expo Go
   - Android: Press `a` in the terminal or scan QR code with Expo Go

## 📁 Project Structure

```
ChamberConnect/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Main tab navigation
│   ├── (auth)/            # Authentication flows
│   ├── (modals)/          # Modal screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── auth/             # Auth-specific components
│   ├── feed/             # Social feed components
│   └── directory/        # Business directory components
├── lib/                  # Core configurations
├── utils/                # Utilities and helpers
├── supabase/             # Database migrations
├── hooks/                # Custom React hooks
└── assets/               # Static assets
```

## 🗄️ Database Schema

The app uses Supabase with the following main tables:

### Profiles Table
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

*Additional tables for chambers, businesses, posts, and messages are planned.*

## 🎨 Design System

### Colors
- **Primary**: #2563EB (Blue)
- **Secondary**: #FFFFFF (White)  
- **Danger**: #DC2626 (Red)
- **Warning**: #D97706 (Orange)
- **Success**: #0D9488 (Teal)

### Typography
- **Body**: Inter (Regular, Medium, SemiBold)
- **Headings**: Poppins (SemiBold, Bold)

## 🧪 Development Status

### ✅ Implemented
- Complete authentication system
- Tab navigation with 5 main screens
- Social feed with post filtering
- Business directory with search
- User profile management
- Supabase integration with RLS
- Comprehensive TypeScript types

### 🚧 In Progress
- Live data integration (currently using mock data)
- Real-time messaging functionality
- Push notifications
- Image upload capabilities

### 📋 Planned Features
- Event calendar
- Advanced search and filtering
- Admin panel for chamber management
- Analytics and reporting
- Multi-language support

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build:web    # Build for web platform
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please reach out to the development team or create an issue in the GitHub repository.

---

**Built with ❤️ for local business communities**
