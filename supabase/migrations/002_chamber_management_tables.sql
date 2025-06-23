-- Chamber Management Mobile-Optimized Tables
-- Migration for chamber management functionality

-- Update chamber_admins table
DROP TABLE IF EXISTS chamber_admins;
CREATE TABLE chamber_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chamber_id UUID REFERENCES chambers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin', -- 'owner', 'admin', 'moderator', 'editor'
    permissions JSONB DEFAULT '{"members": true, "events": true, "settings": false}',
    mobile_permissions JSONB DEFAULT '{"push_notifications": true, "offline_access": true}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(chamber_id, user_id)
);

-- Create chamber_settings table for mobile configuration
DROP TABLE IF EXISTS chamber_settings;
CREATE TABLE chamber_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chamber_id UUID REFERENCES chambers(id) ON DELETE CASCADE,
    mobile_theme JSONB DEFAULT '{"primary_color": "#3B82F6", "dark_mode": false}',
    notification_settings JSONB DEFAULT '{"push_enabled": true, "email_enabled": true, "member_updates": true, "event_reminders": true}',
    feature_flags JSONB DEFAULT '{"analytics": true, "events": true, "messaging": true, "advanced_reporting": true}',
    business_settings JSONB DEFAULT '{"business_hours": {}, "contact_info": {}}',
    settings JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(chamber_id)
);

-- Update members table to align with mobile interface
ALTER TABLE members ALTER COLUMN chamber_id TYPE UUID USING chamber_id::UUID;
ALTER TABLE members ADD COLUMN IF NOT EXISTS membership_tier VARCHAR DEFAULT 'standard';
ALTER TABLE members ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE members ADD COLUMN IF NOT EXISTS mobile_preferences JSONB DEFAULT '{"notifications": true, "location_sharing": false}';

-- Update profiles table to use UUID for chamber_id
ALTER TABLE profiles ALTER COLUMN chamber_id TYPE UUID USING chamber_id::UUID;
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_chamber FOREIGN KEY (chamber_id) REFERENCES chambers(id);

-- Create indexes for mobile performance
CREATE INDEX IF NOT EXISTS idx_chamber_admins_user_chamber ON chamber_admins(user_id, chamber_id);
CREATE INDEX IF NOT EXISTS idx_chamber_admins_role ON chamber_admins(role);
CREATE INDEX IF NOT EXISTS idx_chamber_settings_chamber_id ON chamber_settings(chamber_id);
CREATE INDEX IF NOT EXISTS idx_members_chamber_status ON members(chamber_id, membership_status);
CREATE INDEX IF NOT EXISTS idx_members_search ON members USING GIN (to_tsvector('english', business_name || ' ' || contact_name || ' ' || COALESCE(email, '')));
CREATE INDEX IF NOT EXISTS idx_members_category ON members(category);
CREATE INDEX IF NOT EXISTS idx_members_membership_type ON members(membership_type);
CREATE INDEX IF NOT EXISTS idx_events_chamber_status ON events(chamber_id, status);
CREATE INDEX IF NOT EXISTS idx_events_date_range ON events(chamber_id, event_date);

-- Row Level Security Policies for mobile app

