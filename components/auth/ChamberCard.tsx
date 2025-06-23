import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Check } from 'lucide-react-native';
import { Chamber } from '@/utils/types';

interface ChamberCardProps {
  chamber: Chamber;
  isSelected: boolean;
  onSelect: () => void;
}

export function ChamberCard({ chamber, isSelected, onSelect }: ChamberCardProps) {
  return (
    <Pressable 
      style={[styles.card, isSelected && styles.selectedCard]} 
      onPress={onSelect}
    >
      <View style={styles.cardContent}>
        <Image 
          source={{ uri: chamber.imageUrl }} 
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{chamber.name}</Text>
          <Text style={styles.location}>{chamber.location}</Text>
          <Text style={styles.memberCount}>
            {chamber.memberCount} Members
          </Text>
        </View>
      </View>
      
      <View style={[styles.checkbox, isSelected && styles.selectedCheckbox]}>
        {isSelected && <Check size={16} color="#FFFFFF" />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCard: {
    borderColor: '#2563EB',
    backgroundColor: '#EBF5FF',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  memberCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
});