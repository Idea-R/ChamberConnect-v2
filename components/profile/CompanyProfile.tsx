import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Switch, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/utils/auth';

export function CompanyProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  
  const handleSave = () => {
    // Save profile logic would go here
    setIsEditing(false);
  };

  if (!isEditing && !companyName) {
    return (
      <Card style={styles.setupCard}>
        <Text style={styles.setupTitle}>Set Up Your Business Profile</Text>
        <Text style={styles.setupText}>
          Create a business profile to showcase your services and connect with other chamber members.
        </Text>
        <Button
          title="Create Business Profile"
          onPress={() => setIsEditing(true)}
          variant="primary"
          size="large"
          style={styles.setupButton}
        />
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {isEditing ? (
        <ScrollView>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Enter company name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Category</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="E.g., Retail, Technology, Services"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your business"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={website}
              onChangeText={setWebsite}
              placeholder="https://example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="url"
              autoCapitalize="none"
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
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="123 Main St, City, State, ZIP"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.toggleGroup}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Public Profile</Text>
              <Text style={styles.toggleDescription}>
                Make your business visible in the directory
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
              thumbColor={isPublic ? '#2563EB' : '#9CA3AF'}
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
            <Text style={styles.profileTitle}>Business Profile</Text>
            <Pressable 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </View>
          
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Company Name</Text>
            <Text style={styles.infoValue}>{companyName || 'Not specified'}</Text>
          </Card>
          
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Business Category</Text>
            <Text style={styles.infoValue}>{category || 'Not specified'}</Text>
          </Card>
          
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue}>{description || 'No description provided'}</Text>
          </Card>
          
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Contact Information</Text>
            <Text style={styles.infoSubLabel}>Website</Text>
            <Text style={styles.infoValue}>{website || 'Not specified'}</Text>
            <Text style={styles.infoSubLabel}>Phone</Text>
            <Text style={styles.infoValue}>{phone || 'Not specified'}</Text>
            <Text style={styles.infoSubLabel}>Address</Text>
            <Text style={styles.infoValue}>{address || 'Not specified'}</Text>
          </Card>
          
          <Card style={styles.infoCard}>
            <View style={styles.visibilityInfo}>
              <View>
                <Text style={styles.infoLabel}>Profile Visibility</Text>
                <Text style={styles.visibilityStatus}>
                  {isPublic ? 'Public - Listed in directory' : 'Private - Not listed in directory'}
                </Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={(value) => {
                  setIsPublic(value);
                  // Would also update this in the backend
                }}
                trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                thumbColor={isPublic ? '#2563EB' : '#9CA3AF'}
              />
            </View>
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
  setupCard: {
    padding: 24,
  },
  setupTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  setupText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  setupButton: {
    width: '100%',
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
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  toggleDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
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
  visibilityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visibilityStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});