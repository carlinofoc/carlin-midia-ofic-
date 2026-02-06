
export type View = 'feed' | 'reels' | 'explore' | 'messages' | 'profile' | 'admin' | 'create' | 'terms' | 'privacy' | 'download' | 'register' | 'login' | 'dashboard' | 'verification' | 'biometric_policy' | 'ad_controls' | 'monetization_manifesto' | 'beta_center' | 'creator_plus' | 'beta_terms' | 'roadmap' | 'creator_plus_faq' | 'monetization_info' | 'cancel_subscription' | 'notification_settings' | 'developer_info' | 'developer_manifesto' | 'advanced_settings' | 'security_center' | 'impact_social' | 'support';
export type FeedMode = 'followers' | 'discovery' | 'relevance';
export type FeedFormatPreference = 'posts' | 'videos' | 'balanced';
export type SubscriptionStatus = 'active' | 'canceled' | 'none';
export type LinkType = 'normal' | 'pinned' | 'monetized' | 'exclusive';
export type LinkStatus = 'active' | 'inactive';

export enum VerificationLevel {
  BRONZE = 'BRONZE',
  PRATA = 'PRATA',
  OURO = 'OURO'
}

/**
 * Replicates Kotlin: data class UserAccount(val id, val name, val email, val level, val consentAccepted)
 */
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  level: VerificationLevel;
  consentAccepted: boolean;
}

export interface UserRegistration {
  name: string;
  email: string;
  level: VerificationLevel;
  consentAccepted: boolean;
  password?: string;
}

/**
 * Replicates Kotlin: data class SocialDonation(val month, val city, val amount, val basketsDistributed)
 */
export interface SocialDonation {
  month: string;
  city: string;
  amount: number;
  basketsDistributed: number;
}

/**
 * Replicates Kotlin: data class ImpactResult(val reinvestment, val socialImpact, val founderIncome, val reserve)
 */
export interface ImpactResult {
  reinvestment: number;
  socialImpact: number;
  founderIncome: number;
  reserve: number;
  // Metadata for UI
  totalValueGenerated: number;
  peopleReached: number;
  ecoScore: number;
  donations: SocialDonation[];
}

export enum LiteMode {
  NORMAL = 'NORMAL',
  LITE_ANTIGO = 'LITE_ANTIGO',
  LITE_AVANCADO = 'LITE_AVANCADO'
}

export interface LiteConfig {
  maxDataUsageMB: number;
  maxRamUsageGB: number;
  cpuLimitPercent: number;
  reduceImageQuality: boolean;
  disableAutoPlayVideos: boolean;
  aggressiveCache: boolean;
}

export interface EncryptedPayload {
  encrypted: string;
  iv: string;
  tag: string;
  encryptedDEK?: string;
  dekIv?: string;
  dekTag?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  name: string; // Alinhado com UserAccount.kt
  email: string;
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
  verificationLevel: VerificationLevel;
  level: VerificationLevel; // Alinhado com UserAccount.kt
  consentAccepted: boolean; // Alinhado com UserAccount.kt
  biometricHash?: string;
  isPremium?: boolean;
  subscriptionStatus?: SubscriptionStatus;
  isBetaTester?: boolean;
  sessionToken?: string;
  interests: string[];
  viewedContent: string[];
  links?: ProfileLink[];
  totalRevenue?: number;
  notificationPrefs?: NotificationPrefs;
  betaNotifications?: boolean;
  betaGroup?: string;
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

export interface NotificationPrefs {
  performance: boolean;
  educational: boolean;
  security: boolean;
  community: boolean;
}

export interface Post {
  id: string;
  autor_id: string;
  username: string;
  userAvatar: string;
  content: string;
  category: string;
  media: string[];
  type: 'image' | 'video' | 'carousel';
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  trendingScore: number;
  timestamp: string;
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

export interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
}

export interface AdCategoryConfig {
  education: boolean;
  tech: boolean;
  tools: boolean;
  investments: boolean;
  brands: boolean;
  casino: boolean;
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
  status: 'voting' | 'development' | 'testing';
  comments: BetaComment[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'development' | 'testing';
}
