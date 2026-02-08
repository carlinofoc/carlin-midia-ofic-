import React, { useState, useRef } from 'react';
import { Post, User, FeedItem, Ad, LiteConfig } from '../types';
import { Icons } from '../constants';
import AdItem from './AdItem';
import { liteModeManager } from '../services/liteModeService';

interface FeedProps {
  posts: FeedItem[];
  currentUser: User;
  onOpenLive: (post: Post) => void;
  liteConfig: LiteConfig;
}

const Feed: React.FC<FeedProps> = ({ posts, currentUser, onOpenLive, liteConfig }) => {
  return (
    <div className="flex flex-col w-full gap-6 px-4">
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 opacity-20">
          <Icons.Search className="w-16 h-16 mb-4" />
          <p className="text-xs font-black uppercase tracking-[0.3em]">Conectando à Rede...</p>
        </div>
      ) : (
        posts.map((item) => {
          if ('type' in item && item.type === 'ad') return <AdItem key={item.id} ad={item as Ad} />;
          return <PostCard key={item.id} post={item as Post} currentUser={currentUser} onOpenLive={onOpenLive} liteConfig={liteConfig} />;
        })
      )}
      <div className="h-32"></div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post; currentUser: User; onOpenLive: (p: Post) => void; liteConfig: LiteConfig }> = ({ post, currentUser, onOpenLive, liteConfig }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 overflow-hidden mb-4 shadow-2xl transition-all hover:border-white/10 group">
      <div className="flex items-center justify-between p-5 px-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl p-[2px] bg-gradient-to-tr from-blue-400 to-indigo-600 shadow-lg">
            <div className="w-full h-full rounded-[0.9rem] border-2 border-black overflow-hidden bg-black">
              <img src={post.userAvatar} className="w-full h-full object-cover" alt={post.username} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-white uppercase">{post.username}</span>
              {post.isVerified && <Icons.Verified className="w-4 h-4" />}
            </div>
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{post.category} • {post.timestamp}</p>
          </div>
        </div>
        <button className="p-2.5 text-zinc-700 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
        </button>
      </div>

      <div className="relative aspect-square bg-zinc-900 group-hover:scale-[1.005] transition-transform duration-700 overflow-hidden mx-1 rounded-[2.2rem]">
        {post.type === 'video' ? (
          <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
            <video ref={videoRef} src={post.media[0]} className="w-full h-full object-cover" loop muted autoPlay={!liteConfig.disableAutoPlayVideos} playsInline />
            {!isPlaying && liteConfig.disableAutoPlayVideos && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                   <Icons.Play className="w-10 h-10 text-white/80" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <img src={liteModeManager.getOptimizedImageUrl(post.media[0])} className="w-full h-full object-cover" loading="lazy" />
        )}
      </div>

      <div className="p-7 pt-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={toggleLike} className={`transition-all active:scale-150 transform ${liked ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'text-white hover:text-zinc-400'}`}>
              <Icons.Heart filled={liked} className="w-7 h-7" />
            </button>
            <button className="text-white hover:text-zinc-400 transition-colors"><Icons.Comment className="w-7 h-7" /></button>
            <button className="text-white hover:text-zinc-400 transition-colors"><Icons.Share className="w-7 h-7" /></button>
          </div>
          <button className="text-white hover:text-zinc-400 transition-colors"><Icons.Bookmark className="w-7 h-7" /></button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-black tracking-tight text-white">{likesCount.toLocaleString()} interações</p>
          <p className="text-[13px] leading-relaxed">
            <span className="font-black mr-2 text-blue-500 uppercase tracking-tighter">@{post.username}</span>
            <span className="text-zinc-300 font-medium">{post.content}</span>
          </p>
          <button className="text-[10px] font-black uppercase text-zinc-600 tracking-widest hover:text-zinc-400 transition-colors pt-1">Ver todos os comentários</button>
        </div>
      </div>
    </article>
  );
};

export default Feed;