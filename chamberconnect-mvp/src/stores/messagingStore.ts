import { create } from 'zustand'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
  read: boolean
  type: 'text' | 'image' | 'file'
  metadata?: {
    fileName?: string
    fileSize?: number
    imageUrl?: string
  }
}

export interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    company: string
    avatar: string
    status: 'online' | 'away' | 'offline'
  }[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

interface MessagingStore {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  activeConversation: string | null
  isTyping: Record<string, boolean>
  
  // Actions
  setActiveConversation: (conversationId: string | null) => void
  sendMessage: (conversationId: string, content: string, senderId: string) => void
  markConversationAsRead: (conversationId: string) => void
  addMessage: (message: Message) => void
  setTyping: (conversationId: string, isTyping: boolean) => void
  updateUserStatus: (userId: string, status: 'online' | 'away' | 'offline') => void
}

export const useMessagingStore = create<MessagingStore>((set, get) => ({
  conversations: [
    {
      id: '1',
      participants: [
        {
          id: '2',
          name: 'Sarah Johnson',
          company: 'Green Valley Restaurant',
          avatar: '🍽️',
          status: 'online'
        }
      ],
      lastMessage: {
        id: '6',
        conversationId: '1',
        senderId: '2',
        content: 'Thanks for the referral! The catering event went great.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
        type: 'text'
      },
      unreadCount: 2,
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      participants: [
        {
          id: '3',
          name: 'Mike Chen',
          company: 'TechStart Solutions',
          avatar: '💻',
          status: 'away'
        }
      ],
      lastMessage: {
        id: '7',
        conversationId: '2',
        senderId: 'current-user',
        content: 'I\'d love to discuss the website project. When are you available?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'text'
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      participants: [
        {
          id: '4',
          name: 'Emily Davis',
          company: 'Bloom Flower Shop',
          avatar: '🌸',
          status: 'offline'
        }
      ],
      lastMessage: {
        id: '8',
        conversationId: '3',
        senderId: '4',
        content: 'The flower arrangements for the networking event are ready!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'text'
      },
      unreadCount: 1,
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  messages: {
    '1': [
      {
        id: '1',
        conversationId: '1',
        senderId: '2',
        content: 'Hi! I heard you\'re looking for catering services for your upcoming event.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'text'
      },
      {
        id: '2',
        conversationId: '1',
        senderId: 'current-user',
        content: 'Yes! We\'re planning a networking mixer for next month. Can you handle about 50 people?',
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'text'
      },
      {
        id: '3',
        conversationId: '1',
        senderId: '2',
        content: 'Absolutely! We specialize in business events. I can send you our catering menu and pricing.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'text'
      },
      {
        id: '4',
        conversationId: '1',
        senderId: 'current-user',
        content: 'That would be perfect. Also, do you offer any vegetarian and gluten-free options?',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'text'
      },
      {
        id: '5',
        conversationId: '1',
        senderId: '2',
        content: 'Of course! We have extensive options for all dietary restrictions. I\'ll include those in the menu I send over.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'text'
      },
      {
        id: '6',
        conversationId: '1',
        senderId: '2',
        content: 'Thanks for the referral! The catering event went great.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
        type: 'text'
      }
    ],
    '2': [
      {
        id: '7',
        conversationId: '2',
        senderId: 'current-user',
        content: 'I\'d love to discuss the website project. When are you available?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'text'
      }
    ],
    '3': [
      {
        id: '8',
        conversationId: '3',
        senderId: '4',
        content: 'The flower arrangements for the networking event are ready!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'text'
      }
    ]
  },

  activeConversation: null,
  isTyping: {},

  setActiveConversation: (conversationId) => {
    set({ activeConversation: conversationId })
    
    // Mark conversation as read when opened
    if (conversationId) {
      get().markConversationAsRead(conversationId)
    }
  },

  sendMessage: (conversationId, content, senderId) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text'
    }

    set((state) => {
      // Add message to messages
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage]
      }

      // Update conversation with last message
      const updatedConversations = state.conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: newMessage,
            updatedAt: newMessage.timestamp,
            unreadCount: senderId === 'current-user' ? conv.unreadCount : conv.unreadCount + 1
          }
        }
        return conv
      })

      return {
        messages: updatedMessages,
        conversations: updatedConversations
      }
    })
  },

  markConversationAsRead: (conversationId) => {
    set((state) => {
      // Mark all messages in conversation as read
      const updatedMessages = {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map(msg => ({ ...msg, read: true }))
      }

      // Reset unread count for conversation
      const updatedConversations = state.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 }
        }
        return conv
      })

      return {
        messages: updatedMessages,
        conversations: updatedConversations
      }
    })
  },

  addMessage: (message) => {
    set((state) => {
      const updatedMessages = {
        ...state.messages,
        [message.conversationId]: [...(state.messages[message.conversationId] || []), message]
      }

      const updatedConversations = state.conversations.map(conv => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            lastMessage: message,
            updatedAt: message.timestamp,
            unreadCount: message.senderId === 'current-user' ? conv.unreadCount : conv.unreadCount + 1
          }
        }
        return conv
      })

      return {
        messages: updatedMessages,
        conversations: updatedConversations
      }
    })
  },

  setTyping: (conversationId, isTyping) => {
    set((state) => ({
      isTyping: { ...state.isTyping, [conversationId]: isTyping }
    }))
  },

  updateUserStatus: (userId, status) => {
    set((state) => ({
      conversations: state.conversations.map(conv => ({
        ...conv,
        participants: conv.participants.map(participant =>
          participant.id === userId ? { ...participant, status } : participant
        )
      }))
    }))
  }
}))

// Utility functions
export const getTotalUnreadCount = (conversations: Conversation[]) => {
  return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
}

export const formatMessageTime = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  return time.toLocaleDateString()
}

export const getStatusColor = (status: 'online' | 'away' | 'offline') => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'away': return 'bg-yellow-500'
    default: return 'bg-gray-400'
  }
}