-- Chamber admins policies
CREATE POLICY "Chamber admins can view their admin records" ON chamber_admins 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Chamber owners can manage admins" ON chamber_admins 
  FOR ALL USING (
    chamber_id IN (
      SELECT chamber_id FROM chamber_admins 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Chamber settings policies
CREATE POLICY "Chamber admins can view settings" ON chamber_settings 
  FOR SELECT USING (
    chamber_id IN (
      SELECT chamber_id FROM chamber_admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Chamber admins can update settings" ON chamber_settings 
  FOR UPDATE USING (
    chamber_id IN (
      SELECT chamber_id FROM chamber_admins 
      WHERE user_id = auth.uid() AND (
        permissions->>'settings' = 'true' OR role IN ('owner', 'admin')
      )
    )
  );

-- Enhanced members policies for mobile
DROP POLICY IF EXISTS "Members are viewable by chamber admins and members" ON members;
CREATE POLICY "Members are viewable by chamber admins and members" ON members 
  FOR SELECT USING (
    chamber_id IN (
      SELECT chamber_id FROM chamber_admins WHERE user_id = auth.uid()
    ) OR 
    chamber_id IN (
      SELECT chamber_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Chamber admins can manage members" ON members;
CREATE POLICY "Chamber admins can manage members" ON members 
  FOR ALL USING (
    chamber_id IN (
      SELECT chamber_id FROM chamber_admins 
      WHERE user_id = auth.uid() AND (
        permissions->>'members' = 'true' OR role IN ('owner', 'admin')
      )
    )
  );

-- Enhanced events policies
DROP POLICY IF EXISTS "Events are viewable by chamber members" ON events;
CREATE POLICY "Events are viewable by chamber members" ON events 
  FOR SELECT USING (
    chamber_id IN (
      SELECT chamber_id FROM chamber_admins WHERE user_id = auth.uid()
    ) OR 
    chamber_id IN (
      SELECT chamber_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Chamber admins can manage events" ON events 
  FOR ALL USING (
    chamber_id IN (
      SELECT chamber_id FROM chamber_admins 
      WHERE user_id = auth.uid() AND (
        permissions->>'events' = 'true' OR role IN ('owner', 'admin')
      )
    )
  );

-- Function to update last_active for chamber admins
CREATE OR REPLACE FUNCTION update_chamber_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chamber_admins 
  SET last_active = NOW() 
  WHERE user_id = auth.uid() AND chamber_id = NEW.chamber_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update admin activity
CREATE OR REPLACE TRIGGER update_admin_activity_trigger
  AFTER INSERT OR UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_chamber_admin_activity();

-- Function to get chamber admin status
CREATE OR REPLACE FUNCTION get_chamber_admin_status(chamber_uuid UUID)
RETURNS TABLE (
  is_admin BOOLEAN,
  role VARCHAR,
  permissions JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (ca.id IS NOT NULL) as is_admin,
    ca.role,
    ca.permissions
  FROM chamber_admins ca
  WHERE ca.chamber_id = chamber_uuid AND ca.user_id = auth.uid()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get chamber statistics (mobile-optimized)
CREATE OR REPLACE FUNCTION get_chamber_stats(chamber_uuid UUID)
RETURNS TABLE (
  total_members INTEGER,
  active_members INTEGER,
  pending_members INTEGER,
  total_events INTEGER,
  upcoming_events INTEGER,
  monthly_new_members INTEGER,
  membership_revenue DECIMAL,
  event_revenue DECIMAL,
  engagement_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM members WHERE chamber_id = chamber_uuid),
    (SELECT COUNT(*)::INTEGER FROM members WHERE chamber_id = chamber_uuid AND membership_status = 'active'),
    (SELECT COUNT(*)::INTEGER FROM members WHERE chamber_id = chamber_uuid AND membership_status = 'pending'),
    (SELECT COUNT(*)::INTEGER FROM events WHERE chamber_id = chamber_uuid),
    (SELECT COUNT(*)::INTEGER FROM events WHERE chamber_id = chamber_uuid AND status = 'upcoming'),
    (SELECT COUNT(*)::INTEGER FROM members WHERE chamber_id = chamber_uuid AND created_at >= (CURRENT_DATE - INTERVAL '30 days')),
    (SELECT COALESCE(SUM(dues_amount), 0) FROM members WHERE chamber_id = chamber_uuid AND membership_status = 'active'),
    (SELECT COALESCE(SUM(price * current_attendees), 0) FROM events WHERE chamber_id = chamber_uuid),
    (SELECT 
      CASE 
        WHEN COUNT(*) > 0 THEN 
          (COUNT(*) FILTER (WHERE membership_status = 'active')::DECIMAL / COUNT(*)::DECIMAL) * 100
        ELSE 0 
      END
      FROM members WHERE chamber_id = chamber_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 