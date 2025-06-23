import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native';
import { Conversation, Message } from '@/utils/types';
import { MessageBubble } from './MessageBubble';

interface MessageThreadProps {
  conversation: Conversation;
  onBack: () => void;
}

export function MessageThread({ conversation, onBack }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  
  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `msg_${Date.now()}`,
      content: newMessage,
      date: new Date().toISOString(),
      senderId: 'current_user',
      read: true,
    };
    
    setMessages([message, ...messages]);
    setNewMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        
        <Pressable style={styles.participantInfo}>
          <Image 
            source={{ uri: conversation.participant.imageUrl }} 
            style={styles.avatar}
          />
          <Text style={styles.name}>{conversation.participant.name}</Text>
        </Pressable>
      </View>
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} isCurrentUser={item.senderId === 'current_user'} />
        )}
        inverted
        contentContainerStyle={styles.messageList}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Send size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});