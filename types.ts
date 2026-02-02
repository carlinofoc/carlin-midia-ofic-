
export type View = 'feed' | 'reels' | 'explore' | 'messages' | 'profile' | 'admin' | 'create' | 'terms' | 'privacy' | 'download';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isVerified?: boolean;
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
