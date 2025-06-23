import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChamberStore } from '../../stores/chamber.store';
import { useAuth } from '../../utils/auth';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Download,
  Filter,
  BarChart3,
  PieChart,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { currentChamber } = useAuth();
  const { stats, members, events, fetchStats, fetchMembers, fetchEvents, isLoading } = useChamberStore();
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (currentChamber?.id) {
      fetchStats(currentChamber.id);
      fetchMembers(currentChamber.id);
      fetchEvents(currentChamber.id);
    }
  }, [currentChamber?.id]);

  const handleRefresh = async () => {
    if (currentChamber?.id) {
      await Promise.all([
        fetchStats(currentChamber.id),
        fetchMembers(currentChamber.id, { refresh: true }),
        fetchEvents(currentChamber.id, { refresh: true }),
      ]);
    }
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const membersByStatus = React.useMemo(() => {
    const statusCounts = members.reduce((acc, member) => {
      acc[member.membership_status] = (acc[member.membership_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { name: 'Active', value: statusCounts.active || 0, color: '#10B981' },
      { name: 'Pending', value: statusCounts.pending || 0, color: '#F59E0B' },
      { name: 'Inactive', value: statusCounts.inactive || 0, color: '#6B7280' },
      { name: 'Suspended', value: statusCounts.suspended || 0, color: '#EF4444' },
    ];
  }, [members]);

  const membersByType = React.useMemo(() => {
    const typeCounts = members.reduce((acc, member) => {
      acc[member.membership_type] = (acc[member.membership_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { name: 'Standard', value: typeCounts.standard || 0, color: '#3B82F6' },
      { name: 'Premium', value: typeCounts.premium || 0, color: '#8B5CF6' },
      { name: 'Corporate', value: typeCounts.corporate || 0, color: '#EC4899' },
    ];
  }, [members]);

  const eventsByType = React.useMemo(() => {
    const typeCounts = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { name: 'Networking', value: typeCounts.networking || 0, color: '#10B981' },
      { name: 'Workshop', value: typeCounts.workshop || 0, color: '#3B82F6' },
      { name: 'Conference', value: typeCounts.conference || 0, color: '#8B5CF6' },
      { name: 'Social', value: typeCounts.social || 0, color: '#F59E0B' },
      { name: 'Meeting', value: typeCounts.meeting || 0, color: '#6B7280' },
    ];
  }, [events]);

  const renderMetricCard = (title: string, value: string, subtitle: string, icon: React.ReactNode, trend?: number) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={styles.metricIcon}>
          {icon}
        </View>
        {trend !== undefined && (
          <View style={[styles.trendBadge, { backgroundColor: trend >= 0 ? '#DCFCE7' : '#FEE2E2' }]}>
            {trend >= 0 ? <TrendingUp size={12} color="#16A34A" /> : <TrendingDown size={12} color="#DC2626" />}
            <Text style={[styles.trendText, { color: trend >= 0 ? '#16A34A' : '#DC2626' }]}>
              {Math.abs(trend).toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricSubtitle}>{subtitle}</Text>
    </View>
  );

  const renderPieChart = (data: any[], title: string) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {/* Simplified pie chart representation */}
          <View style={styles.pieChartCenter}>
            <Text style={styles.pieChartCenterText}>
              {data.reduce((sum, item) => sum + item.value, 0)}
            </Text>
            <Text style={styles.pieChartCenterLabel}>Total</Text>
          </View>
        </View>
        <View style={styles.chartLegend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.name}</Text>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
        <Pressable
          key={range}
          style={[
            styles.timeRangeButton,
            timeRange === range && styles.timeRangeButtonActive
          ]}
          onPress={() => setTimeRange(range)}
        >
          <Text style={[
            styles.timeRangeText,
            timeRange === range && styles.timeRangeTextActive
          ]}>
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>Key Insights</Text>
      
      <View style={styles.insightCard}>
        <View style={styles.insightIcon}>
          <TrendingUp size={20} color="#10B981" />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Membership Growth</Text>
          <Text style={styles.insightDescription}>
            You've added {stats?.monthly_new_members || 0} new members this month, 
            {(stats?.monthly_new_members || 0) > 5 ? ' exceeding' : ' below'} your typical growth rate.
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightIcon}>
          <Activity size={20} color="#3B82F6" />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Event Engagement</Text>
          <Text style={styles.insightDescription}>
            Your events have an average attendance rate of {Math.round((stats?.engagement_rate || 0))}%. 
            Consider promoting upcoming events to boost participation.
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightIcon}>
          <DollarSign size={20} color="#F59E0B" />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Revenue Opportunity</Text>
          <Text style={styles.insightDescription}>
            Total annual revenue potential: {formatCurrency((stats?.membership_revenue || 0) + (stats?.event_revenue || 0))}. 
            Focus on premium memberships for growth.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton} onPress={() => setShowFilters(!showFilters)}>
            <Filter size={20} color="#6B7280" />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Download size={20} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      {/* Time Range Selector */}
      {renderTimeRangeSelector()}

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Total Members',
            (stats?.total_members || 0).toString(),
            `${stats?.active_members || 0} active`,
            <Users size={24} color="#3B82F6" />,
            getGrowthPercentage(stats?.total_members || 0, (stats?.total_members || 0) - (stats?.monthly_new_members || 0))
          )}
          
          {renderMetricCard(
            'Monthly Revenue',
            formatCurrency(stats?.membership_revenue || 0),
            'From memberships',
            <DollarSign size={24} color="#10B981" />,
            12.5
          )}
          
          {renderMetricCard(
            'Events This Month',
            (stats?.upcoming_events || 0).toString(),
            `${stats?.total_events || 0} total`,
            <Calendar size={24} color="#F59E0B" />,
            8.3
          )}
          
          {renderMetricCard(
            'Engagement Rate',
            `${Math.round(stats?.engagement_rate || 0)}%`,
            'Member participation',
            <Activity size={24} color="#8B5CF6" />,
            -2.1
          )}
        </View>

        {/* Charts */}
        <View style={styles.chartsContainer}>
          {renderPieChart(membersByStatus, 'Members by Status')}
          {renderPieChart(membersByType, 'Members by Type')}
          {renderPieChart(eventsByType, 'Events by Type')}
        </View>

        {/* Insights */}
        {renderInsights()}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <Pressable style={styles.quickActionButton}>
              <Download size={20} color="#3B82F6" />
              <Text style={styles.quickActionText}>Export Data</Text>
            </Pressable>
            
            <Pressable style={styles.quickActionButton}>
              <BarChart3 size={20} color="#10B981" />
              <Text style={styles.quickActionText}>Custom Report</Text>
            </Pressable>
            
            <Pressable style={styles.quickActionButton}>
              <PieChart size={20} color="#F59E0B" />
              <Text style={styles.quickActionText}>Member Analysis</Text>
            </Pressable>
            
            <Pressable style={styles.quickActionButton}>
              <Activity size={20} color="#8B5CF6" />
              <Text style={styles.quickActionText}>Engagement Report</Text>
            </Pressable>
          </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
  },
  timeRangeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 44) / 2, // Account for padding and gap
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartsContainer: {
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  pieChartCenter: {
    alignItems: 'center',
  },
  pieChartCenterText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  pieChartCenterLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartLegend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  insightsContainer: {
    marginBottom: 24,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  quickActions: {
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 44) / 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickActionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
}); 