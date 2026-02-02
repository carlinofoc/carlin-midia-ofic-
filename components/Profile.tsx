
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface ProfileProps {
  user: User;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onOpenTerms, onOpenPrivacy }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');

  return (
    <div className="w-full max-w-4xl mx-auto pt-20 lg:pt-8 px-4">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-10">
        <div className="w-24 h-24 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-blue-400 to-blue-800">
           <div className="w-full h-full rounded-full bg-black overflow-hidden border-4 border-black">
              <img src={user.avatar} className="w-full h-full object-cover" />
           </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h2 className="text-xl font-medium">{user.username}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <button className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-bold transition-colors">Editar Perfil</button>
              <button 
                onClick={onOpenTerms}
                className="px-4 py-1.5 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg text-sm font-bold transition-colors text-zinc-400"
              >
                Termos
              </button>
              <button 
                onClick={onOpenPrivacy}
                className="px-4 py-1.5 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg text-sm font-bold transition-colors text-zinc-400"
              >
                Privacidade
              </button>
              <button className="p-1.5"><Icons.Plus className="w-6 h-6 rotate-45" /></button>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-10">
            <div className="text-center md:text-left"><span className="font-bold">42</span> publicações</div>
            <div className="text-center md:text-left"><span className="font-bold">{user.followers}</span> seguidores</div>
            <div className="text-center md:text-left"><span className="font-bold">{user.following}</span> seguindo</div>
          </div>

          <div className="text-center md:text-left">
            <p className="font-bold text-sm">{user.displayName}</p>
            <p className="text-sm text-zinc-300">{user.bio}</p>
            <a href="#" className="text-blue-400 text-sm hover:underline">carlinmidia.ofic/social</a>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="flex gap-6 overflow-x-auto hide-scrollbar mb-12 pb-4 border-b border-zinc-900">
         {['Destaques', 'Viagens', 'Arte', 'Coding', 'Música'].map(h => (
           <div key={h} className="flex flex-col items-center gap-2 shrink-0">
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-zinc-800 bg-zinc-900 p-1">
               <img src={`https://picsum.photos/seed/${h}/100/100`} className="w-full h-full rounded-full object-cover" />
             </div>
             <span className="text-xs font-medium">{h}</span>
           </div>
         ))}
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-t border-zinc-800">
        <button onClick={() => setActiveTab('posts')} className={`flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest ${activeTab === 'posts' ? 'border-t-2 border-white text-white' : 'text-zinc-500'}`}>
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm1 0v5h5V1H1zm8 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V1zm1 0v5h5V1h-5zM0 9a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V9zm1 0v5h5V9H1zm8 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V9zm1 0v5h5V9h-5z"/></svg>
           Posts
        </button>
        <button onClick={() => setActiveTab('saved')} className={`flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest ${activeTab === 'saved' ? 'border-t-2 border-white text-white' : 'text-zinc-500'}`}>
           <Icons.Bookmark className="w-4 h-4" />
           Salvos
        </button>
        <button onClick={() => setActiveTab('tagged')} className={`flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest ${activeTab === 'tagged' ? 'border-t-2 border-white text-white' : 'text-zinc-500'}`}>
           <Icons.User className="w-4 h-4" />
           Marcados
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4 py-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative aspect-square bg-zinc-900 group cursor-pointer overflow-hidden">
             <img src={`https://picsum.photos/seed/profile${i}/400/400`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
             <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
               <span className="flex items-center gap-1 font-bold"><Icons.Heart filled className="w-5 h-5" /> 84</span>
               <span className="flex items-center gap-1 font-bold"><Icons.Comment className="w-5 h-5" /> 12</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
