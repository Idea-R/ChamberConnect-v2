import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Image as ImageIcon, Calendar, Tag } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { PostType } from '@/utils/types';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('update');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!title || !content) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.back();
      // Would typically dispatch to a state manager here
    }, 1000);
  };

  const postTypes: { type: PostType; label: string; color: string }[] = [
    { type: 'update', label: 'Update', color: '#0D9488' },
    { type: 'event', label: 'Event', color: '#D97706' },
    { type: 'question', label: 'Question', color: '#DC2626' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.title}>Create Post</Text>
        <Button
          title="Post"
          onPress={handleSubmit}
          variant="primary"
          size="small"
          loading={isLoading}
          disabled={!title || !content}
        />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.postTypeSelector}>
          {postTypes.map((type) => (
            <Pressable
              key={type.type}
              style={[
                styles.postTypeButton,
                postType === type.type && { backgroundColor: type.color },
              ]}
              onPress={() => setPostType(type.type)}
            >
              <Text
                style={[
                  styles.postTypeText,
                  postType === type.type && styles.activePostTypeText,
                ]}
              >
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>
        
        <TextInput
          style={styles.titleInput}
          placeholder="Add a title..."
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        
        <TextInput
          style={styles.contentInput}
          placeholder="What's on your mind?"
          placeholderTextColor="#9CA3AF"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        
        {postType === 'event' && (
          <View style={styles.eventDetails}>
            <Text style={styles.eventSectionTitle}>Event Details</Text>
            
            <Pressable style={styles.dateSelector}>
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.dateText}>Select Date & Time</Text>
            </Pressable>
            
            <Pressable style={styles.locationSelector}>
              <Tag size={20} color="#6B7280" />
              <Text style={styles.locationText}>Add Location</Text>
            </Pressable>
          </View>
        )}
        
        <View style={styles.attachments}>
          <Pressable style={styles.attachButton}>
            <ImageIcon size={20} color="#6B7280" />
            <Text style={styles.attachText}>Add Photo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  postTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  postTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  postTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
  },
  activePostTypeText: {
    color: '#FFFFFF',
  },
  titleInput: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contentInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
    height: 150,
  },
  eventDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  eventSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  attachments: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  attachText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});