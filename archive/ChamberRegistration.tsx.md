import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Mail, Phone, Globe, MapPin, ArrowRight, Check, Upload } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

interface ChamberData {
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface ChamberRegistrationProps {
  onComplete?: (chamberId: string) => void;
}

export default function ChamberRegistration({ onComplete }: ChamberRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [chamberData, setChamberData] = useState<ChamberData>({
    name: '',
    slug: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const totalSteps = 3;

  // Auto-generate slug from chamber name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setChamberData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(chamberData.name && chamberData.description && chamberData.address);
      case 2:
        return !!(chamberData.email && chamberData.phone);
      case 3:
        return !!(chamberData.contactName && chamberData.contactEmail);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      Alert.alert('Missing Information', 'Please fill in all required fields before continuing.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Check if slug is available
      const { data: existingChamber } = await supabase
        .from('chambers')
        .select('id')
        .eq('slug', chamberData.slug)
        .single();

      if (existingChamber) {
        Alert.alert('Chamber Already Exists', 'A chamber with this name already exists. Please choose a different name.');
        setLoading(false);
        return;
      }

      // Create chamber
      const { data: chamber, error: chamberError } = await supabase
        .from('chambers')
        .insert({
          name: chamberData.name,
          slug: chamberData.slug,
          description: chamberData.description,
          address: chamberData.address,
          phone: chamberData.phone,
          email: chamberData.email,
          website: chamberData.website,
        })
        .select()
        .single();

      if (chamberError) throw chamberError;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && chamber) {
        // Add user as chamber admin
        const { error: adminError } = await supabase
          .from('chamber_admins')
          .insert({
            chamber_id: chamber.id,
            user_id: user.id,
            role: 'admin'
          });

        if (adminError) throw adminError;

        Alert.alert(
          'Success!', 
          'Your chamber has been created successfully. You can now start adding members and managing your chamber.',
          [
            {
              text: 'Get Started',
              onPress: () => {
                if (onComplete) {
                  onComplete(chamber.id);
                } else {
                  router.push(`/(tabs)/`);
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Chamber registration error:', error);
      Alert.alert('Registration Failed', 'There was an error creating your chamber. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View className="flex-row justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <View key={step} className="flex-row items-center">
          <View 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            {step < currentStep ? (
              <Check size={16} color="white" />
            ) : (
              <Text className={`text-sm font-semibold ${
                step <= currentStep ? 'text-white' : 'text-gray-600'
              }`}>
                {step}
              </Text>
            )}
          </View>
          {step < 3 && (
            <View 
              className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`} 
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View className="space-y-6">
      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
        Chamber Information
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Tell us about your chamber of commerce
      </Text>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Chamber Name *</Text>
          <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <Building2 size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="e.g., Sonoma Valley Chamber of Commerce"
              value={chamberData.name}
              onChangeText={handleNameChange}
              autoCapitalize="words"
            />
          </View>
          {chamberData.slug && (
            <Text className="text-xs text-gray-500 mt-1">
              URL: chamberconnect.net/{chamberData.slug}
            </Text>
          )}
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Description *</Text>
          <TextInput
            className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 text-gray-900"
            placeholder="Brief description of your chamber's mission and focus"
            value={chamberData.description}
            onChangeText={(text) => setChamberData(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Address *</Text>
          <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <MapPin size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Chamber office address"
              value={chamberData.address}
              onChangeText={(text) => setChamberData(prev => ({ ...prev, address: text }))}
              multiline
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="space-y-6">
      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
        Contact Information
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        How can members and businesses reach your chamber?
      </Text>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Chamber Email *</Text>
          <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <Mail size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="info@yourchamber.org"
              value={chamberData.email}
              onChangeText={(text) => setChamberData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number *</Text>
          <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <Phone size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="(555) 123-4567"
              value={chamberData.phone}
              onChangeText={(text) => setChamberData(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Website</Text>
          <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <Globe size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="https://www.yourchamber.org"
              value={chamberData.website}
              onChangeText={(text) => setChamberData(prev => ({ ...prev, website: text }))}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="space-y-6">
      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
        Primary Contact
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Who will be the main administrator for this chamber?
      </Text>

      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Contact Name *</Text>
          <TextInput
            className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 text-gray-900"
            placeholder="John Smith"
            value={chamberData.contactName}
            onChangeText={(text) => setChamberData(prev => ({ ...prev, contactName: text }))}
            autoCapitalize="words"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Contact Email *</Text>
          <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <Mail size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="john@yourchamber.org"
              value={chamberData.contactEmail}
              onChangeText={(text) => setChamberData(prev => ({ ...prev, contactEmail: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Contact Phone</Text>
          <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <Phone size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="(555) 123-4567"
              value={chamberData.contactPhone}
              onChangeText={(text) => setChamberData(prev => ({ ...prev, contactPhone: text }))}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View className="bg-blue-50 rounded-lg p-4 mt-6">
          <Text className="text-blue-800 font-medium mb-2">What happens next?</Text>
          <Text className="text-blue-700 text-sm">
            • Your chamber will be created instantly{'\n'}
            • You'll get access to the admin dashboard{'\n'}
            • You can start importing members right away{'\n'}
            • Your public directory will be live immediately
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {renderStepIndicator()}
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <View className="flex-row justify-between mt-8 mb-6">
            {currentStep > 1 ? (
              <TouchableOpacity
                onPress={handlePrevious}
                className="flex-1 mr-3 bg-gray-100 rounded-lg py-4 px-6"
              >
                <Text className="text-gray-700 font-semibold text-center">Previous</Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-1 mr-3" />
            )}

            <TouchableOpacity
              onPress={currentStep === totalSteps ? handleSubmit : handleNext}
              disabled={loading || !validateStep(currentStep)}
              className={`flex-1 ml-3 rounded-lg py-4 px-6 flex-row items-center justify-center ${
                loading || !validateStep(currentStep) 
                  ? 'bg-gray-300' 
                  : 'bg-blue-600'
              }`}
            >
              {loading ? (
                <Text className="text-white font-semibold">Creating...</Text>
              ) : (
                <>
                  <Text className="text-white font-semibold mr-2">
                    {currentStep === totalSteps ? 'Create Chamber' : 'Next'}
                  </Text>
                  <ArrowRight size={16} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 