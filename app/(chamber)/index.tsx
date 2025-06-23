import React, { useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  RefreshControl, 
  Pressable,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../utils/auth';
import { useChamberStore } from '../../stores/chamber.store';
import { Card } from '../../components/ui/Card';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Plus,
  UserPlus,
  CalendarPlus,
  Settings,
  BarChart3
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function ChamberDashboard() {
  const { currentChamber } = useAuth();
  const { 
    stats, 
    isLoading, 
    error, 
    fetchStats, 
    refreshStats, 
    clearError 
  } = useChamberStore();

  useEffect(() => {
    if (currentChamber?.id) {
      fetchStats(currentChamber.id);
    }
  }, [currentChamber?.id]);

  const handleRefresh = async () => {
    if (currentChamber?.id) {
      await refreshStats(currentChamber.id);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'addMember':
        router.push('/(chamber)/members/add');
        break;
      case 'createEvent':
        router.push('/(chamber)/events/create');
        break;
      case 'viewMembers':
        router.push('/(chamber)/members');
        break;
      case 'viewEvents':
        router.push('/(chamber)/events');
        break;
      case 'viewAnalytics':
        router.push('/(chamber)/analytics');
        break;
      case 'settings':
        router.push('/(chamber)/settings');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature is being developed.');
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading dashboard data</Text>
          <Text style={styles.errorDetail}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={() => { clearError(); handleRefresh(); }}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeSubtitle}>
            Here's what's happening with {currentChamber?.name}
          </Text>
        </View>

        {/* Stats Cards */}
        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <Pressable 
                style={[styles.statCard, styles.statCardHalf]}
                onPress={() => handleQuickAction('viewMembers')}
              >
                <View style={styles.statCardHeader}>
                  <Users size={24} color="#3B82F6" />
                </View>
                <Text style={styles.statNumber}>{stats.total_members}</Text>
                <Text style={styles.statLabel}>Total Members</Text>
                <Text style={styles.statSubtext}>
                  {stats.active_members} active
                </Text>
              </Pressable>

              <Pressable 
                style={[styles.statCard, styles.statCardHalf]}
                onPress={() => handleQuickAction('viewEvents')}
              >
                <View style={styles.statCardHeader}>
                  <Calendar size={24} color="#10B981" />
                </View>
                <Text style={styles.statNumber}>{stats.upcoming_events}</Text>
                <Text style={styles.statLabel}>Upcoming Events</Text>
                <Text style={styles.statSubtext}>
                  {stats.total_events} total
                </Text>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <Pressable 
                style={[styles.statCard, styles.statCardHalf]}
                onPress={() => handleQuickAction('viewAnalytics')}
              >
                <View style={styles.statCardHeader}>
                  <DollarSign size={24} color="#F59E0B" />
                </View>
                <Text style={styles.statNumber}>
                  ${stats.membership_revenue.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Revenue</Text>
                <Text style={styles.statSubtext}>
                  This month
                </Text>
              </Pressable>

              <Pressable 
                style={[styles.statCard, styles.statCardHalf]}
                onPress={() => handleQuickAction('viewAnalytics')}
              >
                <View style={styles.statCardHeader}>
                  <TrendingUp size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.statNumber}>
                  {Math.round(stats.engagement_rate)}%
                </Text>
                <Text style={styles.statLabel}>Engagement</Text>
                <Text style={styles.statSubtext}>
                  {stats.monthly_new_members} new this month
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <Pressable 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('addMember')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#EBF5FF' }]}>
                <UserPlus size={24} color="#3B82F6" />
              </View>
              <Text style={styles.quickActionText}>Add Member</Text>
            </Pressable>

            <Pressable 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('createEvent')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#ECFDF5' }]}>
                <CalendarPlus size={24} color="#10B981" />
              </View>
              <Text style={styles.quickActionText}>Create Event</Text>
            </Pressable>

            <Pressable 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('viewAnalytics')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FDF4FF' }]}>
                <BarChart3 size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.quickActionText}>View Reports</Text>
            </Pressable>

            <Pressable 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('settings')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Settings size={24} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
            </Pressable>
          </View>
        </View>

        {/* Recent Activity Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <Text style={styles.activityText}>
              Activity feed coming soon...
            </Text>
            <Text style={styles.activitySubtext}>
              Track member actions, event registrations, and chamber updates here.
            </Text>
          </Card>
        </View>
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
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  welcomeSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsGrid: {
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statCardHalf: {
    flex: 1,
  },
  statCardHeader: {
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  activityCard: {
    padding: 20,
  },
  activityText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 4,
  },
  activitySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
}); 