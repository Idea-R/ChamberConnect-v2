import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useChamberStore } from '../../../stores/chamber.store';
import { useAuth } from '../../../utils/auth';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Tag,
  DollarSign,
  Calendar,
  Save,
  X,
} from 'lucide-react-native';

interface MemberFormData {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  category: string;
  description: string;
  membership_type: 'standard' | 'premium' | 'corporate';
  membership_level: 'basic' | 'silver' | 'gold' | 'platinum';
  dues_amount: string;
}

const BUSINESS_CATEGORIES = [
  'Automotive',
  'Dining & Food',
  'Health & Wellness',
  'Professional Services',
  'Retail & Shopping',
  'Technology',
  'Construction & Trades',
  'Financial Services',
  'Education',
  'Entertainment & Recreation',
  'Non-Profit',
  'Manufacturing',
  'Transportation',
  'Beauty & Personal Care',
  'Home & Garden',
];

const MEMBERSHIP_TYPES = [
  { value: 'standard', label: 'Standard', price: 150 },
  { value: 'premium', label: 'Premium', price: 300 },
  { value: 'corporate', label: 'Corporate', price: 500 },
];

const MEMBERSHIP_LEVELS = [
  { value: 'basic', label: 'Basic' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
];

export default function AddMemberScreen() {
  const { currentChamber } = useAuth();
  const { addMember, isLoading } = useChamberStore();
  
  const [formData, setFormData] = useState<MemberFormData>({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    category: '',
    description: '',
    membership_type: 'standard',
    membership_level: 'basic',
    dues_amount: '150',
  });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showMembershipTypePicker, setShowMembershipTypePicker] = useState(false);
  const [showMembershipLevelPicker, setShowMembershipLevelPicker] = useState(false);

  const updateFormData = (field: keyof MemberFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-update dues amount when membership type changes
    if (field === 'membership_type') {
      const membershipType = MEMBERSHIP_TYPES.find(type => type.value === value);
      if (membershipType) {
        setFormData(prev => ({ ...prev, dues_amount: membershipType.price.toString() }));
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.business_name.trim()) {
      Alert.alert('Error', 'Business name is required');
      return false;
    }
    if (!formData.contact_name.trim()) {
      Alert.alert('Error', 'Contact name is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Error', 'Please select a business category');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!currentChamber?.id) return;

    try {
      const memberData = {
        ...formData,
        chamber_id: currentChamber.id,
        dues_amount: parseFloat(formData.dues_amount) || 0,
        membership_status: 'active' as const,
        payment_status: 'current' as const,
        tags: [],
        services: [],
        joined_date: new Date().toISOString().split('T')[0],
        renewal_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      await addMember(memberData);
      Alert.alert('Success', 'Member added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add member. Please try again.');
    }
  };

  const renderCategoryPicker = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>Select Business Category</Text>
      <ScrollView style={styles.pickerScroll}>
        {BUSINESS_CATEGORIES.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.pickerItem,
              formData.category === category && styles.pickerItemSelected
            ]}
            onPress={() => {
              updateFormData('category', category);
              setShowCategoryPicker(false);
            }}
          >
            <Text style={[
              styles.pickerItemText,
              formData.category === category && styles.pickerItemTextSelected
            ]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        style={styles.pickerCloseButton}
        onPress={() => setShowCategoryPicker(false)}
      >
        <Text style={styles.pickerCloseText}>Cancel</Text>
      </Pressable>
    </View>
  );

  const renderMembershipTypePicker = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>Select Membership Type</Text>
      <View style={styles.pickerScroll}>
        {MEMBERSHIP_TYPES.map((type) => (
          <Pressable
            key={type.value}
            style={[
              styles.pickerItem,
              formData.membership_type === type.value && styles.pickerItemSelected
            ]}
            onPress={() => {
              updateFormData('membership_type', type.value);
              setShowMembershipTypePicker(false);
            }}
          >
            <View style={styles.membershipTypeItem}>
              <Text style={[
                styles.pickerItemText,
                formData.membership_type === type.value && styles.pickerItemTextSelected
              ]}>
                {type.label}
              </Text>
              <Text style={[
                styles.membershipTypePrice,
                formData.membership_type === type.value && styles.pickerItemTextSelected
              ]}>
                ${type.price}/year
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Pressable
        style={styles.pickerCloseButton}
        onPress={() => setShowMembershipTypePicker(false)}
      >
        <Text style={styles.pickerCloseText}>Cancel</Text>
      </Pressable>
    </View>
  );

  const renderMembershipLevelPicker = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>Select Membership Level</Text>
      <View style={styles.pickerScroll}>
        {MEMBERSHIP_LEVELS.map((level) => (
          <Pressable
            key={level.value}
            style={[
              styles.pickerItem,
              formData.membership_level === level.value && styles.pickerItemSelected
            ]}
            onPress={() => {
              updateFormData('membership_level', level.value);
              setShowMembershipLevelPicker(false);
            }}
          >
            <Text style={[
              styles.pickerItemText,
              formData.membership_level === level.value && styles.pickerItemTextSelected
            ]}>
              {level.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        style={styles.pickerCloseButton}
        onPress={() => setShowMembershipLevelPicker(false)}
      >
        <Text style={styles.pickerCloseText}>Cancel</Text>
      </Pressable>
    </View>
  );

  if (showCategoryPicker) return renderCategoryPicker();
  if (showMembershipTypePicker) return renderMembershipTypePicker();
  if (showMembershipLevelPicker) return renderMembershipLevelPicker();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={() => router.back()}>
            <X size={24} color="#666" />
          </Pressable>
          <Text style={styles.headerTitle}>Add Member</Text>
          <Pressable 
            style={[styles.headerButton, styles.saveButton]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <Save size={24} color="#3B82F6" />
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Business Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Building size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Business Name *"
                  value={formData.business_name}
                  onChangeText={(text) => updateFormData('business_name', text)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <User size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Contact Name *"
                  value={formData.contact_name}
                  onChangeText={(text) => updateFormData('contact_name', text)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Tag size={20} color="#666" style={styles.inputIcon} />
                <Text style={[
                  styles.textInput, 
                  styles.selectText,
                  !formData.category && styles.placeholder
                ]}>
                  {formData.category || 'Select Category *'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Business Description"
                  value={formData.description}
                  onChangeText={(text: string) => updateFormData('description', text)}
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address *"
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Phone size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData('phone', text)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Business Address"
                  value={formData.address}
                  onChangeText={(text) => updateFormData('address', text)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Globe size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Website URL"
                  value={formData.website}
                  onChangeText={(text) => updateFormData('website', text)}
                  keyboardType="url"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* Membership Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Membership Details</Text>
            
            <View style={styles.inputGroup}>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowMembershipTypePicker(true)}
              >
                <Tag size={20} color="#666" style={styles.inputIcon} />
                <Text style={[styles.textInput, styles.selectText]}>
                  {MEMBERSHIP_TYPES.find(t => t.value === formData.membership_type)?.label || 'Standard'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowMembershipLevelPicker(true)}
              >
                <Tag size={20} color="#666" style={styles.inputIcon} />
                <Text style={[styles.textInput, styles.selectText]}>
                  {MEMBERSHIP_LEVELS.find(l => l.value === formData.membership_level)?.label || 'Basic'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Annual Dues Amount"
                  value={formData.dues_amount}
                  onChangeText={(text) => updateFormData('dues_amount', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
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
  saveButton: {
    opacity: 1,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 4,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 4,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  selectText: {
    paddingVertical: 4,
  },
  placeholder: {
    color: '#999',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pickerScroll: {
    flex: 1,
    maxHeight: 400,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  pickerItemSelected: {
    backgroundColor: '#eff6ff',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#111827',
  },
  pickerItemTextSelected: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  membershipTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membershipTypePrice: {
    fontSize: 14,
    color: '#6b7280',
  },
  pickerCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  pickerCloseText: {
    fontSize: 16,
    color: '#6b7280',
  },
}); 