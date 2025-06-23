import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { MessageCircle, Heart, Calendar, MapPin } from 'lucide-react-native';
import { Post } from '@/utils/types';
import { formatRelativeTime } from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const getPostTypeColor = () => {
    switch (post.type) {
      case 'event':
        return '#D97706';
      case 'question':
        return '#DC2626';
      case 'update':
        return '#10B981';
      default:
        return '#2563EB';
    }
  };
  
  const getPostTypeLabel = () => {
    switch (post.type) {
      case 'event':
        return 'Event';
      case 'question':
        return 'Question';
      case 'update':
        return 'Update';
      default:
        return 'Post';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: post.author.imageUrl }} 
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{post.author.name}</Text>
            <Text style={styles.postTime}>{formatRelativeTime(post.date)}</Text>
          </View>
        </View>
        <Badge text={getPostTypeLabel()} variant={
          post.type === 'event' ? 'warning' : 
          post.type === 'question' ? 'error' : 
          'success'
        } />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.content}</Text>
        
        {post.type === 'event' && post.eventDetails && (
          <View style={styles.eventDetails}>
            <View style={styles.eventDetail}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.eventDetailText}>{post.eventDetails.date}</Text>
            </View>
            
            <View style={styles.eventDetail}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.eventDetailText}>{post.eventDetails.location}</Text>
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Pressable style={styles.action}>
          <Heart size={20} color="#6B7280" />
          <Text style={styles.actionText}>Like</Text>
        </Pressable>
        
        <Pressable style={styles.action}>
          <MessageCircle size={20} color="#6B7280" />
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  postTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  eventDetails: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});