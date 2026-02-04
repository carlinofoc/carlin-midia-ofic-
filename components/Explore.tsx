
import React, { useState, useMemo } from 'react';
import { Icons } from '../constants';
import { Post } from '../types';
import { liteModeManager } from '../services/liteModeService';

interface ExploreProps {
  posts: Post[];
}

type FilterType = 'all' | 'video' | 'image';

const Explore: React.FC<ExploreProps> = ({ posts }) => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredResults = useMemo(() => {
    return posts.filter(item => {
      const matchesQuery = item.content.toLowerCase().includes(query.toLowerCase()) || 
                           item.username.toLowerCase().includes(query.toLowerCase()) ||
                           item.category.toLowerCase().includes(query.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
      
      return matchesQuery && matchesFilter;
    });
  }, [posts, query, activeFilter]);

  return (
    <div className="w-full max-w-2xl mx-auto pt-20 lg:pt-8 p-6 space-y-8 animate-in fade-in duration-500">
      {/* Branding Header */}
      <div className="flex flex-col gap-2">
         <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Descobrir</h1>
         <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">Busca Segura & Relevância Real</p>
      </div>

      {/* Search Bar - Carlin Style */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Icons.Search className="w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar assuntos, vídeos ou posts..."
          className="w-full bg-[#0F172A] border border-zinc-800 rounded-[2rem] py-5 pl-14 pr-6 text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-600 shadow-2xl"
        />
      </div>

      {/* Filter Tabs - Premium Chips */}
      <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
        <FilterChip label="Tudo" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} icon="🌐" />
        <FilterChip label="Rios (Vídeos)" active={activeFilter === 'video'} onClick={() => setActiveFilter('video')} icon="🎬" />
        <FilterChip label="Posts" active={activeFilter === 'image'} onClick={() => setActiveFilter('image')} icon="🖼️" />
      </div>

      {/* Results Grid / List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
            <div className="text-4xl">🔎</div>
            <p className="text-xs font-black uppercase tracking-widest">Nenhum resultado encontrado para "{query}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {filteredResults.map((post) => (
               <div key={post.id} className="relative aspect-square bg-zinc-900 rounded-3xl overflow-hidden group border border-zinc-800 hover:border-blue-500/50 transition-all cursor-pointer">
                  {post.type === 'video' ? (
                     <div className="w-full h-full relative">
                        <img src={liteModeManager.getOptimizedImageUrl(post.userAvatar)} className="w-full h-full object-cover opacity-40 blur-sm" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Icons.Play className="w-10 h-10 text-white/50" />
                        </div>
                     </div>
                  ) : (
                     <img src={liteModeManager.getOptimizedImageUrl(post.media[0])} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  )}
                  
                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                     <p className="text-[10px] font-black uppercase text-white truncate">@{post.username}</p>
                     <p className="text-[8px] font-bold text-zinc-400 truncate">{post.category}</p>
                  </div>

                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/5">
                     <span className="text-[8px] font-black text-white">{post.type === 'video' ? '🎬 RIO' : '🖼️ POST'}</span>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Security Footer */}
      <div className="pt-10 text-center">
         <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-[0.4em] leading-relaxed">
           Resultados auditados por Carlin v4.1<br/>
           Privacidade e relevância garantidas.
         </p>
      </div>
      <div className="h-24"></div>
    </div>
  );
};

const FilterChip = ({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: string }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-xl ${
      active ? 'bg-blue-600 text-white border-transparent' : 'bg-[#0F172A] text-zinc-500 border border-zinc-800 hover:text-white'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

export default Explore;
