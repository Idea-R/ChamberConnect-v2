import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface BusinessProfileProps {
  business: {
    id: string;
    name: string;
    tagline?: string;
    description: string;
    logo_url?: string;
    banner_url?: string;
    website?: string;
    phone?: string;
    email?: string;
    address?: string;
    social_media?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
    business_hours?: {
      monday?: string;
      tuesday?: string;
      wednesday?: string;
      thursday?: string;
      friday?: string;
      saturday?: string;
      sunday?: string;
    };
    services?: string[];
    specialties?: string[];
    years_in_business?: number;
    employee_count?: string;
    certifications?: string[];
    awards?: string[];
    gallery?: string[];
    featured_products?: {
      id: string;
      name: string;
      description: string;
      price?: string;
      image_url?: string;
    }[];
    testimonials?: {
      id: string;
      author: string;
      content: string;
      rating: number;
      date: string;
    }[];
    stats?: {
      total_projects?: number;
      satisfied_customers?: number;
      years_experience?: number;
    };
  };
  isOwner?: boolean;
  onEdit?: () => void;
  onContact?: () => void;
  onRecommend?: () => void;
}

export const BusinessProfile: React.FC<BusinessProfileProps> = ({
  business,
  isOwner = false,
  onEdit,
  onContact,
  onRecommend,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'gallery' | 'reviews'>('overview');
  const [imageError, setImageError] = useState({
    banner: false,
    logo: false,
    gallery: {} as Record<string, boolean>,
  });

  const handleContact = (type: 'phone' | 'email' | 'website') => {
    switch (type) {
      case 'phone':
        if (business.phone) {
          Linking.openURL(`tel:${business.phone}`);
        }
        break;
      case 'email':
        if (business.email) {
          Linking.openURL(`mailto:${business.email}`);
        }
        break;
      case 'website':
        if (business.website) {
          Linking.openURL(business.website);
        }
        break;
    }
  };

  const handleSocialMedia = (platform: string, url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderBanner = () => (
    <View style={styles.bannerContainer}>
      {business.banner_url && !imageError.banner ? (
        <Image
          source={{ uri: business.banner_url }}
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
        {business.logo_url && !imageError.logo ? (
          <Image
            source={{ uri: business.logo_url }}
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

      {/* Edit Button */}
      {isOwner && onEdit && (
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.businessName}>{business.name}</Text>
      {business.tagline && (
        <Text style={styles.tagline}>{business.tagline}</Text>
      )}
      
      {/* Stats */}
      {business.stats && (
        <View style={styles.statsContainer}>
          {business.stats.years_experience && (
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{business.stats.years_experience}+</Text>
              <Text style={styles.statLabel}>Years Experience</Text>
            </View>
          )}
          {business.stats.satisfied_customers && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{business.stats.satisfied_customers}+</Text>
                <Text style={styles.statLabel}>Happy Customers</Text>
              </View>
            </>
          )}
          {business.stats.total_projects && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{business.stats.total_projects}+</Text>
                <Text style={styles.statLabel}>Projects Completed</Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {!isOwner && (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={onContact}>
              <Ionicons name="call-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onRecommend}>
              <Ionicons name="heart-outline" size={20} color="#007AFF" />
              <Text style={styles.secondaryButtonText}>Recommend</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabs}>
      {(['overview', 'services', 'gallery', 'reviews'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.description}>{business.description}</Text>
      </View>

      {/* Specialties */}
      {business.specialties && business.specialties.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.tagsContainer}>
            {business.specialties.map((specialty, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        {business.phone && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleContact('phone')}
          >
            <Ionicons name="call-outline" size={20} color="#007AFF" />
            <Text style={styles.contactText}>{business.phone}</Text>
          </TouchableOpacity>
        )}
        
        {business.email && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleContact('email')}
          >
            <Ionicons name="mail-outline" size={20} color="#007AFF" />
            <Text style={styles.contactText}>{business.email}</Text>
          </TouchableOpacity>
        )}
        
        {business.website && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleContact('website')}
          >
            <Ionicons name="globe-outline" size={20} color="#007AFF" />
            <Text style={styles.contactText}>{business.website}</Text>
          </TouchableOpacity>
        )}
        
        {business.address && (
          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.contactText}>{business.address}</Text>
          </View>
        )}
      </View>

      {/* Business Hours */}
      {business.business_hours && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          {Object.entries(business.business_hours).map(([day, hours]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
              <Text style={styles.hoursText}>{hours || 'Closed'}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Social Media */}
      {business.social_media && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialContainer}>
            {business.social_media.facebook && (
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialMedia('facebook', business.social_media!.facebook!)}
              >
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
            )}
            {business.social_media.instagram && (
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialMedia('instagram', business.social_media!.instagram!)}
              >
                <Ionicons name="logo-instagram" size={24} color="#E4405F" />
              </TouchableOpacity>
            )}
            {business.social_media.twitter && (
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialMedia('twitter', business.social_media!.twitter!)}
              >
                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
            )}
            {business.social_media.linkedin && (
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialMedia('linkedin', business.social_media!.linkedin!)}
              >
                <Ionicons name="logo-linkedin" size={24} color="#0A66C2" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderServices = () => (
    <View style={styles.tabContent}>
      {/* Services */}
      {business.services && business.services.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          {business.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Ionicons name="checkmark-circle" size={20} color="#28a745" />
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Featured Products */}
      {business.featured_products && business.featured_products.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.productsContainer}>
              {business.featured_products.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  {product.image_url && (
                    <Image
                      source={{ uri: product.image_url }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                  {product.price && (
                    <Text style={styles.productPrice}>{product.price}</Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Certifications */}
      {business.certifications && business.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications & Awards</Text>
          {business.certifications.map((cert, index) => (
            <View key={index} style={styles.certificationItem}>
              <Ionicons name="ribbon-outline" size={20} color="#007AFF" />
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderGallery = () => (
    <View style={styles.tabContent}>
      {business.gallery && business.gallery.length > 0 ? (
        <View style={styles.galleryGrid}>
          {business.gallery.map((imageUrl, index) => (
            <TouchableOpacity key={index} style={styles.galleryItem}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.galleryImage}
                resizeMode="cover"
                onError={() => setImageError(prev => ({
                  ...prev,
                  gallery: { ...prev.gallery, [index]: true }
                }))}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No gallery images available</Text>
        </View>
      )}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {business.testimonials && business.testimonials.length > 0 ? (
        business.testimonials.map((testimonial) => (
          <View key={testimonial.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewAuthor}>{testimonial.author}</Text>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < testimonial.rating ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewContent}>{testimonial.content}</Text>
            <Text style={styles.reviewDate}>
              {new Date(testimonial.date).toLocaleDateString()}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="star-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No reviews available</Text>
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'services': return renderServices();
      case 'gallery': return renderGallery();
      case 'reviews': return renderReviews();
      default: return renderOverview();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderBanner()}
      {renderHeader()}
      {renderTabs()}
      {renderTabContent()}
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
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  businessName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 16,
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
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e9ecef',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  tabContent: {
    backgroundColor: '#f8f9fa',
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dayText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  hoursText: {
    fontSize: 15,
    color: '#666',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  serviceText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  productsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 4,
  },
  productCard: {
    width: 160,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  certificationText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  galleryItem: {
    width: (width - 40) / 2,
    height: 120,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  reviewCard: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});