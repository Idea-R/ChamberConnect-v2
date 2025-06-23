import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useChamberStore } from '../../../stores/chamber.store';
import { useAuth } from '../../../utils/auth';
import {
  ArrowLeft,
  ChevronRight,
  Users,
  Bell,
  Palette,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Settings as SettingsIcon,
  Info,
  HelpCircle,
  LogOut,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { currentChamber } = useAuth();
  const { settings, fetchSettings, updateSettings, isLoading } = useChamberStore();
  
  const [localSettings, setLocalSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    memberUpdates: true,
    eventReminders: true,
    darkMode: false,
    analyticsEnabled: true,
    eventsEnabled: true,
    messagingEnabled: true,
  });

  useEffect(() => {
    if (currentChamber?.id) {
      fetchSettings(currentChamber.id);
    }
  }, [currentChamber?.id]);

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        pushNotifications: settings.notification_settings?.push_enabled ?? true,
        emailNotifications: settings.notification_settings?.email_enabled ?? true,
        memberUpdates: settings.notification_settings?.member_updates ?? true,
        eventReminders: settings.notification_settings?.event_reminders ?? true,
        darkMode: settings.mobile_theme?.dark_mode ?? false,
        analyticsEnabled: settings.feature_flags?.analytics ?? true,
        eventsEnabled: settings.feature_flags?.events ?? true,
        messagingEnabled: settings.feature_flags?.messaging ?? true,
      });
    }
  }, [settings]);

  const handleSettingChange = async (key: string, value: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    
    // Update settings in the backend
    try {
      const updatedSettings = {
        notification_settings: {
          push_enabled: key === 'pushNotifications' ? value : localSettings.pushNotifications,
          email_enabled: key === 'emailNotifications' ? value : localSettings.emailNotifications,
          member_updates: key === 'memberUpdates' ? value : localSettings.memberUpdates,
          event_reminders: key === 'eventReminders' ? value : localSettings.eventReminders,
        },
        mobile_theme: {
          primary_color: settings?.mobile_theme?.primary_color || '#3B82F6',
          dark_mode: key === 'darkMode' ? value : localSettings.darkMode,
        },
        feature_flags: {
          analytics: key === 'analyticsEnabled' ? value : localSettings.analyticsEnabled,
          events: key === 'eventsEnabled' ? value : localSettings.eventsEnabled,
          messaging: key === 'messagingEnabled' ? value : localSettings.messagingEnabled,
          advanced_reporting: settings?.feature_flags?.advanced_reporting ?? true,
        },
      };
      
      await updateSettings(updatedSettings);
    } catch (error) {
      // Revert the local change if the update failed
      setLocalSettings(prev => ({ ...prev, [key]: !value }));
      Alert.alert('Error', 'Failed to update setting. Please try again.');
    }
  };

  const settingSections = [
    {
      title: 'Chamber Management',
      items: [
        {
          icon: <Users size={20} color="#3B82F6" />,
          title: 'Permissions & Roles',
          subtitle: 'Manage admin access and permissions',
          onPress: () => router.push('/(chamber)/settings/permissions'),
        },
        {
          icon: <Globe size={20} color="#10B981" />,
          title: 'Chamber Profile',
          subtitle: 'Update chamber information and branding',
          onPress: () => Alert.alert('Coming Soon', 'Chamber profile editing will be available soon.'),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: <Bell size={20} color="#F59E0B" />,
          title: 'Push Notifications',
          subtitle: 'Receive mobile notifications',
          toggle: true,
          value: localSettings.pushNotifications,
          onToggle: (value: boolean) => handleSettingChange('pushNotifications', value),
        },
        {
          icon: <Mail size={20} color="#8B5CF6" />,
          title: 'Email Notifications',
          subtitle: 'Receive email updates',
          toggle: true,
          value: localSettings.emailNotifications,
          onToggle: (value: boolean) => handleSettingChange('emailNotifications', value),
        },
        {
          icon: <Users size={20} color="#EF4444" />,
          title: 'Member Updates',
          subtitle: 'Notifications about member activities',
          toggle: true,
          value: localSettings.memberUpdates,
          onToggle: (value: boolean) => handleSettingChange('memberUpdates', value),
        },
        {
          icon: <Bell size={20} color="#06B6D4" />,
          title: 'Event Reminders',
          subtitle: 'Reminders for upcoming events',
          toggle: true,
          value: localSettings.eventReminders,
          onToggle: (value: boolean) => handleSettingChange('eventReminders', value),
        },
      ],
    },
    {
      title: 'Features',
      items: [
        {
          icon: <SettingsIcon size={20} color="#6B7280" />,
          title: 'Analytics Dashboard',
          subtitle: 'View chamber performance metrics',
          toggle: true,
          value: localSettings.analyticsEnabled,
          onToggle: (value: boolean) => handleSettingChange('analyticsEnabled', value),
        },
        {
          icon: <SettingsIcon size={20} color="#6B7280" />,
          title: 'Events Management',
          subtitle: 'Create and manage chamber events',
          toggle: true,
          value: localSettings.eventsEnabled,
          onToggle: (value: boolean) => handleSettingChange('eventsEnabled', value),
        },
        {
          icon: <SettingsIcon size={20} color="#6B7280" />,
          title: 'Member Messaging',
          subtitle: 'Communication between members',
          toggle: true,
          value: localSettings.messagingEnabled,
          onToggle: (value: boolean) => handleSettingChange('messagingEnabled', value),
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: <Palette size={20} color="#EC4899" />,
          title: 'Dark Mode',
          subtitle: 'Use dark theme throughout the app',
          toggle: true,
          value: localSettings.darkMode,
          onToggle: (value: boolean) => handleSettingChange('darkMode', value),
        },
        {
          icon: <Palette size={20} color="#F97316" />,
          title: 'Theme & Branding',
          subtitle: 'Customize colors and appearance',
          onPress: () => router.push('/(chamber)/settings/appearance'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <Info size={20} color="#6B7280" />,
          title: 'About',
          subtitle: 'App version and information',
          onPress: () => Alert.alert('ChamberConnect', 'Version 1.0.0\n\nBuilt for chamber management excellence.'),
        },
        {
          icon: <HelpCircle size={20} color="#6B7280" />,
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          onPress: () => Alert.alert('Help & Support', 'For support, please contact:\nsupport@chamberconnect.com'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => (
    <Pressable
      key={index}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.toggle}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIcon}>
          {item.icon}
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      
      <View style={styles.settingItemRight}>
        {item.toggle ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={item.value ? '#3B82F6' : '#f4f3f4'}
          />
        ) : (
          <ChevronRight size={16} color="#9CA3AF" />
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#666" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Chamber Info */}
        <View style={styles.chamberInfo}>
          <Text style={styles.chamberName}>{currentChamber?.name}</Text>
          <Text style={styles.chamberSubtitle}>Chamber Settings & Configuration</Text>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable 
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Backup', 'Chamber data backup feature coming soon.')}
          >
            <Text style={styles.quickActionText}>Backup Data</Text>
          </Pressable>
          
          <Pressable 
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Export', 'Data export feature coming soon.')}
          >
            <Text style={styles.quickActionText}>Export Data</Text>
          </Pressable>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>ChamberConnect v1.0.0</Text>
          <Text style={styles.appInfoSubtext}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  chamberInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  chamberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  chamberSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingItemRight: {
    marginLeft: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickActionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  appInfoSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
}); 