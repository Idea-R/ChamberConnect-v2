import { create } from 'zustand'

export interface Notification {
  id: string
  type: 'message' | 'event' | 'member' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  fromUser?: {
    id: string
    name: string
    avatar?: string
  }
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      message: 'Sarah Johnson sent you a message about catering services',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
      actionUrl: '/messages',
      fromUser: {
        id: '2',
        name: 'Sarah Johnson',
        avatar: '🍽️'
      }
    },
    {
      id: '2',
      type: 'event',
      title: 'Event Reminder',
      message: 'Monthly Networking Mixer starts in 2 hours',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      actionUrl: '/events'
    },
    {
      id: '3',
      type: 'member',
      title: 'New Member Request',
      message: 'TechStart Solutions has requested to join the chamber',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: true,
      actionUrl: '/members'
    },
    {
      id: '4',
      type: 'system',
      title: 'Welcome to ChamberConnect',
      message: 'Complete your profile to get the most out of your membership',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      actionUrl: '/profile'
    }
  ],
  unreadCount: 2,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    }
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }))
  },

  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
      const unreadCount = notifications.filter(n => !n.read).length
      return { notifications, unreadCount }
    })
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notification => ({ ...notification, read: true })),
      unreadCount: 0
    }))
  },

  removeNotification: (id) => {
    set((state) => {
      const notifications = state.notifications.filter(notification => notification.id !== id)
      const unreadCount = notifications.filter(n => !n.read).length
      return { notifications, unreadCount }
    })
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 })
  }
}))

// Utility functions for notification management
export const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'message': return '💬'
    case 'event': return '📅'
    case 'member': return '👥'
    case 'system': return '⚙️'
    default: return '🔔'
  }
}

export const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'message': return 'text-blue-600 bg-blue-50'
    case 'event': return 'text-green-600 bg-green-50'
    case 'member': return 'text-purple-600 bg-purple-50'
    case 'system': return 'text-gray-600 bg-gray-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export const formatNotificationTime = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return time.toLocaleDateString()
}

