
export type View = 'feed' | 'reels' | 'explore' | 'messages' | 'profile' | 'admin' | 'create' | 'terms' | 'privacy' | 'download' | 'register' | 'dashboard' | 'verification' | 'biometric_policy' | 'ad_controls' | 'monetization_manifesto' | 'beta_center' | 'creator_plus' | 'beta_terms' | 'roadmap' | 'creator_plus_faq' | 'monetization_info' | 'cancel_subscription';
export type FeedMode = 'followers' | 'discovery' | 'relevance';
export type FeedFormatPreference = 'posts' | 'videos' | 'balanced';

export interface AdCategoryConfig {
  education: boolean;
  tech: boolean;
  tools: boolean;
  investments: boolean;
  brands: boolean;
  casino: boolean; // Sempre falso por regra de negócio
}

export interface BetaComment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: Date;
}

export interface BetaFeature {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: 'voting' | 'development' | 'testing' | 'shipped';
  comments?: BetaComment[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'development' | 'testing';
  estimatedQuarter?: string;
}

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
  isPremium?: boolean; // Criador+
  isBetaTester?: boolean;
  betaNotifications?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  isSuspicious?: boolean;
  email?: string;
  phone?: string;
  adSettings?: AdCategoryConfig;
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
  isVerified?: boolean;
  isSuspicious?: boolean;
  userRiskLevel?: 'low' | 'medium' | 'high';
}

export interface Ad {
  id: string;
  type: 'ad';
  brandName: string;
  brandAvatar: string;
  content: string;
  media: string;
  ctaLabel: string;
  ctaUrl: string;
  category: 'Educação' | 'Tecnologia' | 'Ferramentas' | 'Investimentos' | 'Marca';
}

export type FeedItem = (Post | Ad);

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
