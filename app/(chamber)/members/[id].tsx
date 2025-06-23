import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useChamberStore } from '../../../stores/chamber.store';
import { useAuth } from '../../../utils/auth';
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Globe,
  Building,
  Calendar,
  DollarSign,
  Tag,
  MessageSquare,
  MoreVertical,
  Trash2,
  UserX,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react-native';

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentChamber } = useAuth();
  const { members, updateMember, deleteMember, isLoading } = useChamberStore();
  
  const [member, setMember] = useState(members.find(m => m.id === id));
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const foundMember = members.find(m => m.id === id);
    setMember(foundMember);
  }, [id, members]);

  if (!member) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#666" />
          </Pressable>
          <Text style={styles.headerTitle}>Member Not Found</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Member not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    if (member.phone) {
      Linking.openURL(`tel:${member.phone}`);
    }
  };

  const handleEmail = () => {
    if (member.email) {
      Linking.openURL(`mailto:${member.email}`);
    }
  };

  const handleWebsite = () => {
    if (member.website) {
      const url = member.website.startsWith('http') ? member.website : `https://${member.website}`;
      Linking.openURL(url);
    }
  };

  const handleDirections = () => {
    if (member.address) {
      const encodedAddress = encodeURIComponent(member.address);
      Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
    }
  };

  const handleEditMember = () => {
    router.push(`/(chamber)/members/edit/${member.id}`);
  };

  const handleDeleteMember = () => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${member.business_name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMember(member.id);
              Alert.alert('Success', 'Member deleted successfully', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete member');
            }
          }
        }
      ]
    );
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateMember(member.id, { membership_status: newStatus as any });
      Alert.alert('Success', `Member status updated to ${newStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update member status');
    }
  };

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
      case 'suspended': return <UserX size={16} color="#EF4444" />;
      default: return <Clock size={16} color="#6B7280" />;
    }
  };

  const renderActionSheet = () => (
    <View style={styles.actionSheet}>
      <View style={styles.actionSheetContent}>
        <Text style={styles.actionSheetTitle}>Member Actions</Text>
        
        <Pressable style={styles.actionItem} onPress={handleEditMember}>
          <Edit size={20} color="#3B82F6" />
          <Text style={styles.actionItemText}>Edit Member</Text>
        </Pressable>

        <Pressable 
          style={styles.actionItem} 
          onPress={() => handleStatusChange('active')}
          disabled={member.membership_status === 'active'}
        >
          <CheckCircle size={20} color="#10B981" />
          <Text style={[styles.actionItemText, member.membership_status === 'active' && styles.actionItemDisabled]}>
            Mark Active
          </Text>
        </Pressable>

        <Pressable 
          style={styles.actionItem} 
          onPress={() => handleStatusChange('suspended')}
          disabled={member.membership_status === 'suspended'}
        >
          <UserX size={20} color="#F59E0B" />
          <Text style={[styles.actionItemText, member.membership_status === 'suspended' && styles.actionItemDisabled]}>
            Suspend Member
          </Text>
        </Pressable>

        <Pressable style={[styles.actionItem, styles.actionItemDanger]} onPress={handleDeleteMember}>
          <Trash2 size={20} color="#EF4444" />
          <Text style={[styles.actionItemText, styles.actionItemDangerText]}>Delete Member</Text>
        </Pressable>

        <Pressable 
          style={styles.actionItemCancel} 
          onPress={() => setShowActions(false)}
        >
          <Text style={styles.actionItemCancelText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );

  if (showActions) {
    return (
      <SafeAreaView style={styles.container}>
        {renderActionSheet()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#666" />
        </Pressable>
        <Text style={styles.headerTitle}>Member Details</Text>
        <Pressable style={styles.headerButton} onPress={() => setShowActions(true)}>
          <MoreVertical size={24} color="#666" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Member Header */}
        <View style={styles.memberHeader}>
          <View style={styles.logoContainer}>
            {member.logo_url ? (
              <Image source={{ uri: member.logo_url }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Building size={32} color="#6B7280" />
              </View>
            )}
          </View>
          
          <View style={styles.memberInfo}>
            <Text style={styles.businessName}>{member.business_name}</Text>
            <Text style={styles.contactName}>{member.contact_name}</Text>
            
            <View style={styles.statusContainer}>
              {getStatusIcon(member.membership_status)}
              <Text style={[styles.statusText, { color: getStatusColor(member.membership_status) }]}>
                {member.membership_status.charAt(0).toUpperCase() + member.membership_status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {member.phone && (
            <Pressable style={styles.quickActionButton} onPress={handleCall}>
              <Phone size={20} color="#3B82F6" />
              <Text style={styles.quickActionText}>Call</Text>
            </Pressable>
          )}
          
          {member.email && (
            <Pressable style={styles.quickActionButton} onPress={handleEmail}>
              <Mail size={20} color="#3B82F6" />
              <Text style={styles.quickActionText}>Email</Text>
            </Pressable>
          )}
          
          {member.website && (
            <Pressable style={styles.quickActionButton} onPress={handleWebsite}>
              <Globe size={20} color="#3B82F6" />
              <Text style={styles.quickActionText}>Website</Text>
            </Pressable>
          )}
          
          {member.address && (
            <Pressable style={styles.quickActionButton} onPress={handleDirections}>
              <MapPin size={20} color="#3B82F6" />
              <Text style={styles.quickActionText}>Directions</Text>
            </Pressable>
          )}
        </View>

        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          
          {member.category && (
            <View style={styles.infoRow}>
              <Tag size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{member.category}</Text>
            </View>
          )}

          {member.description && (
            <View style={styles.infoRow}>
              <Building size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoValue}>{member.description}</Text>
            </View>
          )}

          {member.services && member.services.length > 0 && (
            <View style={styles.infoRow}>
              <Tag size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Services</Text>
              <Text style={styles.infoValue}>{member.services.join(', ')}</Text>
            </View>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {member.email && (
            <Pressable style={styles.contactRow} onPress={handleEmail}>
              <Mail size={16} color="#6B7280" />
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{member.email}</Text>
            </Pressable>
          )}

          {member.phone && (
            <Pressable style={styles.contactRow} onPress={handleCall}>
              <Phone size={16} color="#6B7280" />
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{member.phone}</Text>
            </Pressable>
          )}

          {member.address && (
            <Pressable style={styles.contactRow} onPress={handleDirections}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{member.address}</Text>
            </Pressable>
          )}

          {member.website && (
            <Pressable style={styles.contactRow} onPress={handleWebsite}>
              <Globe size={16} color="#6B7280" />
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue}>{member.website}</Text>
            </Pressable>
          )}
        </View>

        {/* Membership Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membership Details</Text>
          
          <View style={styles.infoRow}>
            <Tag size={16} color="#6B7280" />
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{member.membership_type}</Text>
          </View>

          <View style={styles.infoRow}>
            <Tag size={16} color="#6B7280" />
            <Text style={styles.infoLabel}>Level</Text>
            <Text style={styles.infoValue}>{member.membership_level}</Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>
              {new Date(member.joined_date).toLocaleDateString()}
            </Text>
          </View>

          {member.renewal_date && (
            <View style={styles.infoRow}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Renewal</Text>
              <Text style={styles.infoValue}>
                {new Date(member.renewal_date).toLocaleDateString()}
              </Text>
            </View>
          )}

          {member.dues_amount && (
            <View style={styles.infoRow}>
              <DollarSign size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Annual Dues</Text>
              <Text style={styles.infoValue}>${member.dues_amount}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Tag size={16} color="#6B7280" />
            <Text style={styles.infoLabel}>Payment Status</Text>
            <Text style={[
              styles.infoValue,
              { color: member.payment_status === 'current' ? '#10B981' : member.payment_status === 'overdue' ? '#EF4444' : '#6B7280' }
            ]}>
              {member.payment_status.charAt(0).toUpperCase() + member.payment_status.slice(1)}
            </Text>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  memberHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 8,
    minWidth: 60,
  },
  quickActionText: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  contactLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    width: 80,
  },
  contactValue: {
    fontSize: 14,
    color: '#3B82F6',
    flex: 1,
    textDecorationLine: 'underline',
  },
  actionSheet: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionItemText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  actionItemDisabled: {
    color: '#9CA3AF',
  },
  actionItemDanger: {
    borderBottomWidth: 0,
  },
  actionItemDangerText: {
    color: '#EF4444',
  },
  actionItemCancel: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  actionItemCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
}); 