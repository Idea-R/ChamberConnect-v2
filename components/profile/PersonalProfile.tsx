import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/utils/auth';

export function PersonalProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [title, setTitle] = useState(user?.title || '');
  const [company, setCompany] = useState(user?.company || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [linkedIn, setLinkedIn] = useState(user?.linkedIn || '');
  
  const handleSave = () => {
    // Save profile logic would go here
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <ScrollView>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Smith"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Marketing Director"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company</Text>
            <TextInput
              style={styles.input}
              value={company}
              onChangeText={setCompany}
              placeholder="Acme Inc."
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 123-4567"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>LinkedIn</Text>
            <TextInput
              style={styles.input}
              value={linkedIn}
              onChangeText={setLinkedIn}
              placeholder="linkedin.com/in/johnsmith"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={() => setIsEditing(false)}
              variant="outline"
              size="large"
              style={styles.cancelButton}
            />
            <Button
              title="Save"
              onPress={handleSave}
              variant="primary"
              size="large"
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      ) : (
        <View>
          <View style={styles.profileHeader}>
            <Text style={styles.profileTitle}>Personal Profile</Text>
            <Pressable 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </View>
          
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{fullName || user?.username || 'Not specified'}</Text>
          </Card>
          
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Professional Information</Text>
            <Text style={styles.infoSubLabel}>Job Title</Text>
            <Text style={styles.infoValue}>{title || 'Not specified'}</Text>
            <Text style={styles.infoSubLabel}>Company</Text>
            <Text style={styles.infoValue}>{company || 'Not specified'}</Text>
          </Card>
          
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Bio</Text>
            <Text style={styles.infoValue}>{bio || 'No bio provided'}</Text>
          </Card>
          
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Contact Information</Text>
            <Text style={styles.infoSubLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
            <Text style={styles.infoSubLabel}>Phone</Text>
            <Text style={styles.infoValue}>{phone || 'Not specified'}</Text>
            <Text style={styles.infoSubLabel}>LinkedIn</Text>
            <Text style={styles.infoValue}>{linkedIn || 'Not specified'}</Text>
          </Card>
          
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Chamber Membership</Text>
            <Text style={styles.infoValue}>
              Member since {user?.memberSince || 'January 2023'}
            </Text>
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#EBF5FF',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#2563EB',
  },
  infoCard: {
    padding: 16,
    marginBottom: 16,
  },
  infoLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  infoSubLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4B5563',
    marginTop: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
});