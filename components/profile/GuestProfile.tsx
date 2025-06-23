import { StyleSheet, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function GuestProfile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1760900/pexels-photo-1760900.jpeg' }}
            style={styles.guestImage}
          />
        </View>
        
        <Text style={styles.guestTitle}>Guest User</Text>
        <Text style={styles.guestText}>
          Create an account to access all features and connect with chamber members.
        </Text>
        
        <Button
          title="Sign Up"
          onPress={() => router.push('/(auth)/register')}
          variant="primary"
          size="large"
          style={styles.signupButton}
        />
        
        <Button
          title="Sign In"
          onPress={() => router.push('/(auth)/login')}
          variant="outline"
          size="large"
          style={styles.loginButton}
        />
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Guest Features</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <Card style={styles.featureCard}>
          <Text style={styles.featureTitle}>Business Directory</Text>
          <Text style={styles.featureText}>
            Browse and search for businesses in your local chamber.
          </Text>
          <Button
            title="View Directory"
            onPress={() => router.push('/directory')}
            variant="secondary"
            size="medium"
            style={styles.featureButton}
          />
        </Card>
        
        <Card style={styles.featureCard}>
          <Text style={styles.featureTitle}>Service Requests</Text>
          <Text style={styles.featureText}>
            Send service inquiries to chamber businesses.
          </Text>
          <Button
            title="Browse Businesses"
            onPress={() => router.push('/directory')}
            variant="secondary"
            size="medium"
            style={styles.featureButton}
          />
        </Card>
        
        <Card style={styles.featureCard}>
          <Text style={styles.featureTitle}>Upcoming Events</Text>
          <Text style={styles.featureText}>
            View upcoming chamber events and activities.
          </Text>
          <Button
            title="See Events"
            onPress={() => router.push('/feed')}
            variant="secondary"
            size="medium"
            style={styles.featureButton}
          />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 16,
  },
  guestImage: {
    width: '100%',
    height: '100%',
  },
  guestTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
  },
  guestText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  signupButton: {
    width: '100%',
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
    marginBottom: 32,
  },
  divider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
  },
  featureCard: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  featureButton: {
    alignSelf: 'flex-start',
  },
});