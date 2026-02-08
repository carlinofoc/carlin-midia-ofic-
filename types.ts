export type View = 'feed' | 'reels' | 'explore' | 'messages' | 'profile' | 'admin' | 'create' | 'terms' | 'privacy' | 'download' | 'register' | 'login' | 'dashboard' | 'verification' | 'biometric_policy' | 'ad_controls' | 'monetization_manifesto' | 'beta_center' | 'creator_plus' | 'beta_terms' | 'roadmap' | 'creator_plus_faq' | 'monetization_info' | 'cancel_subscription' | 'notification_settings' | 'developer_info' | 'developer_manifesto' | 'advanced_settings' | 'security_center' | 'impact_social' | 'support' | 'monetization_status' | 'live_session' | 'membership_manager';
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

export type CreatorTier = 'pequeno' | 'medio' | 'grande';
export type WithdrawalStatus = 'PROCESSING' | 'PAID' | 'REJECTED' | 'REFUSED';
export type PaymentMethod = 'PayPal' | 'PIX' | 'Transferência Bancária';

export type MonetizationLevel = 'NOT_ELIGIBLE' | 'CREATOR_PROGRAM' | 'PARTIAL_MONETIZATION' | 'ADVANCED_PARTIAL_MONETIZATION' | 'FULL_MONETIZATION';

export interface ViewPattern {
  is_spike: boolean;
}

export interface EngagementPattern {
  too_concentrated: boolean;
  repeated_accounts: boolean;
  low_retention: boolean;
}

export interface TrustDetails {
  view_pattern: ViewPattern;
  engagement_pattern: EngagementPattern;
}

export interface CreatorDashboardSnapshot {
  creator_id: string;
  followers: number;
  total_views: number;
  views_last_12_months: number;
  monetization_level: MonetizationLevel;
  estimated_revenue: number;
  next_goal: string;
  remaining_to_goal: number;
  goal_unit: string;
  progress_percentage: number;
  trust_score: number;
  engagement_status: 'VALID' | 'PARTIAL' | 'INVALID';
  trust_details: TrustDetails;
  last_update: string;
  disclaimer?: string;
}

export interface MonthlyCreatorStats {
  creator_id: string;
  year: number;
  month: number;
  followers: number;
  views_in_month: number;
  total_views: number;
  monetization_level: MonetizationLevel;
  estimated_revenue: number;
  created_at: string;
}

export interface CreatorBenefits {
  message?: string;
  badge: boolean;
  highlight: boolean;
  revenue_share: boolean;
  bonus: boolean;
  priority_campaigns?: boolean;
  revenue_share_percentage?: number; 
}

export interface PayoutDestination {
  pixKey?: string;
  paypalEmail?: string;
  bankAccount?: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: WithdrawalStatus;
  date: string;
  destination?: PayoutDestination;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  subscriberCount: number;
}

export interface UserSubscription {
  creatorId: string;
  tierId: string;
  expiresAt: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string; 
  urlLow: string;
  urlHigh: string;
  attribution: boolean;
  cover?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  name: string;
  email: string;
  nome_encrypted: EncryptedPayload;
  email_encrypted: EncryptedPayload;
  passwordHash: string;
  chave: string;
  avatar: string;
  bio?: string;
  
  // Tipagem de Perfil Solicitada
  profileType: "common" | "creator" | "developer";
  
  // Métricas Sociais Solicitadas
  postsCount: number;
  followersCount: number;
  followingCount: number;
  
  // Visibilidade e Link Oficial
  socialMetricsEnabled: boolean;
  officialLink: string;

  // Campos legados para compatibilidade
  followers: number;
  following: number;

  viewsLastYear: number;
  averageViewsPerVideo: number;
  monetizationEnrolled: boolean;
  isMonetizationSuspended?: boolean;
  suspensionReason?: string;
  isVerified?: boolean;
  isFaciallyVerified?: boolean;
  verificationLevel: VerificationLevel;
  level: VerificationLevel;
  consentAccepted: boolean;
  biometricHash?: string;
  isPremium?: boolean;
  subscriptionStatus?: SubscriptionStatus;
  isBetaTester?: boolean;
  sessionToken?: string;
  interests: string[];
  viewedContent: string[];
  links?: ProfileLink[];
  totalRevenue?: number;
  availableBalance?: number;
  notificationPrefs?: NotificationPrefs;
  betaNotifications?: boolean;
  betaGroup?: string;
  membershipTiers?: MembershipTier[];
  activeSubscriptions?: UserSubscription[];
  withdrawalHistory?: WithdrawalRequest[];
  points?: number; 
  boostedViews?: number;
  isActive?: boolean;
  firstViewDate?: string; 
}

export interface EncryptedPayload {
  encrypted: string;
  iv: string;
  tag: string;
  encryptedDEK?: string;
  dekIv?: string;
  dekTag?: string;
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

export interface MonetizationResult {
  aprovado: boolean;
  motivo?: string;
  nivel?: CreatorTier;
  anuncios?: { posicao: string; valor: number }[];
  totalGanho: number;
}

export interface Post {
  id: string;
  autor_id: string;
  username: string;
  userAvatar: string;
  content: string;
  category: string;
  media: string[];
  type: 'image' | 'video' | 'carousel' | 'live';
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  trendingScore: number;
  timestamp: string;
  isVerified?: boolean;
  music?: MusicTrack;
  musicUrl?: string;
  musicAttribution?: string;
  views?: number;
  duration?: number;
  monetization?: MonetizationResult;
  exclusiveTierId?: string;
  liveEngagementBoost?: number; 
  liveActive?: boolean;
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
  music?: MusicTrack;
  musicUrl?: string;
  musicAttribution?: string;
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

export interface SocialDonation {
  month: string;
  city: string;
  amount: number;
  basketsDistributed: number;
}

export interface ImpactResult {
  reinvestment: number;
  socialImpact: number;
  founderIncome: number;
  reserve: number;
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