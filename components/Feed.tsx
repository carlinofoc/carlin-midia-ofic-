
import React, { useState, useRef, useEffect } from 'react';
import { Post, User, FeedItem, Ad, LiteConfig } from '../types';
import { Icons } from '../constants';
import AdItem from './AdItem';
import { liteModeManager } from '../services/liteModeService';

interface FeedProps {
  posts: FeedItem[];
  currentUser: User;
  showInstaBanner?: boolean;
  onCloseBanner?: () => void;
  onOpenInfo?: () => void;
  onOpenCreate?: () => void;
  onOpenLive?: (post: Post) => void;
  liteConfig: LiteConfig;
}

const Feed: React.FC<FeedProps> = ({ posts, currentUser, showInstaBanner, onCloseBanner, onOpenInfo, onOpenCreate, onOpenLive, liteConfig }) => {
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
            return <PostCard key={item.id} post={postItem} isOwnPost={postItem.autor_id === currentUser.id} currentUser={currentUser} onOpenLive={onOpenLive} liteConfig={liteConfig} />;
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

const PostCard: React.FC<{ post: Post; isOwnPost: boolean; currentUser: User; onOpenLive?: (p: Post) => void; liteConfig: LiteConfig }> = ({ post, isOwnPost, currentUser, onOpenLive, liteConfig }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showInsights, setShowInsights] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isSubscriber = currentUser.activeSubscriptions?.some(s => s.creatorId === post.autor_id && s.tierId === post.exclusiveTierId) || isOwnPost;
  const isLocked = post.exclusiveTierId && !isSubscriber;

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
    if (post.type === 'live') {
      onOpenLive?.(post);
      return;
    }
    if (!liked) {
      toggleLike();
    } else {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  const toggleVideo = () => {
    if (!videoRef.current || isLocked) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const isLite = liteModeManager.isLiteEnabled;
    const shouldDisableAutoplay = isLite && liteConfig.disableAutoPlayVideos;

    if (post.type !== 'video' || isLocked) return;

    if (shouldDisableAutoplay) {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

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
  }, [liteConfig.disableAutoPlayVideos, post.type, isLocked]);

  const isUserVerified = (isOwnPost && currentUser?.isFaciallyVerified) || (!isOwnPost && post.isVerified);
  
  const mediaUrl = post.media?.[0] || '';
  const displayMediaUrl = post.type === 'image' 
    ? liteModeManager.getOptimizedImageUrl(mediaUrl) 
    : mediaUrl;

  const liteImgOpts = liteModeManager.getLiteImageConfig();

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
        <div className="flex gap-2">
          {post.exclusiveTierId && (
            <div className="bg-purple-600/10 border border-purple-500/50 px-2 py-1 rounded-lg flex items-center gap-1">
              <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">MEMBRO</span>
              {isLocked ? <span className="text-[8px]">🔒</span> : <span className="text-[8px]">✨</span>}
            </div>
          )}
          <div className={`px-2 py-1 rounded-lg border ${post.type === 'live' ? 'bg-red-600 border-red-500 animate-pulse' : 'bg-zinc-900 border-zinc-800'}`}>
            <span className={`text-[8px] font-black uppercase tracking-widest ${post.type === 'live' ? 'text-white' : 'text-blue-500'}`}>
              {post.type === 'video' ? '🎬 RIO' : post.type === 'live' ? '● AO VIVO' : '🖼️ POST'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative aspect-square bg-zinc-900 overflow-hidden shadow-2xl" onDoubleClick={handleDoubleClick}>
        {isLocked ? (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-10 text-center gap-4">
             <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 shadow-xl">
                <span className="text-4xl">💎</span>
             </div>
             <div className="space-y-2">
                <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Conteúdo Exclusivo</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                   Este post é reservado para membros ativos do nível <span className="text-purple-400">Bronze</span> ou superior.
                </p>
             </div>
             <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-purple-600/20 active:scale-95 transition-all">
                Seja Membro Agora
             </button>
          </div>
        ) : (
          <>
            {post.type === 'video' ? (
              <div className="relative w-full h-full cursor-pointer" onClick={toggleVideo}>
                <video ref={videoRef} src={mediaUrl} className="w-full h-full object-cover" loop muted playsInline />
                {(!isPlaying || (liteModeManager.isLiteEnabled && liteConfig.disableAutoPlayVideos)) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Icons.Play className="w-12 h-12 text-white/50" />
                  </div>
                )}
              </div>
            ) : post.type === 'live' ? (
               <div className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer" onClick={() => onOpenLive?.(post)}>
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                     <div className="bg-red-600 px-2 py-0.5 rounded text-[7px] font-black text-white uppercase tracking-widest">LIVE</div>
                     <div className="bg-black/60 px-2 py-0.5 rounded text-[7px] font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-zinc-400"></span> 1.2K
                     </div>
                  </div>
                  {post.liveEngagementBoost && (
                    <div className="absolute top-4 right-4 z-10">
                       <span className="bg-blue-600/20 text-blue-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border border-blue-500/20 backdrop-blur-md">Impulso: +{post.liveEngagementBoost}%</span>
                    </div>
                  )}
                  <img src={post.userAvatar} className="w-32 h-32 rounded-full border-4 border-red-600 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-center">
                     <p className="text-white text-xs font-black uppercase tracking-widest mb-2 italic">Assistir Transmissão</p>
                     <div className="flex gap-1 justify-center">
                        <div className="h-1 w-8 bg-red-600 rounded-full"></div>
                        <div className="h-1 w-4 bg-red-600/30 rounded-full"></div>
                     </div>
                  </div>
               </div>
            ) : (
              <img 
                src={displayMediaUrl} 
                className="w-full h-full object-cover" 
                loading="lazy"
                style={{ 
                  imageRendering: liteImgOpts.renderingHint as any 
                }}
              />
            )}
          </>
        )}
        
        {showHeart && !isLocked && (
          <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300 pointer-events-none">
            <Icons.Heart filled className="w-20 h-20 text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          </div>
        )}
      </div>

      {!isLocked && (
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

            {post.musicAttribution && (
              <div className="flex items-center gap-2 py-2 mt-2 border-t border-zinc-900/50">
                 <span className="text-xs">🎵</span>
                 <p className="text-[10px] font-black uppercase text-blue-500 tracking-tighter">
                   Música: {post.musicAttribution} (YouTube Audio Library)
                 </p>
              </div>
            )}
            
            <div className="pt-2">
              <button onClick={toggleInsights} className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-blue-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                {showInsights ? 'Esconder Transparência' : 'Auditoria Algorítmica'}
              </button>
              {showInsights && post.scores && (
                <div className="mt-3 p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 space-y-4 animate-in slide-in-from-top-2 duration-300">
                   <div className="grid grid-cols-2 gap-4">
                      <InsightMetric label="Match Interesse" value={post.scores.breakdown.interest} color="bg-blue-500" />
                      <InsightMetric label="Trending Score" value={post.scores.breakdown.trending} color="bg-orange-500" />
                      <InsightMetric label="Recência" value={post.scores.breakdown.recency} color="bg-green-500" />
                      <InsightMetric label="Conexão Seguindo" value={post.scores.amigos} color="bg-purple-500" />
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
