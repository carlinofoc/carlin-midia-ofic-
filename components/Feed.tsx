
import React, { useState } from 'react';
import { Post } from '../types';
import { Icons } from '../constants';

interface FeedProps {
  posts: Post[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
  return (
    <div className="flex flex-col w-full">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {/* Spacer for mobile nav */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showHeart, setShowHeart] = useState(false);

  const handleDoubleClick = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article className="bg-black mb-4 border-b border-zinc-900 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
            <img src={post.userAvatar} className="w-full h-full rounded-full border-2 border-black object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">{post.username}</span>
              <Icons.Verified className="w-3.5 h-3.5" />
            </div>
            {post.location && <p className="text-[10px] text-zinc-400">{post.location}</p>}
          </div>
        </div>
        <button className="p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-300">
            <circle cx="12" cy="12" r="1.5" /><circle cx="6" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Media Content */}
      <div 
        className="relative aspect-square bg-zinc-900 flex items-center justify-center overflow-hidden"
        onDoubleClick={handleDoubleClick}
      >
        <img 
          src={post.media[0]} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center animate-ping">
            <Icons.Heart filled className="w-24 h-24 text-white/90 drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="px-3 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className={`transition-transform active:scale-125 ${liked ? 'text-red-500' : 'text-white'}`}>
              <Icons.Heart filled={liked} className="w-7 h-7" />
            </button>
            <button className="text-white hover:opacity-70"><Icons.Comment className="w-7 h-7" /></button>
            <button className="text-white hover:opacity-70"><Icons.Share className="w-7 h-7" /></button>
          </div>
          <button className="text-white hover:opacity-70"><Icons.Bookmark className="w-7 h-7" /></button>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold">{likeCount.toLocaleString()} curtidas</p>
          <p className="text-sm leading-tight">
            <span className="font-bold mr-2">{post.username}</span>
            <span className="text-zinc-200">{post.content}</span>
          </p>
          <button className="text-zinc-500 text-xs font-medium">Ver todos os {post.comments} comentários</button>
          <p className="text-[10px] text-zinc-500 uppercase font-medium">{post.timestamp}</p>
        </div>
      </div>
    </article>
  );
};

export default Feed;
