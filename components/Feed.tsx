
import React, { useState, useRef, useEffect } from 'react';
import { Post, User, FeedItem, Ad } from '../types';
import { Icons } from '../constants';
import AdItem from './AdItem';

interface FeedProps {
  posts: FeedItem[];
  currentUser: User;
  showInstaBanner?: boolean;
  onCloseBanner?: () => void;
  onOpenInfo?: () => void;
  onOpenCreate?: () => void;
}

const Feed: React.FC<FeedProps> = ({ posts, currentUser, showInstaBanner, onCloseBanner, onOpenInfo, onOpenCreate }) => {
  return (
    <div className="flex flex-col w-full">
      {showInstaBanner && (
        <div className="px-4 pt-4 animate-in slide-in-from-top-4 duration-500">
           <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 p-4">
                <button onClick={onCloseBanner} className="text-zinc-600 hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
                      <span className="text-white text-xl">📸</span>
                   </div>
                   <h3 className="text-lg font-black italic tracking-tighter text-white uppercase">Transição Saudável</h3>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  No Carlin Mídia Ofic, você não compete contra o algoritmo. Se o conteúdo tem valor, ele circula. <strong>Transparência é nossa regra número um.</strong>
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                   <button 
                    onClick={onOpenCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                   >
                     Começar a criar
                   </button>
                   <button 
                    onClick={onOpenInfo}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                   >
                     Entender Alcance
                   </button>
                </div>
             </div>
           </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center opacity-50">
          <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6">
             <Icons.Search className="w-8 h-8" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em]">Buscando Relevância...</p>
        </div>
      ) : (
        <>
          {posts.map((item) => {
            if ('type' in item && item.type === 'ad') {
              return <AdItem key={item.id} ad={item as Ad} />;
            }
            const postItem = item as Post;
            return <PostCard key={item.id} post={postItem} isOwnPost={postItem.autor_id === currentUser.id} currentUser={currentUser} />;
          })}
          
          <div className="px-6 py-20 text-center space-y-6">
             <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800">
                <span className="text-blue-500">✨</span>
             </div>
             <div className="space-y-2">
                <h4 className="text-sm font-black uppercase italic tracking-tighter">Você está atualizado.</h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">
                   Respeitamos seu tempo. Que tal desconectar um pouco e viver o agora?
                </p>
             </div>
             <button 
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className="text-[9px] text-blue-500 font-black uppercase tracking-[0.3em] hover:underline"
             >
               Voltar ao Início
             </button>
          </div>
        </>
      )}
      <div className="h-24"></div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post; isOwnPost: boolean; currentUser?: User }> = ({ post, isOwnPost, currentUser }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showInsights, setShowInsights] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleInsights = () => setShowInsights(!showInsights);

  const toggleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    setLiked(!liked);
  };

  const handleDoubleClick = () => {
    if (!liked) {
      toggleLike();
    } else {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {});
              setIsPlaying(true);
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.7 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const isUserVerified = (isOwnPost && currentUser?.isFaciallyVerified) || (!isOwnPost && post.isVerified);

  return (
    <article className="bg-transparent mb-10 border-b border-zinc-900/50 pb-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full p-[2px] bg-zinc-800 shadow-lg">
            <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-black">
               <img src={isOwnPost && currentUser?.avatar ? currentUser.avatar : post.userAvatar} className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight">{isOwnPost && currentUser?.displayName ? currentUser.displayName : post.username}</span>
              {isUserVerified && <Icons.Verified className="w-3.5 h-3.5" />}
              <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-500 text-[7px] font-black rounded border border-zinc-700 uppercase tracking-tighter ml-1">
                 {post.category}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
               <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">{post.timestamp}</span>
            </div>
          </div>
        </div>
        <div className="px-2 py-1 bg-zinc-900 rounded-lg border border-zinc-800">
          <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">
            {post.type === 'video' ? '🎬 RIO' : '🖼️ POST'}
          </span>
        </div>
      </div>

      <div className="relative aspect-square bg-zinc-900 overflow-hidden shadow-2xl" onDoubleClick={handleDoubleClick}>
        {post.type === 'video' ? (
          <div className="relative w-full h-full cursor-pointer" onClick={toggleVideo}>
            <video ref={videoRef} src={post.media[0]} className="w-full h-full object-cover" loop muted playsInline />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Icons.Play className="w-12 h-12 text-white/50" />
              </div>
            )}
          </div>
        ) : (
          <img src={post.media[0]} className="w-full h-full object-cover" loading="lazy" />
        )}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300 pointer-events-none">
            <Icons.Heart filled className="w-20 h-20 text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          </div>
        )}
      </div>

      <div className="px-5 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={toggleLike} className={`transition-all ${liked ? 'text-red-500' : 'text-white'}`}><Icons.Heart filled={liked} className="w-7 h-7" /></button>
            <button className="text-white"><Icons.Comment className="w-7 h-7" /></button>
            <button className="text-white"><Icons.Share className="w-7 h-7" /></button>
          </div>
          <button className="text-white"><Icons.Bookmark className="w-7 h-7" /></button>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-black tracking-tight">{likesCount.toLocaleString()} Curtidas</p>
          <p className="text-sm leading-relaxed">
            <span className="font-black mr-2 tracking-tight">{isOwnPost && currentUser?.displayName ? currentUser.displayName : post.username}</span>
            <span className="text-zinc-400">{post.content}</span>
          </p>
          
          <div className="pt-4">
            <button onClick={toggleInsights} className="text-[9px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {showInsights ? 'Esconder Transparência' : 'Auditoria Algorítmica v5.2'}
            </button>
            {showInsights && post.scores && (
              <div className="mt-3 p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 space-y-4 animate-in slide-in-from-top-2 duration-300">
                 <div className="grid grid-cols-2 gap-4">
                    <InsightMetric label="Match Interesse" value={post.scores.breakdown.interest} color="bg-blue-500" />
                    <InsightMetric label="Trending Score" value={post.scores.breakdown.trending} color="bg-orange-500" />
                    <InsightMetric label="Recência (Vida)" value={post.scores.breakdown.recency} color="bg-green-500" />
                    <InsightMetric label="Conexão Seguindo" value={post.scores.amigos} color="bg-purple-500" />
                 </div>

                 <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-white">Score Combinado</span>
                    <span className="text-xs font-black text-blue-500">{(post.scores.final * 10).toFixed(1)} Pts</span>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const InsightMetric = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
       <span className="text-[7px] font-black uppercase text-zinc-500">{label}</span>
       <span className="text-[8px] font-black text-white">{(value * 10).toFixed(1)}</span>
    </div>
    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
       <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${Math.min(1, value) * 100}%` }}></div>
    </div>
  </div>
);

export default Feed;
