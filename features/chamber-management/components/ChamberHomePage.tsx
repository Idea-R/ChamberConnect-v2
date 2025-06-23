import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ChamberHomePageProps {
  chamber: {
    id: string;
    name: string;
    headline?: string;
    description?: string;
    banner_image_url?: string;
    logo_url?: string;
    contact_info?: {
      phone?: string;
      email?: string;
      address?: string;
      website?: string;
    };
    signup_settings?: {
      trial_enabled: boolean;
      trial_duration_days: number;
    };
    stats?: {
      member_count: number;
      event_count: number;
      established_year?: number;
    };
  };
  onSignupPress: () => void;
  onTrialPress?: () => void;
  isGuest?: boolean;
}

export const ChamberHomePage: React.FC<ChamberHomePageProps> = ({
  chamber,
  onSignupPress,
  onTrialPress,
  isGuest = true,
}) => {
  const [imageError, setImageError] = useState({
    banner: false,
    logo: false,
  });

  const handleContact = (type: 'phone' | 'email' | 'website') => {
    const { contact_info } = chamber;
    if (!contact_info) return;

    switch (type) {
      case 'phone':
        if (contact_info.phone) {
          Linking.openURL(`tel:${contact_info.phone}`);
        }
        break;
      case 'email':
        if (contact_info.email) {
          Linking.openURL(`mailto:${contact_info.email}`);
        }
        break;
      case 'website':
        if (contact_info.website) {
          Linking.openURL(contact_info.website);
        }
        break;
    }
  };

  const renderBanner = () => (
    <View style={styles.bannerContainer}>
      {chamber.banner_image_url && !imageError.banner ? (
        <Image
          source={{ uri: chamber.banner_image_url }}
          style={styles.bannerImage}
          onError={() => setImageError(prev => ({ ...prev, banner: true }))}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.bannerPlaceholder}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </View>
      )}
      
      {/* Logo Overlay */}
      <View style={styles.logoContainer}>
        {chamber.logo_url && !imageError.logo ? (
          <Image
            source={{ uri: chamber.logo_url }}
            style={styles.logo}
            onError={() => setImageError(prev => ({ ...prev, logo: true }))}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="business" size={30} color="#666" />
          </View>
        )}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.chamberName}>{chamber.name}</Text>
      {chamber.headline && (
        <Text style={styles.headline}>{chamber.headline}</Text>
      )}
      
      {/* Stats */}
      {chamber.stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{chamber.stats.member_count || 0}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{chamber.stats.event_count || 0}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          {chamber.stats.established_year && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>Est. {chamber.stats.established_year}</Text>
                <Text style={styles.statLabel}>Founded</Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );

  const renderDescription = () => {
    if (!chamber.description) return null;
    
    return (
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>About Our Chamber</Text>
        <Text style={styles.description}>{chamber.description}</Text>
      </View>
    );
  };

  const renderContactInfo = () => {
    const { contact_info } = chamber;
    if (!contact_info) return null;

    return (
      <View style={styles.contactContainer}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        {contact_info.phone && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleContact('phone')}
          >
            <Ionicons name="call-outline" size={20} color="#007AFF" />
            <Text style={styles.contactText}>{contact_info.phone}</Text>
          </TouchableOpacity>
        )}
        
        {contact_info.email && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleContact('email')}
          >
            <Ionicons name="mail-outline" size={20} color="#007AFF" />
            <Text style={styles.contactText}>{contact_info.email}</Text>
          </TouchableOpacity>
        )}
        
        {contact_info.website && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleContact('website')}
          >
            <Ionicons name="globe-outline" size={20} color="#007AFF" />
            <Text style={styles.contactText}>{contact_info.website}</Text>
          </TouchableOpacity>
        )}
        
        {contact_info.address && (
          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.contactText}>{contact_info.address}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSignupSection = () => {
    if (!isGuest) return null;

    return (
      <View style={styles.signupContainer}>
        <Text style={styles.sectionTitle}>Join Our Chamber</Text>
        <Text style={styles.signupDescription}>
          Connect with local businesses, attend exclusive events, and grow your network.
        </Text>
        
        <View style={styles.signupButtons}>
          {/* Trial Option */}
          {chamber.signup_settings?.trial_enabled && onTrialPress && (
            <TouchableOpacity style={styles.trialButton} onPress={onTrialPress}>
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>FREE</Text>
              </View>
              <Text style={styles.trialButtonTitle}>
                {chamber.signup_settings.trial_duration_days}-Day Trial
              </Text>
              <Text style={styles.trialButtonSubtext}>
                Experience chamber benefits risk-free
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Full Membership */}
          <TouchableOpacity style={styles.signupButton} onPress={onSignupPress}>
            <Ionicons name="business-outline" size={20} color="#fff" />
            <Text style={styles.signupButtonText}>Apply for Membership</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.signupFooter}>
          Questions? Contact us directly using the information above.
        </Text>
      </View>
    );
  };

  const renderQuickActions = () => {
    if (isGuest) return null;

    return (
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="calendar-outline" size={24} color="#007AFF" />
            <Text style={styles.quickActionText}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="people-outline" size={24} color="#007AFF" />
            <Text style={styles.quickActionText}>Directory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="chatbubbles-outline" size={24} color="#007AFF" />
            <Text style={styles.quickActionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="newspaper-outline" size={24} color="#007AFF" />
            <Text style={styles.quickActionText}>Feed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderBanner()}
      {renderHeader()}
      {renderDescription()}
      {renderContactInfo()}
      {renderSignupSection()}
      {renderQuickActions()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -30,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  chamberName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e9ecef',
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  contactContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  contactText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  signupContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  signupDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  signupButtons: {
    gap: 12,
  },
  trialButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#28a745',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    alignItems: 'center',
  },
  trialBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trialBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  trialButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 4,
  },
  trialButtonSubtext: {
    fontSize: 13,
    color: '#666',
  },
  signupButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupFooter: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  quickActionsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    padding: 12,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 6,
    fontWeight: '500',
  },
}); 