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
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  FileText,
  Tag,
  Save,
  X,
  Image as ImageIcon,
} from 'lucide-react-native';

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  end_date: string;
  location: string;
  address: string;
  max_attendees: string;
  registration_required: boolean;
  registration_deadline: string;
  event_type: 'networking' | 'workshop' | 'conference' | 'social' | 'meeting';
  price: string;
  image_url: string;
}

const EVENT_TYPES = [
  { value: 'networking', label: 'Networking Event', description: 'Business networking and socializing' },
  { value: 'workshop', label: 'Workshop', description: 'Educational and training sessions' },
  { value: 'conference', label: 'Conference', description: 'Large-scale professional gatherings' },
  { value: 'social', label: 'Social Event', description: 'Community and recreational activities' },
  { value: 'meeting', label: 'Meeting', description: 'Business meetings and discussions' },
];

export default function CreateEventScreen() {
  const { currentChamber } = useAuth();
  const { createEvent, isLoading } = useChamberStore();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    address: '',
    max_attendees: '',
    registration_required: true,
    registration_deadline: '',
    event_type: 'networking',
    price: '0',
    image_url: '',
  });

  const [showEventTypePicker, setShowEventTypePicker] = useState(false);
  // const [showDatePicker, setShowDatePicker] = useState<'event' | 'end' | 'registration' | null>(null); // TODO: Implement date picker

  const updateFormData = (field: keyof EventFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Event title is required');
      return false;
    }
    if (!formData.event_date) {
      Alert.alert('Error', 'Event date is required');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Event location is required');
      return false;
    }
    
    // Validate dates
    const eventDate = new Date(formData.event_date);
    const now = new Date();
    if (eventDate < now) {
      Alert.alert('Error', 'Event date cannot be in the past');
      return false;
    }

    if (formData.end_date) {
      const endDate = new Date(formData.end_date);
      if (endDate < eventDate) {
        Alert.alert('Error', 'End date cannot be before event date');
        return false;
      }
    }

    if (formData.registration_deadline) {
      const regDeadline = new Date(formData.registration_deadline);
      if (regDeadline > eventDate) {
        Alert.alert('Error', 'Registration deadline cannot be after event date');
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!currentChamber?.id) return;

    try {
      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        event_date: new Date(formData.event_date).toISOString(),
                  end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
        location: formData.location,
                  address: formData.address || undefined,
                  max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
        current_attendees: 0,
        registration_required: formData.registration_required,
                  registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : undefined,
        event_type: formData.event_type,
        price: parseFloat(formData.price) || 0,
                  image_url: formData.image_url || undefined,
        status: 'upcoming' as const,
      };

      await createEvent(eventData);
      Alert.alert('Success', 'Event created successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const generateSampleDate = (daysFromNow: number, hour: number = 18) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hour, 0, 0, 0);
    return formatDateForInput(date);
  };

  const renderEventTypePicker = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerTitle}>Select Event Type</Text>
      <ScrollView style={styles.pickerScroll}>
        {EVENT_TYPES.map((type) => (
          <Pressable
            key={type.value}
            style={[
              styles.eventTypeItem,
              formData.event_type === type.value && styles.eventTypeItemSelected
            ]}
            onPress={() => {
              updateFormData('event_type', type.value);
              setShowEventTypePicker(false);
            }}
          >
            <View style={styles.eventTypeContent}>
              <Text style={[
                styles.eventTypeLabel,
                formData.event_type === type.value && styles.eventTypeLabelSelected
              ]}>
                {type.label}
              </Text>
              <Text style={[
                styles.eventTypeDescription,
                formData.event_type === type.value && styles.eventTypeDescriptionSelected
              ]}>
                {type.description}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        style={styles.pickerCloseButton}
        onPress={() => setShowEventTypePicker(false)}
      >
        <Text style={styles.pickerCloseText}>Cancel</Text>
      </Pressable>
    </View>
  );

  if (showEventTypePicker) return renderEventTypePicker();

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
          <Text style={styles.headerTitle}>Create Event</Text>
          <Pressable 
            style={[styles.headerButton, styles.saveButton]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <Save size={24} color="#3B82F6" />
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Information</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <FileText size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Event Title *"
                  value={formData.title}
                  onChangeText={(text: string) => updateFormData('title', text)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setShowEventTypePicker(true)}
              >
                <Tag size={20} color="#666" style={styles.inputIcon} />
                <Text style={[styles.textInput, styles.selectText]}>
                  {EVENT_TYPES.find(t => t.value === formData.event_type)?.label || 'Networking Event'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Event Description"
                  value={formData.description}
                  onChangeText={(text: string) => updateFormData('description', text)}
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Event Date & Time *"
                  value={formData.event_date}
                  onChangeText={(text: string) => updateFormData('event_date', text)}
                  placeholderTextColor="#999"
                />
              </View>
              <Pressable 
                style={styles.quickDateButton}
                onPress={() => updateFormData('event_date', generateSampleDate(7))}
              >
                <Text style={styles.quickDateText}>Next Week</Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Clock size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="End Date & Time (Optional)"
                  value={formData.end_date}
                  onChangeText={(text: string) => updateFormData('end_date', text)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.checkboxContainer}>
              <Pressable
                style={[styles.checkbox, formData.registration_required && styles.checkboxChecked]}
                onPress={() => updateFormData('registration_required', !formData.registration_required)}
              >
                {formData.registration_required && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
              <Text style={styles.checkboxLabel}>Require Registration</Text>
            </View>

            {formData.registration_required && (
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Registration Deadline"
                    value={formData.registration_deadline}
                    onChangeText={(text: string) => updateFormData('registration_deadline', text)}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            )}
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Event Location *"
                  value={formData.location}
                  onChangeText={(text: string) => updateFormData('location', text)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Full Address (Optional)"
                  value={formData.address}
                  onChangeText={(text: string) => updateFormData('address', text)}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* Capacity & Pricing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Capacity & Pricing</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Users size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Maximum Attendees (Optional)"
                  value={formData.max_attendees}
                  onChangeText={(text: string) => updateFormData('max_attendees', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Ticket Price (0 for free)"
                  value={formData.price}
                  onChangeText={(text: string) => updateFormData('price', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <ImageIcon size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Event Image URL (Optional)"
                  value={formData.image_url}
                  onChangeText={(text: string) => updateFormData('image_url', text)}
                  keyboardType="url"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Setup</Text>
            <View style={styles.quickActions}>
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => {
                  updateFormData('title', 'Monthly Networking Mixer');
                  updateFormData('description', 'Join fellow chamber members for an evening of networking and business connections.');
                  updateFormData('event_date', generateSampleDate(14, 18));
                  updateFormData('location', 'Chamber Conference Room');
                  updateFormData('event_type', 'networking');
                  updateFormData('price', '0');
                }}
              >
                <Text style={styles.quickActionText}>Networking Event</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => {
                  updateFormData('title', 'Business Workshop');
                  updateFormData('description', 'Educational workshop for local business owners and entrepreneurs.');
                  updateFormData('event_date', generateSampleDate(21, 14));
                  updateFormData('location', 'Chamber Training Room');
                  updateFormData('event_type', 'workshop');
                  updateFormData('price', '25');
                }}
              >
                <Text style={styles.quickActionText}>Workshop</Text>
              </Pressable>
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
    minHeight: 100,
  },
  selectText: {
    paddingVertical: 4,
  },
  quickDateButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
  },
  quickDateText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#111827',
  },
  quickActionsContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
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
  eventTypeItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  eventTypeItemSelected: {
    backgroundColor: '#eff6ff',
  },
  eventTypeContent: {
    flex: 1,
  },
  eventTypeLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 4,
  },
  eventTypeLabelSelected: {
    color: '#3B82F6',
  },
  eventTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  eventTypeDescriptionSelected: {
    color: '#3B82F6',
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