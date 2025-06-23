import { StyleSheet, View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Phone, Mail, Globe, MessageSquare, MapPin } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { businesses, users } from '@/utils/data';
import { Business, User } from '@/utils/types';
import { useAuth } from '@/utils/auth';

export default function MemberDetailsScreen() {
  const { memberId, type } = useLocalSearchParams<{ memberId: string; type: 'business' | 'user' }>();
  const { isAuthenticated } = useAuth();
  
  let member: Business | User | undefined;
  
  if (type === 'business') {
    member = businesses.find(b => b.id === memberId);
  } else {
    member = users.find(u => u.id === memberId);
  }
  
  if (!member) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color="#1F2937" />
          </Pressable>
          <Text style={styles.title}>Member Not Found</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>The requested member could not be found.</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
            size="large"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const isBusiness = 'category' in member;
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.title}>{isBusiness ? 'Business' : 'Member'}</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ 
              uri: isBusiness 
                ? 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg' 
                : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' 
            }}
            style={styles.profileImage}
          />
          
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{isBusiness ? (member as Business).name : (member as User).username}</Text>
            {isBusiness && (
              <Badge text={(member as Business).category} variant="default" />
            )}
          </View>
          
          {isBusiness && (
            <Text style={styles.description}>{(member as Business).description}</Text>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          {isAuthenticated ? (
            <Button
              title="Message"
              onPress={() => router.push('/messages')}
              variant="primary"
              size="large"
              iconLeft={<MessageSquare size={20} color="#FFFFFF" />}
            />
          ) : (
            <Button
              title="Request Service"
              onPress={() => router.push({
                pathname: '/(modals)/service-request',
                params: { businessId: member?.id }
              })}
              variant="primary"
              size="large"
            />
          )}
        </View>
        
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Phone size={20} color="#6B7280" />
            <Text style={styles.contactText}>
              {isBusiness ? (member as Business).phone : '(555) 123-4567'}
            </Text>
          </View>
          
          <View style={styles.contactItem}>
            <Mail size={20} color="#6B7280" />
            <Text style={styles.contactText}>
              {isBusiness ? (member as Business).email : (member as User).email}
            </Text>
          </View>
          
          {isBusiness && (member as Business).website && (
            <View style={styles.contactItem}>
              <Globe size={20} color="#6B7280" />
              <Text style={styles.contactText}>{(member as Business).website}</Text>
            </View>
          )}
          
          {isBusiness && (member as Business).address && (
            <View style={styles.contactItem}>
              <MapPin size={20} color="#6B7280" />
              <Text style={styles.contactText}>{(member as Business).address}</Text>
            </View>
          )}
        </View>
        
        {isBusiness && (
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.servicesList}>
              {(member as Business).services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
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
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contactSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  servicesSection: {
    padding: 16,
    paddingBottom: 32,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: '100%',
  },
});