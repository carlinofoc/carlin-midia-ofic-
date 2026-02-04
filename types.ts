
export type View = 'feed' | 'reels' | 'explore' | 'messages' | 'profile' | 'admin' | 'create' | 'terms' | 'privacy' | 'download' | 'register' | 'login' | 'dashboard' | 'verification' | 'biometric_policy' | 'ad_controls' | 'monetization_manifesto' | 'beta_center' | 'creator_plus' | 'beta_terms' | 'roadmap' | 'creator_plus_faq' | 'monetization_info' | 'cancel_subscription' | 'notification_settings' | 'developer_info' | 'developer_manifesto' | 'advanced_settings' | 'security_center';
export type FeedMode = 'followers' | 'discovery' | 'relevance';
export type FeedFormatPreference = 'posts' | 'videos' | 'balanced';
export type SubscriptionStatus = 'active' | 'canceled' | 'none';
export type LinkType = 'normal' | 'pinned' | 'monetized' | 'exclusive';
export type LinkStatus = 'active' | 'inactive';

export interface LiteConfig {
  maxDataUsageMB: number; // 5, 10, 15
  maxRamUsageGB: number;  // 1 a 4
  cpuLimitPercent: number; // 20% a 80%
  reduceImageQuality: boolean;
  disableAutoPlayVideos: boolean;
  aggressiveCache: boolean;
}

export interface EncryptedPayload {
  encrypted: string;
  iv: string;
  tag: string;
  // Envelope Encryption (Carlin v4.9)
  encryptedDEK?: string;
  dekIv?: string;
  dekTag?: string;
}

export interface NotificationPrefs {
  performance: boolean;
  educational: boolean;
  security: boolean;
  community: boolean;
}

export interface ProfileLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
  views: number;
  type: LinkType;
  status: LinkStatus;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  nome_encrypted: EncryptedPayload;
  email_encrypted: EncryptedPayload;
  passwordHash: string;
  chave: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isVerified?: boolean;
  isFaciallyVerified?: boolean;
  isPremium?: boolean;
  subscriptionStatus?: SubscriptionStatus;
  isBetaTester?: boolean;
  betaGroup?: string;
  email?: string;
  sessionToken?: string;
  notificationPrefs?: NotificationPrefs;
  betaNotifications?: boolean;
  links?: ProfileLink[];
  totalRevenue?: number;
  // MongoDB Context
  interests: string[];
  viewedContent: string[];
}

export interface PostAlgoMetadata {
  interesse_comum: number; // 0-1
  engajamento_amigo: number; // 0-1
  recencia: number; // 0-1
  viralidade: number; // 0-1
  interesse_usuario: number; // 0-1
  novidade: number; // 0-1
}

export interface Post {
  id: string;
  autor_id: string;
  username: string;
  userAvatar: string;
  content: string;
  category: string;
  conteudo_encrypted?: EncryptedPayload;
  media: string[];
  type: 'image' | 'video' | 'carousel';
  likes: number;
  comments: number;
  shares: number;
  createdAt: string; // ISO Date
  trendingScore: number;
  timestamp: string; // Display
  isVerified?: boolean;
  scores?: {
    amigos: number;
    explorar: number;
    final: number;
    breakdown: {
      interest: number;
      engagement: number;
      recency: number;
      trending: number;
      diversity: number;
    };
  };
}

export interface PostStats {
  followerReach: number;
  nonFollowerReach: number;
  engagementRate: number;
  relevanceScore: number;
  saves: number;
  shares: number;
  isContinuousCirculation: boolean;
}

export interface AdCategoryConfig {
  education: boolean;
  tech: boolean;
  tools: boolean;
  investments: boolean;
  brands: boolean;
  casino: boolean; 
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
  category: string;
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
  status: 'voting' | 'testing' | 'development';
  comments: BetaComment[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'development' | 'testing';
}
