export type BusinessCategory =
  | 'Accounting'
  | 'Construction'
  | 'Consulting'
  | 'Education'
  | 'Food & Beverage'
  | 'Healthcare'
  | 'Legal'
  | 'Marketing'
  | 'Real Estate'
  | 'Retail'
  | 'Technology'
  | 'Services';

export type PostType = 'event' | 'update' | 'question';

export interface Chamber {
  id: string;
  name: string;
  location: string;
  memberCount: number;
  imageUrl: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  title: string;
  company: string;
  bio: string;
  phone: string;
  linkedIn: string;
  memberSince: string;
  chamberId: string | null;
  imageUrl: string;
}

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  chamberId: string;
  ownerId: string | null;
  services: string[];
  imageUrl: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: PostType;
  date: string;
  author: {
    id: string;
    name: string;
    imageUrl: string;
  };
  commentCount: number;
  chamberId: string;
  eventDetails?: {
    date: string;
    location: string;
  };
}

export interface Message {
  id: string;
  content: string;
  date: string;
  senderId: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    imageUrl: string;
  };
  lastMessage: Message;
  messages: Message[];
}