import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';

interface FeedPost {
  id: string;
  type: 'chamber_event' | 'business_post' | 'chamber_announcement';
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
    business_name?: string;
    is_chamber_admin?: boolean;
  };
  created_at: string;
  updated_at?: string;
  priority: 'high' | 'normal' | 'low';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail_url?: string;
  }[];
  event_details?: {
    start_date: string;
    end_date?: string;
    location: string;
    registration_required: boolean;
    max_attendees?: number;
    current_attendees: number;
  };
  tags?: string[];
  is_liked?: boolean;
  is_saved?: boolean;
}

interface ChamberFeedProps {
  chamberId: string;
  currentUserId: string;
  isAdmin?: boolean;
  onCreatePost?: () => void;
  onPostPress?: (post: FeedPost) => void;
  onEventRegister?: (eventId: string) => void;
}

export const ChamberFeed: React.FC<ChamberFeedProps> = ({
  chamberId,
  currentUserId,
  isAdmin = false,
  onCreatePost,
  onPostPress,
  onEventRegister,
}) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'events' | 'announcements' | 'posts'>('all');

  // Mock data - replace with actual API calls
  const mockPosts: FeedPost[] = [
    {
      id: '1',
      type: 'chamber_event',
      title: 'Monthly Business Mixer',
      content: 'Join us for our monthly networking event! Meet fellow chamber members, share ideas, and build valuable connections. Light refreshments will be provided.',
      author: {
        id: 'chamber_admin',
        name: 'Chamber Admin',
        is_chamber_admin: true,
      },
      created_at: '2025-01-15T10:00:00Z',
      priority: 'high',
      engagement: { likes: 24, comments: 8, shares: 5 },
      event_details: {
        start_date: '2025-01-25T18:00:00Z',
        end_date: '2025-01-25T21:00:00Z',
        location: 'Chamber Conference Room',
        registration_required: true,
        max_attendees: 50,
        current_attendees: 32,
      },
      tags: ['networking', 'mixer', 'monthly'],
    },
    {
      id: '2',
      type: 'business_post',
      title: 'New Service Launch!',
      content: 'Excited to announce our new AI consulting services! We help businesses optimize their operations with cutting-edge AI solutions.',
      author: {
        id: 'user_1',
        name: 'John Smith',
        business_name: 'Idea/R - Ideas Realized',
        avatar_url: 'https://via.placeholder.com/40',
      },
      created_at: '2025-01-14T15:30:00Z',
      priority: 'normal',
      engagement: { likes: 12, comments: 3, shares: 2 },
      media: [
        {
          type: 'image',
          url: 'https://via.placeholder.com/400x200',
        }
      ],
      tags: ['ai', 'consulting', 'business-optimization'],
    },
    {
      id: '3',
      type: 'chamber_announcement',
      title: 'New Member Welcome',
      content: 'Please join us in welcoming our newest chamber members! We now have 150+ businesses in our network.',
      author: {
        id: 'chamber_admin',
        name: 'Chamber Admin',
        is_chamber_admin: true,
      },
      created_at: '2025-01-13T09:00:00Z',
      priority: 'normal',
      engagement: { likes: 18, comments: 12, shares: 4 },
      tags: ['welcome', 'members', 'growth'],
    },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            is_liked: !post.is_liked,
            engagement: {
              ...post.engagement,
              likes: post.is_liked ? post.engagement.likes - 1 : post.engagement.likes + 1
            }
          }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    Alert.alert('Comments', 'Comment functionality will be implemented');
  };

  const handleShare = (postId: string) => {
    Alert.alert('Share', 'Share functionality will be implemented');
  };

  const handleEventRegister = (postId: string) => {
    if (onEventRegister) {
      onEventRegister(postId);
    } else {
      Alert.alert('Registration', 'Event registration will be implemented');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'events') return post.type === 'chamber_event';
    if (filter === 'announcements') return post.type === 'chamber_announcement';
    if (filter === 'posts') return post.type === 'business_post';
    return true;
  }).sort((a, b) => {
    // Priority sorting: high > normal > low
    const priorityOrder = { high: 3, normal: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    // Then by date
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days === 0) {
      if (hours === 0) return 'Just now';
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderPostHeader = (post: FeedPost) => (
    <View style={styles.postHeader}>
      <View style={styles.authorInfo}>
        {post.author.avatar_url ? (
          <Image source={{ uri: post.author.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons 
              name={post.author.is_chamber_admin ? "business" : "person"} 
              size={20} 
              color="#666" 
            />
          </View>
        )}
        <View style={styles.authorDetails}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          {post.author.business_name && (
            <Text style={styles.businessName}>{post.author.business_name}</Text>
          )}
          {post.author.is_chamber_admin && (
            <View style={styles.adminBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#007AFF" />
              <Text style={styles.adminBadgeText}>Chamber Admin</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.postMeta}>
        {post.priority === 'high' && (
          <View style={styles.priorityBadge}>
            <Ionicons name="star" size={12} color="#ff6b35" />
          </View>
        )}
        <Text style={styles.postDate}>{formatDate(post.created_at)}</Text>
      </View>
    </View>
  );

  const renderEventDetails = (post: FeedPost) => {
    if (!post.event_details) return null;

    const eventDate = new Date(post.event_details.start_date);
    const isRegistrationFull = post.event_details.max_attendees 
      ? post.event_details.current_attendees >= post.event_details.max_attendees 
      : false;

    return (
      <View style={styles.eventDetails}>
        <View style={styles.eventInfo}>
          <View style={styles.eventInfoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.eventInfoText}>
              {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.eventInfoRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.eventInfoText}>{post.event_details.location}</Text>
          </View>
          {post.event_details.max_attendees && (
            <View style={styles.eventInfoRow}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.eventInfoText}>
                {post.event_details.current_attendees}/{post.event_details.max_attendees} attending
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.registerButton, isRegistrationFull && styles.registerButtonDisabled]}
          onPress={() => handleEventRegister(post.id)}
          disabled={isRegistrationFull}
        >
          <Text style={[styles.registerButtonText, isRegistrationFull && styles.registerButtonTextDisabled]}>
            {isRegistrationFull ? 'Full' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMedia = (post: FeedPost) => {
    if (!post.media || post.media.length === 0) return null;

    return (
      <View style={styles.mediaContainer}>
        {post.media.map((media, index) => (
          <Image
            key={index}
            source={{ uri: media.url }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  };

  const renderEngagement = (post: FeedPost) => (
    <View style={styles.engagement}>
      <TouchableOpacity 
        style={styles.engagementButton}
        onPress={() => handleLike(post.id)}
      >
        <Ionicons 
          name={post.is_liked ? "heart" : "heart-outline"} 
          size={20} 
          color={post.is_liked ? "#ff4444" : "#666"} 
        />
        <Text style={styles.engagementText}>{post.engagement.likes}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.engagementButton}
        onPress={() => handleComment(post.id)}
      >
        <Ionicons name="chatbubble-outline" size={20} color="#666" />
        <Text style={styles.engagementText}>{post.engagement.comments}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.engagementButton}
        onPress={() => handleShare(post.id)}
      >
        <Ionicons name="share-outline" size={20} color="#666" />
        <Text style={styles.engagementText}>{post.engagement.shares}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTags = (post: FeedPost) => {
    if (!post.tags || post.tags.length === 0) return null;

    return (
      <View style={styles.tagsContainer}>
        {post.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPost = ({ item: post }: { item: FeedPost }) => (
    <TouchableOpacity 
      style={styles.postCard}
      onPress={() => onPostPress?.(post)}
      activeOpacity={0.95}
    >
      {renderPostHeader(post)}
      
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postText}>{post.content}</Text>
      </View>

      {renderMedia(post)}
      {renderEventDetails(post)}
      {renderTags(post)}
      {renderEngagement(post)}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.filterContainer}>
        {(['all', 'events', 'announcements', 'posts'] as const).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={[styles.filterButtonText, filter === filterType && styles.filterButtonTextActive]}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {isAdmin && onCreatePost && (
        <TouchableOpacity style={styles.createPostButton} onPress={onCreatePost}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createPostButtonText}>Create Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={filteredPosts}
        renderItem={renderPost}
        estimatedItemSize={300}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    alignSelf: 'flex-start',
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  businessName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  adminBadgeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    padding: 4,
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  postText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  mediaContainer: {
    marginBottom: 12,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  eventInfo: {
    marginBottom: 12,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  eventInfoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  registerButtonTextDisabled: {
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  engagement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  engagementText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});