import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Phone } from 'lucide-react-native';
import { Business } from '@/utils/types';
import { Badge } from '@/components/ui/Badge';

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push({
      pathname: '/(modals)/member-details',
      params: { memberId: business.id, type: 'business' }
    });
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <Image 
        source={{ uri: business.imageUrl }} 
        style={styles.image}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{business.name}</Text>
          <Badge text={business.category} variant="default" />
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {business.description}
        </Text>
        
        <View style={styles.details}>
          {business.address && (
            <View style={styles.detailItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.detailText} numberOfLines={1}>
                {business.address}
              </Text>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <Phone size={16} color="#6B7280" />
            <Text style={styles.detailText}>{business.phone}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});