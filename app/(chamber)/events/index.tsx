import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useChamberStore } from '../../../stores/chamber.store';
import { useAuth } from '../../../utils/auth';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  Search,
  ChevronRight,
  DollarSign,
} from 'lucide-react-native';

type EventStatus = 'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
type EventType = 'all' | 'networking' | 'workshop' | 'conference' | 'social' | 'meeting';

export default function EventsScreen() {
  const { currentChamber } = useAuth();
  const { events, fetchEvents, isLoading } = useChamberStore();
  
  const [statusFilter, setStatusFilter] = useState<EventStatus>('all');
  const [typeFilter, setTypeFilter] = useState<EventType>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (currentChamber?.id) {
      fetchEvents(currentChamber.id);
    }
  }, [currentChamber?.id]);

  const handleRefresh = async () => {
    if (currentChamber?.id) {
      await fetchEvents(currentChamber.id, { refresh: true });
    }
  };

  const filteredEvents = events.filter(event => {
    const statusMatch = statusFilter === 'all' || event.status === statusFilter;
    const typeMatch = typeFilter === 'all' || event.event_type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#3B82F6';
      case 'ongoing': return '#10B981';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'networking': return <Users size={16} color="#6B7280" />;
      case 'workshop': return <Calendar size={16} color="#6B7280" />;
      case 'conference': return <Calendar size={16} color="#6B7280" />;
      case 'social': return <Users size={16} color="#6B7280" />;
      case 'meeting': return <Calendar size={16} color="#6B7280" />;
      default: return <Calendar size={16} color="#6B7280" />;
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const renderEventItem = ({ item: event }: { item: any }) => (
    <Pressable
      style={styles.eventCard}
      onPress={() => router.push(`/(chamber)/events/${event.id}`)}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventTypeContainer}>
          {getEventTypeIcon(event.event_type)}
          <Text style={styles.eventType}>
            {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getEventStatusColor(event.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getEventStatusColor(event.status) }]}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.eventTitle}>{event.title}</Text>
      
      {event.description && (
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>
      )}

      <View style={styles.eventDetails}>
        <View style={styles.eventDetailRow}>
          <Calendar size={14} color="#6B7280" />
          <Text style={styles.eventDetailText}>
            {formatEventDate(event.event_date)}
          </Text>
        </View>

        <View style={styles.eventDetailRow}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.eventDetailText}>
            {new Date(event.event_date).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </Text>
        </View>

        {event.location && (
          <View style={styles.eventDetailRow}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.eventDetailText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        )}

        <View style={styles.eventDetailRow}>
          <Users size={14} color="#6B7280" />
          <Text style={styles.eventDetailText}>
            {event.current_attendees}
            {event.max_attendees && `/${event.max_attendees}`} attendees
          </Text>
        </View>

        {event.price > 0 && (
          <View style={styles.eventDetailRow}>
            <DollarSign size={14} color="#6B7280" />
            <Text style={styles.eventDetailText}>
              ${event.price}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.eventFooter}>
        <Text style={styles.eventDate}>
          {new Date(event.event_date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
        <ChevronRight size={16} color="#6B7280" />
      </View>
    </Pressable>
  );

  const renderFilterSheet = () => (
    <View style={styles.filterSheet}>
      <View style={styles.filterSheetContent}>
        <Text style={styles.filterSheetTitle}>Filter Events</Text>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Status</Text>
          <View style={styles.filterOptions}>
            {(['all', 'upcoming', 'ongoing', 'completed', 'cancelled'] as EventStatus[]).map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.filterOption,
                  statusFilter === status && styles.filterOptionSelected
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[
                  styles.filterOptionText,
                  statusFilter === status && styles.filterOptionTextSelected
                ]}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Type</Text>
          <View style={styles.filterOptions}>
            {(['all', 'networking', 'workshop', 'conference', 'social', 'meeting'] as EventType[]).map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.filterOption,
                  typeFilter === type && styles.filterOptionSelected
                ]}
                onPress={() => setTypeFilter(type)}
              >
                <Text style={[
                  styles.filterOptionText,
                  typeFilter === type && styles.filterOptionTextSelected
                ]}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable 
          style={styles.filterCloseButton}
          onPress={() => setShowFilters(false)}
        >
          <Text style={styles.filterCloseText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Calendar size={48} color="#9CA3AF" />
      <Text style={styles.emptyStateTitle}>No Events Found</Text>
      <Text style={styles.emptyStateDescription}>
        {filteredEvents.length === 0 && events.length > 0
          ? 'Try adjusting your filters to see more events.'
          : 'Get started by creating your first chamber event.'
        }
      </Text>
      <Pressable 
        style={styles.emptyStateButton}
        onPress={() => router.push('/(chamber)/events/create')}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.emptyStateButtonText}>Create Event</Text>
      </Pressable>
    </View>
  );

  if (showFilters) {
    return (
      <SafeAreaView style={styles.container}>
        {renderFilterSheet()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <View style={styles.headerActions}>
          <Pressable 
            style={styles.headerButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color="#6B7280" />
          </Pressable>
          <Pressable 
            style={styles.headerButton}
            onPress={() => router.push('/(chamber)/events/create')}
          >
            <Plus size={20} color="#3B82F6" />
          </Pressable>
        </View>
      </View>

      {/* Active Filters */}
      {(statusFilter !== 'all' || typeFilter !== 'all') && (
        <View style={styles.activeFilters}>
          {statusFilter !== 'all' && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Text>
              <Pressable onPress={() => setStatusFilter('all')}>
                <Text style={styles.activeFilterRemove}>×</Text>
              </Pressable>
            </View>
          )}
          {typeFilter !== 'all' && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                Type: {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
              </Text>
              <Pressable onPress={() => setTypeFilter('all')}>
                <Text style={styles.activeFilterRemove}>×</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* Events List */}
      <FlashList
        data={filteredEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={160}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  activeFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  activeFilterRemove: {
    fontSize: 16,
    color: '#3B82F6',
    marginLeft: 4,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventType: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  eventDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  filterSheet: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterSheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  filterSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  filterSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterOptionSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#3B82F6',
  },
  filterCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  filterCloseText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
}); 