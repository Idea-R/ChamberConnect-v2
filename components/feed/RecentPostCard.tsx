import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { Post } from '@/utils/types';
import { formatRelativeTime } from '@/utils/helpers';

interface RecentPostCardProps {
  post: Post;
}

export function RecentPostCard({ post }: RecentPostCardProps) {
  const router = useRouter();

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
    <Pressable 
      style={styles.card}
      onPress={() => router.push('/feed')}
    >
      <View style={styles.header}>
        <View style={[styles.postType, { backgroundColor: getPostTypeColor() }]}>
          <Text style={styles.postTypeText}>{getPostTypeLabel()}</Text>
        </View>
        <Text style={styles.postTime}>{formatRelativeTime(post.date)}</Text>
      </View>
      
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>Posted by {post.author.name}</Text>
      
      <View style={styles.footer}>
        <View style={styles.comments}>
          <MessageCircle size={16} color="#6B7280" />
          <Text style={styles.commentsText}>{post.commentCount} comments</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  postTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  author: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comments: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});