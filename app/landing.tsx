import { StyleSheet, Text, View, Image, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg' }}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>CC</Text>
          </View>
          <Text style={styles.title}>Chamber Connect</Text>
          <Text style={styles.subtitle}>
            Your local business community, simplified.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Join Your Chamber" 
              onPress={() => router.push('/(auth)/register')} 
              variant="primary"
              size="large"
            />
            <Button 
              title="Sign In" 
              onPress={() => router.push('/(auth)/login')} 
              variant="secondary"
              size="large"
              style={styles.secondaryButton}
            />
            <Pressable 
              onPress={() => router.push('/(tabs)')} 
              style={styles.guestLink}
            >
              <Text style={styles.guestText}>Continue as Guest</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: 'white',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#E5E7EB',
    marginBottom: 48,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  secondaryButton: {
    marginTop: 16,
  },
  guestLink: {
    marginTop: 24,
    padding: 8,
  },
  guestText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});