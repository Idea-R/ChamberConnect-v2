import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BusinessSignupFlowProps {
  chamber: {
    id: string;
    name: string;
    signup_settings: {
      trial_enabled: boolean;
      trial_duration_days: number;
      auto_approval: boolean;
      application_questions: string[];
    };
  };
  onSubmit: (data: BusinessApplicationData, isTrial: boolean) => void;
  onBack: () => void;
}

interface BusinessApplicationData {
  business_name: string;
  business_type: string;
  contact_person: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  years_in_business: string;
  employee_count: string;
  annual_revenue_range: string;
  application_answers: string[];
  referral_source?: string;
  additional_notes?: string;
}

export const BusinessSignupFlow: React.FC<BusinessSignupFlowProps> = ({
  chamber,
  onSubmit,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [signupType, setSignupType] = useState<'trial' | 'full' | null>(null);
  const [formData, setFormData] = useState<BusinessApplicationData>({
    business_name: '',
    business_type: '',
    contact_person: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    years_in_business: '',
    employee_count: '',
    annual_revenue_range: '',
    application_answers: chamber.signup_settings.application_questions.map(() => ''),
    referral_source: '',
    additional_notes: '',
  });

  const updateFormData = (field: keyof BusinessApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAnswer = (index: number, answer: string) => {
    setFormData(prev => ({
      ...prev,
      application_answers: prev.application_answers.map((a, i) => i === index ? answer : a)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Signup type selection
        return signupType !== null;
      case 1: // Basic business info
        return !!(formData.business_name && formData.business_type && formData.contact_person);
      case 2: // Contact info
        return !!(formData.email && formData.phone && formData.address);
      case 3: // Business details
        return !!(formData.years_in_business && formData.employee_count);
      case 4: // Application questions
        return formData.application_answers.every(answer => answer.trim().length > 0);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Required Fields', 'Please fill in all required fields before continuing.');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep === 0) {
      onBack();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Required Fields', 'Please fill in all required fields.');
      return;
    }
    onSubmit(formData, signupType === 'trial');
  };

  const renderSignupTypeSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Membership Option</Text>
      <Text style={styles.stepSubtitle}>
        Select the option that best fits your needs
      </Text>

      {/* Trial Option */}
      {chamber.signup_settings.trial_enabled && (
        <TouchableOpacity
          style={[styles.optionCard, signupType === 'trial' && styles.selectedOption]}
          onPress={() => setSignupType('trial')}
        >
          <View style={styles.optionHeader}>
            <View style={styles.trialBadge}>
              <Text style={styles.trialBadgeText}>FREE TRIAL</Text>
            </View>
            <Text style={styles.optionTitle}>
              {chamber.signup_settings.trial_duration_days}-Day Trial
            </Text>
          </View>
          <Text style={styles.optionDescription}>
            Experience all chamber benefits for {chamber.signup_settings.trial_duration_days} days at no cost. 
            Perfect for exploring what membership offers before committing.
          </Text>
          <View style={styles.optionFeatures}>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.featureText}>Full access to member directory</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.featureText}>Attend chamber events</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.featureText}>Post in community feed</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.featureText}>No commitment required</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Full Membership Option */}
      <TouchableOpacity
        style={[styles.optionCard, signupType === 'full' && styles.selectedOption]}
        onPress={() => setSignupType('full')}
      >
        <View style={styles.optionHeader}>
          <Text style={styles.optionTitle}>Full Membership Application</Text>
        </View>
        <Text style={styles.optionDescription}>
          Apply for full chamber membership with all benefits and networking opportunities.
        </Text>
        <View style={styles.optionFeatures}>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
            <Text style={styles.featureText}>All trial benefits included</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
            <Text style={styles.featureText}>Priority event access</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
            <Text style={styles.featureText}>Business referral opportunities</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={16} color="#007AFF" />
            <Text style={styles.featureText}>Voting rights in chamber decisions</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about your business</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.business_name}
          onChangeText={(value) => updateFormData('business_name', value)}
          placeholder="Enter your business name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Type *</Text>
        <TextInput
          style={styles.input}
          value={formData.business_type}
          onChangeText={(value) => updateFormData('business_type', value)}
          placeholder="e.g., Restaurant, Consulting, Retail"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Primary Contact Person *</Text>
        <TextInput
          style={styles.input}
          value={formData.contact_person}
          onChangeText={(value) => updateFormData('contact_person', value)}
          placeholder="Full name of main contact"
        />
      </View>
    </View>
  );

  const renderContactInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Contact Information</Text>
      <Text style={styles.stepSubtitle}>How can we reach you?</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          placeholder="business@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(value) => updateFormData('phone', value)}
          placeholder="(555) 123-4567"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={formData.website}
          onChangeText={(value) => updateFormData('website', value)}
          placeholder="https://www.yourbusiness.com"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Business Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.address}
          onChangeText={(value) => updateFormData('address', value)}
          placeholder="123 Main St, City, State 12345"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderBusinessDetails = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business Details</Text>
      <Text style={styles.stepSubtitle}>Help us understand your business better</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Years in Business *</Text>
        <TextInput
          style={styles.input}
          value={formData.years_in_business}
          onChangeText={(value) => updateFormData('years_in_business', value)}
          placeholder="e.g., 5 years, Since 2019"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Number of Employees *</Text>
        <TextInput
          style={styles.input}
          value={formData.employee_count}
          onChangeText={(value) => updateFormData('employee_count', value)}
          placeholder="e.g., 1-5, 10-25, 50+"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Annual Revenue Range</Text>
        <TextInput
          style={styles.input}
          value={formData.annual_revenue_range}
          onChangeText={(value) => updateFormData('annual_revenue_range', value)}
          placeholder="e.g., Under $100K, $100K-$500K, $1M+"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>How did you hear about us?</Text>
        <TextInput
          style={styles.input}
          value={formData.referral_source}
          onChangeText={(value) => updateFormData('referral_source', value)}
          placeholder="e.g., Member referral, Google search, Event"
        />
      </View>
    </View>
  );

  const renderApplicationQuestions = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Application Questions</Text>
      <Text style={styles.stepSubtitle}>
        Please answer the following questions to complete your application
      </Text>

      {chamber.signup_settings.application_questions.map((question, index) => (
        <View key={index} style={styles.inputGroup}>
          <Text style={styles.label}>{question} *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.application_answers[index]}
            onChangeText={(answer) => updateAnswer(index, answer)}
            placeholder="Your answer..."
            multiline
            numberOfLines={4}
          />
        </View>
      ))}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.additional_notes}
          onChangeText={(value) => updateFormData('additional_notes', value)}
          placeholder="Anything else you'd like us to know?"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review Your Application</Text>
      <Text style={styles.stepSubtitle}>
        Please review your information before submitting
      </Text>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSectionTitle}>Membership Type</Text>
        <Text style={styles.reviewText}>
          {signupType === 'trial' 
            ? `${chamber.signup_settings.trial_duration_days}-Day Free Trial` 
            : 'Full Membership Application'}
        </Text>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSectionTitle}>Business Information</Text>
        <Text style={styles.reviewText}>{formData.business_name}</Text>
        <Text style={styles.reviewText}>{formData.business_type}</Text>
        <Text style={styles.reviewText}>{formData.contact_person}</Text>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSectionTitle}>Contact Information</Text>
        <Text style={styles.reviewText}>{formData.email}</Text>
        <Text style={styles.reviewText}>{formData.phone}</Text>
        {formData.website && <Text style={styles.reviewText}>{formData.website}</Text>}
      </View>

      {signupType === 'trial' && (
        <View style={styles.trialNotice}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.trialNoticeText}>
            Your trial will begin immediately upon approval and last for {chamber.signup_settings.trial_duration_days} days.
            You can upgrade to full membership at any time.
          </Text>
        </View>
      )}
    </View>
  );

  const steps = [
    'Membership Type',
    'Business Info',
    'Contact Info', 
    'Business Details',
    'Questions',
    'Review'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderSignupTypeSelection();
      case 1: return renderBasicInfo();
      case 2: return renderContactInfo();
      case 3: return renderBusinessDetails();
      case 4: return renderApplicationQuestions();
      case 5: return renderReview();
      default: return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${((currentStep + 1) / steps.length) * 100}%` }]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <Ionicons name="chevron-back" size={20} color="#666" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextButton, !validateStep(currentStep) && styles.disabledButton]} 
          onPress={currentStep === steps.length - 1 ? handleSubmit : nextStep}
          disabled={!validateStep(currentStep)}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? 'Submit Application' : 'Continue'}
          </Text>
          {currentStep < steps.length - 1 && (
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  optionCard: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  trialBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trialBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  optionFeatures: {
    gap: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
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
  reviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  trialNotice: {
    flexDirection: 'row',
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  trialNoticeText: {
    flex: 1,
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});