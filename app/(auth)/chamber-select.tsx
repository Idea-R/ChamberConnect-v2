import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { ChamberCard } from '@/components/auth/ChamberCard';
import { Chamber } from '@/utils/types';
import { chambers } from '@/utils/data';
import { useAuth } from '@/utils/auth';

export default function ChamberSelectScreen() {
  const router = useRouter();
  const { updateUserChamber } = useAuth();
  const [selectedChamber, setSelectedChamber] = useState<Chamber | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedChamber) return;
    
    setIsLoading(true);
    try {
      await updateUserChamber(selectedChamber.id);
      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.title}>Select Your Chamber</Text>
        <Text style={styles.subtitle}>Choose the Chamber of Commerce you'd like to join</Text>
      </View>
      
      <ScrollView style={styles.chamberList} contentContainerStyle={styles.chamberListContent}>
        {chambers.map((chamber) => (
          <ChamberCard
            key={chamber.id}
            chamber={chamber}
            isSelected={selectedChamber?.id === chamber.id}
            onSelect={() => setSelectedChamber(chamber)}
          />
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="large"
          disabled={!selectedChamber}
          loading={isLoading}
        />
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
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  chamberList: {
    flex: 1,
  },
  chamberListContent: {
    padding: 16,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
});