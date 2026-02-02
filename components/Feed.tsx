
import React, { useState, useRef, useEffect } from 'react';
import { Post, User, FeedItem, Ad } from '../types';
import { Icons } from '../constants';
import SuspiciousAlert from './SuspiciousAlert';
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
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
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
                   <h3 className="text-lg font-black italic tracking-tighter text-white uppercase">Veio do Instagram?</h3>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Cansado de postar e não alcançar nem seus próprios seguidores? No Carlin Mídia Ofic, isso não acontece. Aqui, se o conteúdo é relevante, ele circula — <strong>sem shadowban, sem jogo oculto.</strong>
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
                     Como funciona o alcance
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
          <p className="text-xs font-black uppercase tracking-[0.2em]">Relevância Unificada Ativa</p>
          <p className="text-[10px] text-zinc-500 mt-2 uppercase">Aguardando conteúdos que eduquem ou inspirem.</p>
        </div>
      ) : (
        posts.map((item) => {
          if ('type' in item && item.type === 'ad') {
            return <AdItem key={item.id} ad={item as Ad} />;
          }
          return <PostCard key={item.id} post={item as Post} isOwnPost={item.userId === currentUser.id || item.userId === 'me'} currentUser={currentUser} />;
        })
      )}
      <div className="h-24"></div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post; isOwnPost: boolean; currentUser?: User }> = ({ post, isOwnPost, currentUser }) => {
  const [liked, setLiked] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleInsights = () => {
    const nextState = !showInsights;
    setShowInsights(nextState);
    
    if (nextState && isOwnPost) {
      const event = new CustomEvent('carlin-notification', {
        detail: {
          id: 'edu_metrics',
          type: 'educational',
          title: 'Entendendo seu Score 📊',
          message: 'O Score de Relevância mede o valor real do seu post. Quanto mais você ajuda ou inspira, maior ele fica!',
          icon: <div className="bg-purple-600 p-2 rounded-lg text-white">💡</div>
        }
      });
      window.dispatchEvent(event);
    }
  };

  const handleDoubleClick = () => {
    if (!liked) setLiked(true);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
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

  const isHighlyRelevant = post.stats?.relevanceScore && post.stats.relevanceScore > 85;
  const isUserVerified = (isOwnPost && currentUser?.isFaciallyVerified) || (!isOwnPost && post.isVerified);
  const userRiskLevel = post.userRiskLevel;

  return (
    <article className={`bg-transparent mb-10 border-b border-zinc-900/50 pb-8 ${post.isSuspicious ? 'opacity-70 grayscale-[0.5]' : ''}`}>
      {/* Header Relevância Unificada */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-blue-600 via-blue-400 to-indigo-500 shadow-lg shadow-blue-500/10">
            <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-black">
               <img src={isOwnPost && currentUser?.avatar ? currentUser.avatar : post.userAvatar} className="w-full h-full object-cover" alt={post.username} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight">{isOwnPost && currentUser?.displayName ? currentUser.displayName : post.username}</span>
              {isUserVerified && <Icons.Verified className="w-3.5 h-3.5" />}
              {post.isFromFollower && (
                <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded text-[7px] font-black text-blue-500 uppercase ml-1">Seguindo</div>
              )}
            </div>
            {!post.isFromFollower && post.stats?.relevanceScore && (
              <div className="flex items-center gap-1.5 mt-1">
                 <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest leading-none">Entrega Total</span>
                 <span className="text-zinc-600 text-[9px]">•</span>
                 <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Score: {post.stats.relevanceScore}</span>
                 {post.stats.isContinuousCirculation && (
                    <span className="text-[7px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded font-black uppercase ml-1 animate-pulse">Circulação Ativa</span>
                 )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5">
         {userRiskLevel && <SuspiciousAlert riskLevel={userRiskLevel} />}
      </div>

      <div className="relative aspect-square bg-zinc-900 group overflow-hidden shadow-2xl" onDoubleClick={handleDoubleClick}>
        {post.type === 'video' ? (
          <div className="relative w-full h-full cursor-pointer" onClick={toggleVideo}>
            <video 
              ref={videoRef}
              src={post.media[0]} 
              className="w-full h-full object-cover" 
              loop 
              muted 
              playsInline 
            />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                <Icons.Play className="w-16 h-16 text-white/50" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
               <Icons.Play className="w-3 h-3 text-white" />
               <span className="text-[8px] font-black text-white uppercase">VÍDEO RELEVANTE</span>
            </div>
          </div>
        ) : (
          <img 
            src={post.media[0]} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            loading="lazy" 
          />
        )}
        
        {/* Selo Visual de Conteúdo Relevante */}
        {isHighlyRelevant && (
           <div className="absolute bottom-4 left-4 z-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="bg-blue-600/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg shadow-blue-500/30">
                 <span className="text-white text-[10px]">✨</span>
                 <span className="text-[8px] font-black text-white uppercase tracking-widest">Conteúdo Relevante</span>
              </div>
           </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none"></div>

        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-300 pointer-events-none">
            <Icons.Heart filled className="w-24 h-24 text-white drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]" />
          </div>
        )}
      </div>

      <div className="px-5 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setLiked(!liked)} className={`transition-all active:scale-125 ${liked ? 'text-red-500' : 'text-white'}`}>
              <Icons.Heart filled={liked} className="w-7 h-7" />
            </button>
            <button className="text-white"><Icons.Comment className="w-7 h-7" /></button>
            <button className="text-white"><Icons.Share className="w-7 h-7" /></button>
          </div>
          <button className="text-white"><Icons.Bookmark className="w-7 h-7" /></button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-black tracking-tight">{post.likes.toLocaleString()} curtidas</p>
          
          <p className="text-sm leading-relaxed">
            <span className="font-black mr-2 tracking-tight">{isOwnPost && currentUser?.displayName ? currentUser.displayName : post.username}</span>
            <span className="text-zinc-300 font-medium">{post.content}</span>
          </p>
          
          {isOwnPost && (
            <div className="mt-5 pt-4 border-t border-zinc-900/50">
              <button 
                onClick={toggleInsights}
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-blue-400 transition-colors"
              >
                📊 {showInsights ? 'Fechar Painel de Transparência' : 'Analisar Entrega Unificada'}
              </button>
              
              {showInsights && post.stats && (
                <div className="mt-4 p-5 bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800/50 space-y-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex justify-between items-center">
                     <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Entrega por Relevância Unificada</h4>
                  </div>
                  
                  <div className="flex items-center gap-6">
                     <div className="relative w-24 h-24">
                        <svg className="w-full h-full -rotate-90">
                           <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                           <circle 
                              cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" 
                              className="text-indigo-500 shadow-[0_0_10px_indigo]" 
                              strokeDasharray={264} 
                              strokeDashoffset={264 - (264 * post.stats.relevanceScore) / 100} 
                              strokeLinecap="round" 
                           />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                           <span className="text-lg font-black text-white">{post.stats.relevanceScore}</span>
                           <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-widest">Relevância</span>
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default Feed;
