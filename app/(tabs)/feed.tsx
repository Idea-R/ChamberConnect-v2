import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/utils/auth';
import { Plus, Filter } from 'lucide-react-native';
import { PostCard } from '@/components/feed/PostCard';
import { PostType, Post } from '@/utils/types';
import { posts } from '@/utils/data';

export default function FeedScreen() {
  const router = useRouter();
  const { isAuthenticated, currentChamber } = useAuth();
  const [activeFilter, setActiveFilter] = useState<PostType | 'all'>('all');
  
  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.type === activeFilter);

  const filterCategories: {label: string, value: PostType | 'all', color: string}[] = [
    { label: 'All', value: 'all', color: '#2563EB' },
    { label: 'Events', value: 'event', color: '#D97706' },
    { label: 'Updates', value: 'update', color: '#0D9488' },
    { label: 'Questions', value: 'question', color: '#DC2626' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Chamber Feed</Text>
          <Text style={styles.subtitle}>
            {currentChamber?.name || 'All Chambers'}
          </Text>
        </View>
        {isAuthenticated && (
          <Pressable 
            style={styles.createButton}
            onPress={() => router.push('/(modals)/create-post')}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Post</Text>
          </Pressable>
        )}
      </View>
      
      <View style={styles.filterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filterCategories.map((category) => (
            <Pressable
              key={category.value}
              style={[
                styles.filterButton,
                activeFilter === category.value && { backgroundColor: category.color }
              ]}
              onPress={() => setActiveFilter(category.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === category.value && styles.activeFilterText
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      {filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={styles.feedContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No posts yet</Text>
          <Text style={styles.emptyStateText}>
            Be the first to post in this category!
          </Text>
          {isAuthenticated && (
            <Pressable 
              style={styles.emptyStateButton}
              onPress={() => router.push('/(modals)/create-post')}
            >
              <Text style={styles.emptyStateButtonText}>Create Post</Text>
            </Pressable>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
    zIndex: 10,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1F2937',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  filterWrapper: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  filterContainer: {
    maxHeight: 48,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  feedContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});