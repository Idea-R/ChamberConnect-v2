import { create } from 'zustand'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  endTime?: string
  location: string
  address: string
  category: 'networking' | 'workshop' | 'social' | 'business' | 'community' | 'other'
  maxAttendees?: number
  currentAttendees: number
  price: number
  isVirtual: boolean
  virtualLink?: string
  imageUrl?: string
  organizer: {
    id: string
    name: string
    company: string
    avatar: string
  }
  attendees: {
    id: string
    name: string
    company: string
    avatar: string
    registeredAt: string
  }[]
  tags: string[]
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt: string
  rsvpDeadline?: string
  requirements?: string
  agenda?: string[]
}

export interface FeedPost {
  id: string
  type: 'event' | 'announcement' | 'business_spotlight' | 'deal' | 'news'
  title: string
  content: string
  imageUrl?: string
  author: {
    id: string
    name: string
    company: string
    avatar: string
    role: 'chamber_admin' | 'business_owner' | 'trial_user'
  }
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
  eventId?: string // If post is related to an event
  businessId?: string // If post is business spotlight
  tags: string[]
  visibility: 'public' | 'members_only' | 'chamber_admin_only'
}

interface EventsStore {
  events: Event[]
  feedPosts: FeedPost[]
  selectedEvent: Event | null
  filterCategory: string
  filterDate: string
  searchTerm: string
  
  // Actions
  setSelectedEvent: (event: Event | null) => void
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEvent: (id: string, updates: Partial<Event>) => void
  deleteEvent: (id: string) => void
  registerForEvent: (eventId: string, userId: string) => void
  unregisterFromEvent: (eventId: string, userId: string) => void
  setFilterCategory: (category: string) => void
  setFilterDate: (date: string) => void
  setSearchTerm: (term: string) => void
  
  // Feed actions
  addFeedPost: (post: Omit<FeedPost, 'id' | 'createdAt' | 'updatedAt'>) => void
  likeFeedPost: (postId: string) => void
  unlikeFeedPost: (postId: string) => void
  deleteFeedPost: (postId: string) => void
}

