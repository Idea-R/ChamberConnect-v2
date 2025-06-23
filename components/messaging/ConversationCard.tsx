import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { formatRelativeTime } from '@/utils/helpers';
import { Conversation } from '@/utils/types';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
}

export function ConversationCard({ conversation, onPress }: ConversationCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: conversation.participant.imageUrl }} 
        style={styles.avatar}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{conversation.participant.name}</Text>
          <Text style={styles.time}>
            {formatRelativeTime(conversation.lastMessage.date)}
          </Text>
        </View>
        
        <Text 
          style={[
            styles.message, 
            !conversation.lastMessage.read && styles.unreadMessage
          ]}
          numberOfLines={1}
        >
          {conversation.lastMessage.content}
        </Text>
      </View>
      
      {!conversation.lastMessage.read && (
        <View style={styles.unreadIndicator} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  unreadMessage: {
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    marginLeft: 8,
  },
});