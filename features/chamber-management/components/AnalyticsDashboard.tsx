import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnalyticsData {
  overview: {
    total_members: number;
    active_members: number;
    trial_members: number;
    pending_applications: number;
    monthly_revenue: number;
    outstanding_dues: number;
  };
  growth: {
    new_members_this_month: number;
    new_members_last_month: number;
    growth_percentage: number;
    churn_rate: number;
  };
  engagement: {
    active_users_30d: number;
    posts_this_month: number;
    events_this_month: number;
    avg_session_duration: string;
    most_active_day: string;
  };
  financial: {
    total_revenue_ytd: number;
    outstanding_dues: number;
    overdue_count: number;
    payment_success_rate: number;
  };
  member_breakdown: {
    by_type: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
    by_size: Array<{
      size: string;
      count: number;
      percentage: number;
    }>;
  };
  recent_activities: Array<{
    id: string;
    type: 'new_member' | 'payment' | 'event_registration' | 'post_created';
    description: string;
    timestamp: string;
    member_name?: string;
  }>;
  overdue_members: Array<{
    id: string;
    business_name: string;
    contact_person: string;
    email: string;
    phone: string;
    amount_due: number;
    days_overdue: number;
    last_payment_date?: string;
  }>;
}

interface AnalyticsDashboardProps {
  chamberId: string;
  onSendReminder?: (memberId: string) => void;
  onViewMember?: (memberId: string) => void;
  onExportData?: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  chamberId,
  onSendReminder,
  onViewMember,
  onExportData,
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'financial' | 'engagement'>('overview');

  // Mock data - replace with actual API calls
  const mockData: AnalyticsData = {
    overview: {
      total_members: 156,
      active_members: 142,
      trial_members: 8,
      pending_applications: 6,
      monthly_revenue: 15600,
      outstanding_dues: 3200,
    },
    growth: {
      new_members_this_month: 12,
      new_members_last_month: 8,
      growth_percentage: 50,
      churn_rate: 2.1,
    },
    engagement: {
      active_users_30d: 98,
      posts_this_month: 45,
      events_this_month: 6,
      avg_session_duration: '12m 34s',
      most_active_day: 'Wednesday',
    },
    financial: {
      total_revenue_ytd: 187200,
      outstanding_dues: 3200,
      overdue_count: 4,
      payment_success_rate: 94.2,
    },
    member_breakdown: {
      by_type: [
        { type: 'Full Members', count: 142, percentage: 91.0 },
        { type: 'Trial Members', count: 8, percentage: 5.1 },
        { type: 'Pending', count: 6, percentage: 3.9 },
      ],
      by_size: [
        { size: 'Small (1-10)', count: 89, percentage: 57.1 },
        { size: 'Medium (11-50)', count: 52, percentage: 33.3 },
        { size: 'Large (50+)', count: 15, percentage: 9.6 },
      ],
    },
    recent_activities: [
      {
        id: '1',
        type: 'new_member',
        description: 'New member application approved',
        timestamp: '2025-01-15T10:30:00Z',
        member_name: 'Tech Solutions Inc.',
      },
      {
        id: '2',
        type: 'payment',
        description: 'Monthly dues payment received',
        timestamp: '2025-01-15T09:15:00Z',
        member_name: 'Local Restaurant',
      },
      {
        id: '3',
        type: 'event_registration',
        description: 'Registered for Business Mixer',
        timestamp: '2025-01-14T16:45:00Z',
        member_name: 'Marketing Agency',
      },
    ],
    overdue_members: [
      {
        id: '1',
        business_name: 'ABC Consulting',
        contact_person: 'John Smith',
        email: 'john@abcconsulting.com',
        phone: '(555) 123-4567',
        amount_due: 100,
        days_overdue: 15,
        last_payment_date: '2024-11-15',
      },
      {
        id: '2',
        business_name: 'XYZ Services',
        contact_person: 'Jane Doe',
        email: 'jane@xyzservices.com',
        phone: '(555) 987-6543',
        amount_due: 200,
        days_overdue: 32,
        last_payment_date: '2024-10-30',
      },
    ],
  };

  useEffect(() => {
    loadData();
  }, [chamberId]);

