import { ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import { BusinessCategory } from '@/utils/types';

interface CategoryFilterProps {
  selectedCategory: BusinessCategory | null;
  onSelectCategory: (category: BusinessCategory | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const categories: BusinessCategory[] = [
    'Accounting',
    'Construction',
    'Consulting',
    'Education',
    'Food & Beverage',
    'Healthcare',
    'Legal',
    'Marketing',
    'Real Estate',
    'Retail',
    'Technology'
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Pressable
        style={[
          styles.categoryButton,
          !selectedCategory && styles.selectedCategory,
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text
          style={[
            styles.categoryText,
            !selectedCategory && styles.selectedCategoryText,
          ]}
        >
          All
        </Text>
      </Pressable>

      {categories.map((category) => (
        <Pressable
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategory,
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText,
            ]}
          >
            {category}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  selectedCategory: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
});