export const useEventsStore = create<EventsStore>((set, get) => ({
  events: [
    {
      id: '1',
      title: 'Monthly Networking Mixer',
      description: 'Join us for our monthly networking event where local business owners connect, share ideas, and build lasting partnerships. Light refreshments will be provided.',
      date: '2025-07-15',
      time: '18:00',
      endTime: '20:00',
      location: 'Downtown Conference Center',
      address: '123 Main Street, Downtown, ST 12345',
      category: 'networking',
      maxAttendees: 50,
      currentAttendees: 23,
      price: 0,
      isVirtual: false,
      imageUrl: '',
      organizer: {
        id: 'admin-1',
        name: 'Chamber Admin',
        company: 'Downtown Business Chamber',
        avatar: '🏢'
      },
      attendees: [
        {
          id: '2',
          name: 'Sarah Johnson',
          company: 'Green Valley Restaurant',
          avatar: '🍽️',
          registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Mike Chen',
          company: 'TechStart Solutions',
          avatar: '💻',
          registeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      tags: ['networking', 'business', 'monthly'],
      status: 'published',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      rsvpDeadline: '2025-07-14',
      requirements: 'Business cards recommended',
      agenda: [
        'Welcome & Introductions (6:00 PM)',
        'Networking Session (6:15 PM)',
        'Featured Speaker (7:00 PM)',
        'Open Networking (7:30 PM)',
        'Closing Remarks (8:00 PM)'
      ]
    },
    {
      id: '2',
      title: 'Digital Marketing Workshop',
      description: 'Learn the latest digital marketing strategies to grow your business online. Topics include social media marketing, SEO basics, and email campaigns.',
      date: '2025-07-22',
      time: '14:00',
      endTime: '17:00',
      location: 'Virtual Event',
      address: 'Online via Zoom',
      category: 'workshop',
      maxAttendees: 30,
      currentAttendees: 18,
      price: 25,
      isVirtual: true,
      virtualLink: 'https://zoom.us/j/123456789',
      organizer: {
        id: '4',
        name: 'Emily Davis',
        company: 'Digital Growth Agency',
        avatar: '📱'
      },
      attendees: [],
      tags: ['workshop', 'digital marketing', 'education'],
      status: 'published',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      rsvpDeadline: '2025-07-20',
      requirements: 'Laptop or tablet recommended',
      agenda: [
        'Introduction to Digital Marketing (2:00 PM)',
        'Social Media Strategies (2:30 PM)',
        'SEO Fundamentals (3:15 PM)',
        'Break (4:00 PM)',
        'Email Marketing Best Practices (4:15 PM)',
        'Q&A Session (4:45 PM)'
      ]
    },
    {
      id: '3',
      title: 'Chamber Annual Gala',
      description: 'Celebrate another successful year with the chamber community. Awards ceremony, dinner, and entertainment. Formal attire requested.',
      date: '2025-08-10',
      time: '19:00',
      endTime: '23:00',
      location: 'Grand Ballroom Hotel',
      address: '456 Luxury Ave, Downtown, ST 12345',
      category: 'social',
      maxAttendees: 200,
      currentAttendees: 87,
      price: 75,
      isVirtual: false,
      organizer: {
        id: 'admin-1',
        name: 'Chamber Admin',
        company: 'Downtown Business Chamber',
        avatar: '🏢'
      },
      attendees: [],
      tags: ['gala', 'annual', 'awards', 'formal'],
      status: 'published',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      rsvpDeadline: '2025-08-05',
      requirements: 'Formal attire required',
      agenda: [
        'Cocktail Reception (7:00 PM)',
        'Welcome & Opening Remarks (8:00 PM)',
        'Dinner Service (8:15 PM)',
        'Awards Ceremony (9:30 PM)',
        'Entertainment & Dancing (10:00 PM)'
      ]
    }
  ],

  feedPosts: [
    {
      id: '1',
      type: 'announcement',
      title: 'Welcome New Chamber Members!',
      content: 'We\'re excited to welcome three new businesses to our chamber family this month: TechStart Solutions, Bloom Flower Shop, and Fitness First Gym. Please join us in giving them a warm welcome!',
      author: {
        id: 'admin-1',
        name: 'Chamber Admin',
        company: 'Downtown Business Chamber',
        avatar: '🏢',
        role: 'chamber_admin'
      },
      likes: 15,
      comments: 8,
      shares: 3,
      isLiked: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['welcome', 'new members'],
      visibility: 'public'
    },
    {
      id: '2',
      type: 'business_spotlight',
      title: 'Business Spotlight: Green Valley Restaurant',
      content: 'This month we\'re featuring Green Valley Restaurant, known for their farm-to-table cuisine and exceptional catering services. They\'ve been serving our community for over 10 years and recently expanded their catering menu. Check them out for your next event!',
      imageUrl: '/images/green-valley-restaurant.jpg',
      author: {
        id: 'admin-1',
        name: 'Chamber Admin',
        company: 'Downtown Business Chamber',
        avatar: '🏢',
        role: 'chamber_admin'
      },
      likes: 28,
      comments: 12,
      shares: 7,
      isLiked: true,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      businessId: '2',
      tags: ['spotlight', 'restaurant', 'catering'],
      visibility: 'public'
    },
    {
      id: '3',
      type: 'deal',
      title: '20% Off Digital Marketing Consultation',
      content: 'Digital Growth Agency is offering chamber members an exclusive 20% discount on digital marketing consultations this month. Perfect for businesses looking to improve their online presence. Contact Emily Davis to schedule your session!',
      author: {
        id: '4',
        name: 'Emily Davis',
        company: 'Digital Growth Agency',
        avatar: '📱',
        role: 'business_owner'
      },
      likes: 22,
      comments: 6,
      shares: 11,
      isLiked: false,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      businessId: '4',
      tags: ['deal', 'marketing', 'consultation'],
      visibility: 'members_only'
    },
    {
      id: '4',
      type: 'event',
      title: 'Don\'t Miss: Monthly Networking Mixer',
      content: 'Only 2 days left to register for our Monthly Networking Mixer! Join 20+ local business owners for an evening of connections and collaboration. Light refreshments provided. Free for all chamber members.',
      author: {
        id: 'admin-1',
        name: 'Chamber Admin',
        company: 'Downtown Business Chamber',
        avatar: '🏢',
        role: 'chamber_admin'
      },
      likes: 18,
      comments: 4,
      shares: 9,
      isLiked: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      eventId: '1',
      tags: ['event', 'networking', 'reminder'],
      visibility: 'public'
    }
  ],

  selectedEvent: null,
  filterCategory: 'all',
  filterDate: 'all',
  searchTerm: '',

  setSelectedEvent: (event) => set({ selectedEvent: event }),

  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    set((state) => ({ events: [newEvent, ...state.events] }))
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map(event =>
        event.id === id ? { ...event, ...updates, updatedAt: new Date().toISOString() } : event
      )
    }))
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter(event => event.id !== id),
      selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent
    }))
  },

  registerForEvent: (eventId, userId) => {
    set((state) => ({
      events: state.events.map(event => {
        if (event.id === eventId && event.currentAttendees < (event.maxAttendees || Infinity)) {
          return {
            ...event,
            currentAttendees: event.currentAttendees + 1,
            attendees: [
              ...event.attendees,
              {
                id: userId,
                name: 'Current User',
                company: 'Your Company',
                avatar: '👤',
                registeredAt: new Date().toISOString()
              }
            ]
          }
        }
        return event
      })
    }))
  },

  unregisterFromEvent: (eventId, userId) => {
    set((state) => ({
      events: state.events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            currentAttendees: Math.max(0, event.currentAttendees - 1),
            attendees: event.attendees.filter(attendee => attendee.id !== userId)
          }
        }
        return event
      })
    }))
  },

  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterDate: (date) => set({ filterDate: date }),
  setSearchTerm: (term) => set({ searchTerm: term }),

  addFeedPost: (postData) => {
    const newPost: FeedPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    set((state) => ({ feedPosts: [newPost, ...state.feedPosts] }))
  },

  likeFeedPost: (postId) => {
    set((state) => ({
      feedPosts: state.feedPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1, isLiked: true }
          : post
      )
    }))
  },

  unlikeFeedPost: (postId) => {
    set((state) => ({
      feedPosts: state.feedPosts.map(post =>
        post.id === postId
          ? { ...post, likes: Math.max(0, post.likes - 1), isLiked: false }
          : post
      )
    }))
  },

  deleteFeedPost: (postId) => {
    set((state) => ({
      feedPosts: state.feedPosts.filter(post => post.id !== postId)
    }))
  }
}))

