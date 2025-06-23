import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChamberProfileFormProps {
  chamber?: any;
  onSave: (data: ChamberProfileData) => void;
  isEditing?: boolean;
}

interface ChamberProfileData {
  name: string;
  headline: string;
  description: string;
  banner_image_url: string;
  logo_url: string;
  contact_info: {
    phone: string;
    email: string;
    address: string;
    website: string;
  };
  signup_settings: {
    trial_enabled: boolean;
    trial_duration_days: number;
    auto_approval: boolean;
    application_questions: string[];
  };
}

export const ChamberProfileForm: React.FC<ChamberProfileFormProps> = ({
  chamber,
  onSave,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<ChamberProfileData>({
    name: chamber?.name || '',
    headline: chamber?.headline || '',
    description: chamber?.description || '',
    banner_image_url: chamber?.banner_image_url || '',
    logo_url: chamber?.logo_url || '',
    contact_info: {
      phone: chamber?.contact_info?.phone || '',
      email: chamber?.contact_info?.email || '',
      address: chamber?.contact_info?.address || '',
      website: chamber?.contact_info?.website || '',
    },
    signup_settings: {
      trial_enabled: chamber?.signup_settings?.trial_enabled || true,
      trial_duration_days: chamber?.signup_settings?.trial_duration_days || 7,
      auto_approval: chamber?.signup_settings?.auto_approval || false,
      application_questions: chamber?.signup_settings?.application_questions || [
        'What type of business do you operate?',
        'How long have you been in business?',
        'What are you hoping to gain from chamber membership?'
      ],
    },
  });

  const [activeSection, setActiveSection] = useState('basic');

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ChamberProfileData],
        [field]: value,
      },
    }));
  };

  const updateNestedData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof ChamberProfileData] as any),
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Chamber name is required');
      return;
    }
    onSave(formData);
  };

  const pickImage = (type: 'banner' | 'logo') => {
    // Placeholder for image picker
    Alert.alert('Image Upload', `${type} image upload will be implemented`);
  };

  const renderBasicInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      
      {/* Chamber Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Chamber Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="Enter chamber name"
        />
      </View>

      {/* Headline */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Headline</Text>
        <TextInput
          style={styles.input}
          value={formData.headline}
          onChangeText={(value) => setFormData(prev => ({ ...prev, headline: value }))}
          placeholder="Catchy headline for your chamber"
          maxLength={100}
        />
        <Text style={styles.charCount}>{formData.headline.length}/100</Text>
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="Describe your chamber's mission and values"
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        <Text style={styles.charCount}>{formData.description.length}/500</Text>
      </View>
    </View>
  );

  const renderImages = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Branding</Text>
      
      {/* Banner Image */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Banner Image</Text>
        <TouchableOpacity 
          style={styles.imageUpload}
          onPress={() => pickImage('banner')}
        >
          {formData.banner_image_url ? (
            <Image source={{ uri: formData.banner_image_url }} style={styles.bannerPreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={40} color="#666" />
              <Text style={styles.placeholderText}>Upload Banner Image</Text>
              <Text style={styles.placeholderSubtext}>Recommended: 1200x400px</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Logo</Text>
        <TouchableOpacity 
          style={styles.logoUpload}
          onPress={() => pickImage('logo')}
        >
          {formData.logo_url ? (
            <Image source={{ uri: formData.logo_url }} style={styles.logoPreview} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Ionicons name="business-outline" size={30} color="#666" />
              <Text style={styles.placeholderText}>Upload Logo</Text>
              <Text style={styles.placeholderSubtext}>Square format preferred</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContactInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={formData.contact_info.phone}
          onChangeText={(value) => updateNestedData('contact_info', 'phone', value)}
          placeholder="(555) 123-4567"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={formData.contact_info.email}
          onChangeText={(value) => updateNestedData('contact_info', 'email', value)}
          placeholder="info@chamber.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Physical Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.contact_info.address}
          onChangeText={(value) => updateNestedData('contact_info', 'address', value)}
          placeholder="123 Main St, City, State 12345"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={formData.contact_info.website}
          onChangeText={(value) => updateNestedData('contact_info', 'website', value)}
          placeholder="https://www.chamber.com"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  const renderSignupSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Membership Applications</Text>
      
      {/* Trial Settings */}
      <View style={styles.inputGroup}>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Enable Trial Memberships</Text>
          <TouchableOpacity
            style={[styles.toggle, formData.signup_settings.trial_enabled && styles.toggleActive]}
            onPress={() => updateNestedData('signup_settings', 'trial_enabled', !formData.signup_settings.trial_enabled)}
          >
            <View style={[styles.toggleDot, formData.signup_settings.trial_enabled && styles.toggleDotActive]} />
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>Allow businesses to try chamber membership for free</Text>
      </View>

      {formData.signup_settings.trial_enabled && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Trial Duration (Days)</Text>
          <TextInput
            style={styles.input}
            value={formData.signup_settings.trial_duration_days.toString()}
            onChangeText={(value) => updateNestedData('signup_settings', 'trial_duration_days', parseInt(value) || 7)}
            placeholder="7"
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Auto Approval */}
      <View style={styles.inputGroup}>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Auto-Approve Applications</Text>
          <TouchableOpacity
            style={[styles.toggle, formData.signup_settings.auto_approval && styles.toggleActive]}
            onPress={() => updateNestedData('signup_settings', 'auto_approval', !formData.signup_settings.auto_approval)}
          >
            <View style={[styles.toggleDot, formData.signup_settings.auto_approval && styles.toggleDotActive]} />
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>Automatically approve new member applications</Text>
      </View>

      {/* Application Questions */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Application Questions</Text>
        {formData.signup_settings.application_questions.map((question, index) => (
          <View key={index} style={styles.questionRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={question}
              onChangeText={(value) => {
                const newQuestions = [...formData.signup_settings.application_questions];
                newQuestions[index] = value;
                updateNestedData('signup_settings', 'application_questions', newQuestions);
              }}
              placeholder={`Question ${index + 1}`}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                const newQuestions = formData.signup_settings.application_questions.filter((_, i) => i !== index);
                updateNestedData('signup_settings', 'application_questions', newQuestions);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            const newQuestions = [...formData.signup_settings.application_questions, ''];
            updateNestedData('signup_settings', 'application_questions', newQuestions);
          }}
        >
          <Ionicons name="add-circle" size={20} color="#007AFF" />
          <Text style={styles.addButtonText}>Add Question</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const sections = [
    { key: 'basic', title: 'Basic Info', icon: 'information-circle-outline' },
    { key: 'images', title: 'Branding', icon: 'image-outline' },
    { key: 'contact', title: 'Contact', icon: 'call-outline' },
    { key: 'signup', title: 'Applications', icon: 'people-outline' },
  ];

  return (
    <View style={styles.container}>
      {/* Section Tabs */}
      <View style={styles.tabs}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.key}
            style={[styles.tab, activeSection === section.key && styles.activeTab]}
            onPress={() => setActiveSection(section.key)}
          >
            <Ionicons 
              name={section.icon as any} 
              size={20} 
              color={activeSection === section.key ? '#007AFF' : '#666'} 
            />
            <Text style={[styles.tabText, activeSection === section.key && styles.activeTabText]}>
              {section.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === 'basic' && renderBasicInfo()}
        {activeSection === 'images' && renderImages()}
        {activeSection === 'contact' && renderContactInfo()}
        {activeSection === 'signup' && renderSignupSettings()}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update Chamber' : 'Create Chamber'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoUpload: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  bannerPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});