import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '../../../utils/auth';
import { useChamberStore, ChamberMember } from '../../../stores/chamber.store';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MapPin,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Pause
} from 'lucide-react-native';
import { router } from 'expo-router';

interface MemberCardProps {
  member: ChamberMember;
  onPress: () => void;
  onMorePress: () => void;
}

function MemberCard({ member, onPress, onMorePress }: MemberCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'pending': return '#F59E0B';
      case 'suspended': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} color="#10B981" />;
      case 'inactive': return <XCircle size={16} color="#6B7280" />;
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      case 'suspended': return <Pause size={16} color="#EF4444" />;
      default: return <XCircle size={16} color="#6B7280" />;
    }
  };

  return (
    <Pressable style={styles.memberCard} onPress={onPress}>
      <View style={styles.memberCardContent}>
        <View style={styles.memberHeader}>
          <View style={styles.memberTitleRow}>
            <Text style={styles.businessName} numberOfLines={1}>
              {member.business_name}
            </Text>
            <View style={styles.statusContainer}>
              {getStatusIcon(member.membership_status)}
              <Text style={[styles.statusText, { color: getStatusColor(member.membership_status) }]}>
                {member.membership_status}
              </Text>
            </View>
          </View>
          
          <Pressable style={styles.moreButton} onPress={onMorePress}>
            <MoreVertical size={20} color="#6B7280" />
          </Pressable>
        </View>

        <View style={styles.memberDetails}>
          <Text style={styles.contactName} numberOfLines={1}>
            {member.contact_name}
          </Text>
          
          <View style={styles.contactInfo}>
            {member.email && (
              <View style={styles.contactItem}>
                <Mail size={14} color="#6B7280" />
                <Text style={styles.contactText} numberOfLines={1}>
                  {member.email}
                </Text>
              </View>
            )}
            {member.phone && (
              <View style={styles.contactItem}>
                <Phone size={14} color="#6B7280" />
                <Text style={styles.contactText} numberOfLines={1}>
                  {member.phone}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.metaInfo}>
            <Text style={styles.categoryTag}>
              {member.category}
            </Text>
            <Text style={styles.membershipType}>
              {member.membership_type} • {member.membership_level}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function MembersScreen() {
  const { currentChamber } = useAuth();
  const {
    members,
    isLoading,
    error,
    memberSearchQuery,
    memberFilters,
    fetchMembers,
    searchMembers,
    setMemberFilters,
    clearError
  } = useChamberStore();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (currentChamber?.id) {
      fetchMembers(currentChamber.id);
    }
  }, [currentChamber?.id]);

  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Search filter
    if (memberSearchQuery.trim()) {
      const query = memberSearchQuery.toLowerCase();
      filtered = filtered.filter(member =>
        member.business_name.toLowerCase().includes(query) ||
        member.contact_name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.category.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (memberFilters.status.length > 0) {
      filtered = filtered.filter(member =>
        memberFilters.status.includes(member.membership_status)
      );
    }

    // Category filter
    if (memberFilters.category.length > 0) {
      filtered = filtered.filter(member =>
        memberFilters.category.includes(member.category)
      );
    }

    // Membership type filter
    if (memberFilters.membershipType.length > 0) {
      filtered = filtered.filter(member =>
        memberFilters.membershipType.includes(member.membership_type)
      );
    }

    return filtered;
  }, [members, memberSearchQuery, memberFilters]);

  const handleRefresh = async () => {
    if (currentChamber?.id) {
      await fetchMembers(currentChamber.id, { refresh: true });
    }
  };

  const handleMemberPress = (member: ChamberMember) => {
    router.push(`/(chamber)/members/${member.id}`);
  };

  const handleMemberMore = (member: ChamberMember) => {
    Alert.alert(
      member.business_name,
      'What would you like to do?',
      [
        { text: 'View Details', onPress: () => handleMemberPress(member) },
        { text: 'Edit Member', onPress: () => router.push(`/(chamber)/members/edit/${member.id}`) },
        { text: 'Contact', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleAddMember = () => {
    router.push('/(chamber)/members/add');
  };

  const renderMember = ({ item }: { item: ChamberMember }) => (
    <MemberCard
      member={item}
      onPress={() => handleMemberPress(item)}
      onMorePress={() => handleMemberMore(item)}
    />
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading members</Text>
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
      {/* Search and Filter Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            value={memberSearchQuery}
            onChangeText={searchMembers}
            placeholderTextColor="#9CA3AF"
          />
          {memberSearchQuery.length > 0 && (
            <Pressable onPress={() => searchMembers('')} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </Pressable>
          )}
        </View>

        <Pressable 
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? '#3B82F6' : '#6B7280'} />
        </Pressable>
      </View>

      {/* Results Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {filteredMembers.length} of {members.length} members
        </Text>
        {memberSearchQuery && (
          <Text style={styles.searchSummary}>
            Results for "{memberSearchQuery}"
          </Text>
        )}
      </View>

      {/* Members List */}
      <FlashList
        data={filteredMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        estimatedItemSize={120}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {memberSearchQuery || memberFilters.status.length > 0 || memberFilters.category.length > 0
                ? 'No members match your search criteria'
                : 'No members yet'
              }
            </Text>
            <Text style={styles.emptySubtext}>
              {!memberSearchQuery && memberFilters.status.length === 0 && memberFilters.category.length === 0
                ? 'Add your first member to get started'
                : 'Try adjusting your search or filters'
              }
            </Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <Pressable style={styles.fab} onPress={handleAddMember}>
        <Plus size={24} color="#FFFFFF" />
      </Pressable>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#EBF5FF',
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  searchSummary: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  memberCardContent: {
    padding: 16,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  memberTitleRow: {
    flex: 1,
    marginRight: 12,
  },
  businessName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
  },
  moreButton: {
    padding: 4,
  },
  memberDetails: {
    gap: 8,
  },
  contactName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  contactInfo: {
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  membershipType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
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