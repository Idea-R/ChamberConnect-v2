import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/utils/auth';
import { Building2, User, Settings, LogOut } from 'lucide-react-native';
import { CompanyProfile } from '@/components/profile/CompanyProfile';
import { PersonalProfile } from '@/components/profile/PersonalProfile';
import { GuestProfile } from '@/components/profile/GuestProfile';

type ProfileTab = 'personal' | 'business';

export default function ProfileScreen() {
  const { tab } = useLocalSearchParams<{ tab?: ProfileTab }>();
  const { user, signOut, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>(tab as ProfileTab || 'personal');
  
  if (!isAuthenticated) {
    return <GuestProfile />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Pressable style={styles.settingsButton}>
          <Settings size={24} color="#1F2937" />
        </Pressable>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        
        <View style={styles.tabs}>
          <Pressable 
            style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
            onPress={() => setActiveTab('personal')}
          >
            <User size={20} color={activeTab === 'personal' ? '#2563EB' : '#6B7280'} />
            <Text 
              style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}
            >
              Personal
            </Text>
          </Pressable>
          
          <Pressable 
            style={[styles.tab, activeTab === 'business' && styles.activeTab]}
            onPress={() => setActiveTab('business')}
          >
            <Building2 size={20} color={activeTab === 'business' ? '#2563EB' : '#6B7280'} />
            <Text 
              style={[styles.tabText, activeTab === 'business' && styles.activeTabText]}
            >
              Business
            </Text>
          </Pressable>
        </View>
        
        <View style={styles.profileContent}>
          {activeTab === 'personal' ? (
            <PersonalProfile />
          ) : (
            <CompanyProfile />
          )}
        </View>
        
                    <Pressable style={styles.logoutButton} onPress={signOut}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1F2937',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#2563EB',
  },
  profileContent: {
    padding: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#DC2626',
    marginLeft: 8,
  },
});