  const loadData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_member': return 'person-add';
      case 'payment': return 'card';
      case 'event_registration': return 'calendar';
      case 'post_created': return 'create';
      default: return 'information-circle';
    }
  };

  const renderMetricCard = (title: string, value: string | number, subtitle?: string, trend?: number, icon?: string) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        {icon && <Ionicons name={icon as any} size={20} color="#007AFF" />}
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
      {trend !== undefined && (
        <View style={[styles.trendContainer, trend >= 0 ? styles.trendPositive : styles.trendNegative]}>
          <Ionicons 
            name={trend >= 0 ? "trending-up" : "trending-down"} 
            size={12} 
            color={trend >= 0 ? "#28a745" : "#dc3545"} 
          />
          <Text style={[styles.trendText, trend >= 0 ? styles.trendPositiveText : styles.trendNegativeText]}>
            {Math.abs(trend)}%
          </Text>
        </View>
      )}
    </View>
  );

  const renderOverview = () => {
    if (!data) return null;

    return (
      <View style={styles.tabContent}>
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Total Members', 
            data.overview.total_members, 
            `${data.overview.active_members} active`,
            data.growth.growth_percentage,
            'people'
          )}
          {renderMetricCard(
            'Monthly Revenue', 
            formatCurrency(data.overview.monthly_revenue), 
            'This month',
            undefined,
            'cash'
          )}
          {renderMetricCard(
            'Outstanding Dues', 
            formatCurrency(data.overview.outstanding_dues), 
            `${data.financial.overdue_count} overdue`,
            undefined,
            'warning'
          )}
          {renderMetricCard(
            'Pending Applications', 
            data.overview.pending_applications, 
            'Awaiting review',
            undefined,
            'hourglass'
          )}
        </View>

        {/* Growth Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Overview</Text>
          <View style={styles.growthStats}>
            <View style={styles.growthItem}>
              <Text style={styles.growthValue}>{data.growth.new_members_this_month}</Text>
              <Text style={styles.growthLabel}>New This Month</Text>
            </View>
            <View style={styles.growthItem}>
              <Text style={styles.growthValue}>{data.growth.new_members_last_month}</Text>
              <Text style={styles.growthLabel}>New Last Month</Text>
            </View>
            <View style={styles.growthItem}>
              <Text style={[styles.growthValue, { color: '#28a745' }]}>
                +{formatPercentage(data.growth.growth_percentage)}
              </Text>
              <Text style={styles.growthLabel}>Growth Rate</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {data.recent_activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name={getActivityIcon(activity.type) as any} size={16} color="#007AFF" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                {activity.member_name && (
                  <Text style={styles.activityMember}>{activity.member_name}</Text>
                )}
                <Text style={styles.activityTime}>
                  {new Date(activity.timestamp).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderMembers = () => {
    if (!data) return null;

    return (
      <View style={styles.tabContent}>
        {/* Member Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Member Breakdown</Text>
          
          <Text style={styles.subsectionTitle}>By Membership Type</Text>
          {data.member_breakdown.by_type.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>{item.type}</Text>
              <View style={styles.breakdownRight}>
                <Text style={styles.breakdownCount}>{item.count}</Text>
                <Text style={styles.breakdownPercentage}>({formatPercentage(item.percentage)})</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.subsectionTitle, { marginTop: 20 }]}>By Business Size</Text>
          {data.member_breakdown.by_size.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>{item.size}</Text>
              <View style={styles.breakdownRight}>
                <Text style={styles.breakdownCount}>{item.count}</Text>
                <Text style={styles.breakdownPercentage}>({formatPercentage(item.percentage)})</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Overdue Members */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overdue Members</Text>
            <TouchableOpacity style={styles.exportButton} onPress={onExportData}>
              <Ionicons name="download-outline" size={16} color="#007AFF" />
              <Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
          </View>
          
          {data.overdue_members.map((member) => (
            <View key={member.id} style={styles.overdueCard}>
              <View style={styles.overdueHeader}>
                <Text style={styles.overdueBusiness}>{member.business_name}</Text>
                <Text style={styles.overdueAmount}>{formatCurrency(member.amount_due)}</Text>
              </View>
              <Text style={styles.overdueContact}>{member.contact_person}</Text>
              <Text style={styles.overdueEmail}>{member.email}</Text>
              <View style={styles.overdueFooter}>
                <Text style={styles.overdueDays}>{member.days_overdue} days overdue</Text>
                <View style={styles.overdueActions}>
                  <TouchableOpacity 
                    style={styles.reminderButton}
                    onPress={() => onSendReminder?.(member.id)}
                  >
                    <Ionicons name="mail-outline" size={16} color="#007AFF" />
                    <Text style={styles.reminderButtonText}>Send Reminder</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => onViewMember?.(member.id)}
                  >
                    <Ionicons name="eye-outline" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFinancial = () => {
    if (!data) return null;

    return (
      <View style={styles.tabContent}>
        {/* Financial Metrics */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'YTD Revenue', 
            formatCurrency(data.financial.total_revenue_ytd), 
            'Year to date',
            undefined,
            'trending-up'
          )}
          {renderMetricCard(
            'Outstanding Dues', 
            formatCurrency(data.financial.outstanding_dues), 
            `${data.financial.overdue_count} members`,
            undefined,
            'alert-circle'
          )}
          {renderMetricCard(
            'Payment Success Rate', 
            formatPercentage(data.financial.payment_success_rate), 
            'Last 30 days',
            undefined,
            'checkmark-circle'
          )}
          {renderMetricCard(
            'Avg Monthly Revenue', 
            formatCurrency(data.financial.total_revenue_ytd / 12), 
            'Based on YTD',
            undefined,
            'calculator'
          )}
        </View>

        {/* Revenue Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Membership Dues</Text>
            <Text style={styles.revenueAmount}>{formatCurrency(data.overview.monthly_revenue * 0.85)}</Text>
          </View>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Event Fees</Text>
            <Text style={styles.revenueAmount}>{formatCurrency(data.overview.monthly_revenue * 0.10)}</Text>
          </View>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Sponsorships</Text>
            <Text style={styles.revenueAmount}>{formatCurrency(data.overview.monthly_revenue * 0.05)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEngagement = () => {
    if (!data) return null;

    return (
      <View style={styles.tabContent}>
        {/* Engagement Metrics */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Active Users', 
            data.engagement.active_users_30d, 
            'Last 30 days',
            undefined,
            'pulse'
          )}
          {renderMetricCard(
            'Posts This Month', 
            data.engagement.posts_this_month, 
            'Community posts',
            undefined,
            'chatbubbles'
          )}
          {renderMetricCard(
            'Events This Month', 
            data.engagement.events_this_month, 
            'Chamber events',
            undefined,
            'calendar'
          )}
          {renderMetricCard(
            'Avg Session', 
            data.engagement.avg_session_duration, 
            'Duration',
            undefined,
            'time'
          )}
        </View>

        {/* Engagement Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement Insights</Text>
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={20} color="#28a745" />
            <Text style={styles.insightText}>
              Member engagement is up 23% this month
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="calendar" size={20} color="#007AFF" />
            <Text style={styles.insightText}>
              Most active day: {data.engagement.most_active_day}
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="people" size={20} color="#ff6b35" />
            <Text style={styles.insightText}>
              {Math.round((data.engagement.active_users_30d / data.overview.total_members) * 100)}% of members are active
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTabs = () => (
    <View style={styles.tabs}>
      {(['overview', 'members', 'financial', 'engagement'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'members': return renderMembers();
      case 'financial': return renderFinancial();
      case 'engagement': return renderEngagement();
      default: return renderOverview();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderTabs()}
      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trendPositive: {
    backgroundColor: '#e8f5e8',
  },
  trendNegative: {
    backgroundColor: '#ffeaea',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  trendPositiveText: {
    color: '#28a745',
  },
  trendNegativeText: {
    color: '#dc3545',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 4,
  },
  exportButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  growthStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  growthItem: {
    alignItems: 'center',
  },
  growthValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  growthLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activityMember: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#333',
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  breakdownPercentage: {
    fontSize: 12,
    color: '#666',
  },
  overdueCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  overdueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overdueBusiness: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  overdueAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
  },
  overdueContact: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  overdueEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  overdueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overdueDays: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '500',
  },
  overdueActions: {
    flexDirection: 'row',
    gap: 8,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f8ff',
    gap: 4,
  },
  reminderButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  viewButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  revenueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  revenueLabel: {
    fontSize: 14,
    color: '#333',
  },
  revenueAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});