import { StyleSheet, Text, View } from 'react-native';
import { Message } from '@/utils/types';
import { formatRelativeTime } from '@/utils/helpers';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.content}
        </Text>
      </View>
      <Text
        style={[
          styles.timeText,
          isCurrentUser ? styles.currentUserTimeText : styles.otherUserTimeText,
        ]}
      >
        {formatRelativeTime(message.date)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currentUserBubble: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  otherUserText: {
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
  },
  currentUserTimeText: {
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
    alignSelf: 'flex-end',
  },
  otherUserTimeText: {
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
    alignSelf: 'flex-start',
  },
});