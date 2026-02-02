
export type View = 'feed' | 'reels' | 'explore' | 'messages' | 'profile' | 'admin' | 'create' | 'terms' | 'privacy' | 'download' | 'register' | 'dashboard' | 'verification' | 'biometric_policy';
export type FeedMode = 'followers' | 'discovery' | 'relevance';
export type FeedFormatPreference = 'posts' | 'videos' | 'balanced';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isVerified?: boolean;
  isFaciallyVerified?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  isSuspicious?: boolean;
  email?: string;
  phone?: string;
}

export interface PostStats {
  followerReach: number;
  nonFollowerReach: number;
  engagementRate: number;
  relevanceScore: number; // 0-100
  retentionRate?: number; // Relevante para vídeos
  relevanceIndicators: string[]; // ["Educação", "Inspiração", "Solução"]
  recommendationReason?: string;
  saves: number;
  shares: number;
  isContinuousCirculation: boolean; // Se o post ainda está sendo distribuído ativamente
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  media: string[];
  type: 'image' | 'video' | 'carousel';
  likes: number;
  comments: number;
  timestamp: string;
  location?: string;
  category?: string;
  isFromFollower?: boolean;
  stats?: PostStats;
  // Added fields to satisfy app logic and fix build errors
  isVerified?: boolean;
  isSuspicious?: boolean;
  userRiskLevel?: 'low' | 'medium' | 'high';
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  media: string;
  viewed: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  messages: Message[];
}
