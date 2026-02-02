
export type View = 'feed' | 'reels' | 'explore' | 'messages' | 'profile' | 'admin' | 'create' | 'terms' | 'privacy' | 'download' | 'register' | 'login' | 'dashboard' | 'verification' | 'biometric_policy' | 'ad_controls' | 'monetization_manifesto' | 'beta_center' | 'creator_plus' | 'beta_terms' | 'roadmap' | 'creator_plus_faq' | 'monetization_info' | 'cancel_subscription' | 'notification_settings' | 'developer_info' | 'developer_manifesto' | 'advanced_settings' | 'security_center';
export type FeedMode = 'followers' | 'discovery' | 'relevance';
export type FeedFormatPreference = 'posts' | 'videos' | 'balanced';

export interface EncryptedPayload {
  encrypted: string;
  iv: string;
  tag: string;
}

// Tabela: Usuarios (Mock Mongoose Schema)
export interface User {
  id: string;
  username: string;
  displayName: string; // Descriptografado em memória
  nome_encrypted: EncryptedPayload;
  email_encrypted: EncryptedPayload;
  passwordHash: string; // senha_hash
  chave: string; // Buffer Hex (Chave AES individual do usuário)
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isVerified?: boolean;
  isFaciallyVerified?: boolean;
  isPremium?: boolean;
  isBetaTester?: boolean;
  email?: string; // Descriptografado em memória
  sessionToken?: string; // JWT
}

// Tabela: Conteudos
export interface Post {
  id: string;
  autor_id: string;
  username: string;
  userAvatar: string;
  content: string;
  conteudo_encrypted?: EncryptedPayload;
  media: string[];
  type: 'image' | 'video' | 'carousel';
  likes: number;
  comments: number;
  timestamp: string;
  stats?: PostStats;
  isVerified?: boolean;
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

export interface NotificationPrefs {
  performance: boolean;
  educational: boolean;
  security: boolean;
  community: boolean;
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