// Utility functions
export const getEventStatusColor = (status: Event['status']) => {
  switch (status) {
    case 'published': return 'text-green-600 bg-green-50'
    case 'draft': return 'text-yellow-600 bg-yellow-50'
    case 'cancelled': return 'text-red-600 bg-red-50'
    case 'completed': return 'text-gray-600 bg-gray-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export const getCategoryColor = (category: Event['category']) => {
  switch (category) {
    case 'networking': return 'text-blue-600 bg-blue-50'
    case 'workshop': return 'text-purple-600 bg-purple-50'
    case 'social': return 'text-pink-600 bg-pink-50'
    case 'business': return 'text-green-600 bg-green-50'
    case 'community': return 'text-orange-600 bg-orange-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export const formatEventDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatEventTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const getPostTypeIcon = (type: FeedPost['type']) => {
  switch (type) {
    case 'event': return '📅'
    case 'announcement': return '📢'
    case 'business_spotlight': return '⭐'
    case 'deal': return '💰'
    case 'news': return '📰'
    default: return '📝'
  }
}

export const getPostTypeColor = (type: FeedPost['type']) => {
  switch (type) {
    case 'event': return 'text-blue-600 bg-blue-50'
    case 'announcement': return 'text-green-600 bg-green-50'
    case 'business_spotlight': return 'text-yellow-600 bg-yellow-50'
    case 'deal': return 'text-purple-600 bg-purple-50'
    case 'news': return 'text-gray-600 bg-gray-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

