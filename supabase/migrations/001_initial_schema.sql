-- ChamberConnect Initial Database Schema
-- Created for chamber event demo preparation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chambers table
CREATE TABLE chambers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  phone VARCHAR,
  email VARCHAR,
  website VARCHAR,
  logo_url VARCHAR,
  primary_color VARCHAR DEFAULT '#3B82F6',
  secondary_color VARCHAR DEFAULT '#10B981',
  membership_tiers JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chamber admins table
CREATE TABLE chamber_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chamber_id UUID REFERENCES chambers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chamber_id UUID REFERENCES chambers(id) ON DELETE CASCADE,
  business_name VARCHAR NOT NULL,
  contact_name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  address TEXT,
  website VARCHAR,
  category VARCHAR,
  description TEXT,
  logo_url VARCHAR,
  membership_status VARCHAR DEFAULT 'active',
  membership_type VARCHAR DEFAULT 'standard',
  membership_level VARCHAR DEFAULT 'basic',
  joined_date DATE DEFAULT CURRENT_DATE,
  renewal_date DATE,
  dues_amount DECIMAL(10,2),
  payment_status VARCHAR DEFAULT 'current',
  tags TEXT[],
  social_media JSONB DEFAULT '{}',
  business_hours JSONB DEFAULT '{}',
  services TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chamber_id UUID REFERENCES chambers(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  address TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  event_type VARCHAR DEFAULT 'networking',
  price DECIMAL(10,2) DEFAULT 0,
  image_url VARCHAR,
  status VARCHAR DEFAULT 'upcoming',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations table
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attendance_status VARCHAR DEFAULT 'registered',
  notes TEXT
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chamber_id UUID REFERENCES chambers(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR,
  content TEXT NOT NULL,
  message_type VARCHAR DEFAULT 'direct',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chamber announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chamber_id UUID REFERENCES chambers(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  announcement_type VARCHAR DEFAULT 'general',
  priority VARCHAR DEFAULT 'normal',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business categories lookup table
CREATE TABLE business_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR,
  parent_id UUID REFERENCES business_categories(id),
  sort_order INTEGER DEFAULT 0
);

-- Insert default business categories
INSERT INTO business_categories (name, slug, description, icon) VALUES
('Automotive', 'automotive', 'Car dealerships, repair shops, auto services', 'car'),
('Dining & Food', 'dining-food', 'Restaurants, cafes, catering, food services', 'utensils'),
('Health & Wellness', 'health-wellness', 'Healthcare providers, fitness, wellness services', 'heart'),
('Professional Services', 'professional-services', 'Legal, accounting, consulting, real estate', 'briefcase'),
('Retail & Shopping', 'retail-shopping', 'Stores, boutiques, retail businesses', 'shopping-bag'),
('Technology', 'technology', 'IT services, software, tech companies', 'laptop'),
('Construction & Trades', 'construction-trades', 'Contractors, builders, trade services', 'hammer'),
('Financial Services', 'financial-services', 'Banks, insurance, financial advisors', 'dollar-sign'),
('Education', 'education', 'Schools, training, educational services', 'graduation-cap'),
('Entertainment & Recreation', 'entertainment-recreation', 'Entertainment venues, recreation services', 'music'),
('Non-Profit', 'non-profit', 'Non-profit organizations, charities', 'heart-handshake'),
('Manufacturing', 'manufacturing', 'Manufacturing, industrial services', 'factory'),
('Transportation', 'transportation', 'Shipping, logistics, transportation services', 'truck'),
('Beauty & Personal Care', 'beauty-personal-care', 'Salons, spas, personal care services', 'sparkles'),
('Home & Garden', 'home-garden', 'Home improvement, landscaping, garden services', 'home');

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE chambers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamber_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Chambers policies
CREATE POLICY "Chambers are viewable by everyone" ON chambers FOR SELECT USING (true);
CREATE POLICY "Chamber admins can update their chambers" ON chambers FOR UPDATE 
  USING (auth.uid() IN (SELECT user_id FROM chamber_admins WHERE chamber_id = id));

-- Members policies  
CREATE POLICY "Members are viewable by chamber admins and members" ON members FOR SELECT
  USING (
    chamber_id IN (
      SELECT chamber_id FROM chamber_admins WHERE user_id = auth.uid()
    ) OR 
    auth.uid() IN (SELECT user_id FROM auth.users WHERE email = members.email)
  );

CREATE POLICY "Chamber admins can manage members" ON members FOR ALL
  USING (chamber_id IN (SELECT chamber_id FROM chamber_admins WHERE user_id = auth.uid()));

-- Events policies
CREATE POLICY "Events are viewable by chamber members" ON events FOR SELECT
  USING (
    chamber_id IN (
      SELECT chamber_id FROM chamber_admins WHERE user_id = auth.uid()
      UNION
      SELECT chamber_id FROM members WHERE email IN (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_chambers_updated_at BEFORE UPDATE ON chambers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_chambers_slug ON chambers(slug);
CREATE INDEX idx_members_chamber_id ON members(chamber_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_category ON members(category);
CREATE INDEX idx_events_chamber_id ON events(chamber_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_chamber_admins_user_id ON chamber_admins(user_id);
CREATE INDEX idx_chamber_admins_chamber_id ON chamber_admins(chamber_id); 