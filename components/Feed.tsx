
import React from 'react';
import { Post } from '../types';
import { Icons } from '../constants';

interface FeedProps {
  posts: Post[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
  return (
    <div className="flex flex-col divide-y divide-zinc-900">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

// Use React.FC to handle standard React props like key correctly
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.likes);

  const toggleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="flex flex-col bg-black py-4 lg:py-6 lg:rounded-2xl lg:mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-3">
          <img src={post.userAvatar} alt={post.username} className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-800" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm hover:underline cursor-pointer">{post.username}</span>
              <Icons.Verified className="w-3 h-3" />
              <span className="text-zinc-500 text-xs">• {post.timestamp}</span>
            </div>
            {post.location && <span className="text-[10px] text-zinc-400">{post.location}</span>}
          </div>
        </div>
        <button className="text-zinc-400 hover:text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
        </button>
      </div>

      {/* Media */}
      <div className="relative aspect-square w-full bg-zinc-900 group" onDoubleClick={toggleLike}>
        <img 
          src={post.media[0]} 
          alt="Post content" 
          className="w-full h-full object-cover transition-opacity duration-300" 
          loading="lazy"
        />
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300 ${liked ? 'scale-100 opacity-0' : 'scale-0'}`}>
          <Icons.Heart filled className="w-20 h-20 text-white/80" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className={`transition-transform active:scale-125 ${liked ? 'text-red-500' : 'hover:text-zinc-400'}`}>
            <Icons.Heart filled={liked} className="w-7 h-7" />
          </button>
          <button className="hover:text-zinc-400"><Icons.Comment className="w-7 h-7" /></button>
          <button className="hover:text-zinc-400"><Icons.Share className="w-7 h-7" /></button>
        </div>
        <button className="hover:text-zinc-400"><Icons.Bookmark className="w-7 h-7" /></button>
      </div>

      {/* Details */}
      <div className="px-4 space-y-1">
        <p className="text-sm font-bold">{likeCount.toLocaleString()} likes</p>
        <p className="text-sm">
          <span className="font-bold mr-2">{post.username}</span>
          {post.content}
        </p>
        <button className="text-zinc-500 text-sm mt-1">View all {post.comments} comments</button>
      </div>
    </div>
  );
};

export default Feed;
