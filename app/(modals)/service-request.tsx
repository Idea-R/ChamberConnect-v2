import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { businesses } from '@/utils/data';

export default function ServiceRequestScreen() {
  const { businessId } = useLocalSearchParams<{ businessId: string }>();
  const business = businesses.find(b => b.id === businessId);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !message) {
      setError('Please fill out all required fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.title}>Service Request</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {!submitted ? (
          <>
            {business && (
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>To: {business.name}</Text>
                <Text style={styles.businessCategory}>{business.category}</Text>
              </View>
            )}
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Input
              label="Your Name *"
              placeholder="John Smith"
              value={name}
              onChangeText={setName}
            />
            
            <Input
              label="Email *"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.spacedInput}
            />
            
            <Input
              label="Phone (optional)"
              placeholder="(555) 123-4567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.spacedInput}
            />
            
            <Text style={styles.textAreaLabel}>Message *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe what you're looking for..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            
            <Button
              title="Send Request"
              onPress={handleSubmit}
              variant="primary"
              size="large"
              loading={isLoading}
              style={styles.submitButton}
            />
          </>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Request Sent!</Text>
            <Text style={styles.successText}>
              Your service request has been sent to {business?.name}. They will contact you shortly.
            </Text>
            <Button
              title="Done"
              onPress={() => router.back()}
              variant="primary"
              size="large"
              style={styles.doneButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  businessInfo: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 24,
  },
  businessName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  businessCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 16,
  },
  spacedInput: {
    marginTop: 16,
  },
  textAreaLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 16,
  },
  textArea: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    height: 120,
  },
  submitButton: {
    marginTop: 24,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  successTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 16,
  },
  successText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  doneButton: {
    width: '100%',
  },
});