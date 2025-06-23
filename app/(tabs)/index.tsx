import { StyleSheet, View, Text, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/utils/auth';
import { Megaphone, Calendar, Users, User, Building2, Bell } from 'lucide-react-native';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { RecentPostCard } from '@/components/feed/RecentPostCard';
import { posts } from '@/utils/data';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, currentChamber } = useAuth();
  
  // Filter to show only the 3 most recent posts
  const recentPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              {isAuthenticated ? `Welcome, ${user?.username}` : 'Welcome, Guest'}
            </Text>
            <Text style={styles.chamberText}>
              {currentChamber?.name || 'Select a Chamber'}
            </Text>
          </View>
          {isAuthenticated && (
            <Pressable style={styles.notificationButton}>
              <Bell size={24} color="#1F2937" />
              <View style={styles.notificationDot} />
            </Pressable>
          )}
        </View>
        
        {isAuthenticated ? (
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <Pressable style={styles.actionButton} onPress={() => router.push('/(modals)/create-post')}>
                <View style={[styles.actionIcon, { backgroundColor: '#EBF5FF' }]}>
                  <Megaphone size={24} color="#2563EB" />
                </View>
                <Text style={styles.actionText}>Create Post</Text>
              </Pressable>
              
              <Pressable style={styles.actionButton} onPress={() => router.push('/feed')}>
                <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Calendar size={24} color="#D97706" />
                </View>
                <Text style={styles.actionText}>Events</Text>
              </Pressable>
              
              <Pressable style={styles.actionButton} onPress={() => router.push('/directory')}>
                <View style={[styles.actionIcon, { backgroundColor: '#DEF7EC' }]}>
                  <Building2 size={24} color="#0D9488" />
                </View>
                <Text style={styles.actionText}>Directory</Text>
              </Pressable>
              
              <Pressable style={styles.actionButton} onPress={() => router.push('/messages')}>
                <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Users size={24} color="#DC2626" />
                </View>
                <Text style={styles.actionText}>Messages</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Card style={styles.guestCard}>
            <Text style={styles.guestCardTitle}>Join Your Local Chamber</Text>
            <Text style={styles.guestCardText}>
              Create an account to connect with local businesses, participate in events, and grow your network.
            </Text>
            <Pressable 
              style={styles.guestCardButton}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.guestCardButtonText}>Sign Up Now</Text>
            </Pressable>
          </Card>
        )}
        
        <View style={styles.recentActivity}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable onPress={() => router.push('/feed')}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          
          {recentPosts.map(post => (
            <RecentPostCard key={post.id} post={post} />
          ))}
        </View>
        
        {isAuthenticated && (
          <View style={styles.yourProfiles}>
            <Text style={styles.sectionTitle}>Your Profiles</Text>
            
            <Pressable style={styles.profileCard} onPress={() => router.push('/profile?tab=personal')}>
              <View style={styles.profileCardContent}>
                <View style={styles.profileIcon}>
                  <User size={24} color="#2563EB" />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileTitle}>Personal Profile</Text>
                  <Text style={styles.profileSubtitle}>Manage your personal details</Text>
                </View>
              </View>
              <Badge text="Active" variant="success" />
            </Pressable>
            
            <Pressable style={styles.profileCard} onPress={() => router.push('/profile?tab=business')}>
              <View style={styles.profileCardContent}>
                <View style={styles.profileIcon}>
                  <Building2 size={24} color="#2563EB" />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileTitle}>Business Profile</Text>
                  <Text style={styles.profileSubtitle}>Manage your business details</Text>
                </View>
              </View>
              <Badge text="Setup Needed" variant="warning" />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  welcomeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
  },
  chamberText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  recentActivity: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2563EB',
  },
  yourProfiles: {
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  profileSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  guestCard: {
    padding: 16,
    marginBottom: 24,
  },
  guestCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  guestCardText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  guestCardButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestCardButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});