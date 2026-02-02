
export type View = 'feed' | 'reels' | 'explore' | 'messages' | 'profile' | 'admin' | 'create' | 'terms' | 'privacy' | 'download' | 'register';

export interface User {
  id: string;
  username: string; // Este é o handle (@)
  displayName: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isVerified?: boolean;
  email?: string;
  phone?: string;
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
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  media: string;
  viewed: boolean;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
  };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
  type?: 'text' | 'image' | 'audio';
  status?: 'sent' | 'received' | 'read';
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  messages: Message[];
}
