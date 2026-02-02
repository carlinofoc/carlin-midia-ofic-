
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface ProfileProps {
  user: User;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onOpenTerms, onOpenPrivacy }) => {
  const [tab, setTab] = useState<'posts' | 'saved' | 'tagged'>('posts');

  return (
    <div className="w-full max-w-2xl mx-auto pt-14 lg:pt-8 bg-black min-h-screen">
      {/* User Stats Section */}
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between gap-8">
          <div className="relative group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-tr from-blue-600 to-blue-400">
              <div className="w-full h-full rounded-full bg-black overflow-hidden border-4 border-black">
                <img src={user.avatar} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
              <Icons.Plus className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex flex-1 justify-around text-center">
            <div>
              <p className="font-black text-lg">42</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Posts</p>
            </div>
            <div>
              <p className="font-black text-lg">{user.followers.toLocaleString()}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Seguidores</p>
            </div>
            <div>
              <p className="font-black text-lg">{user.following.toLocaleString()}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Seguindo</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <h2 className="font-bold text-sm">{user.displayName}</h2>
            <Icons.Verified className="w-4 h-4" />
          </div>
          <p className="text-sm text-zinc-300 leading-snug">{user.bio}</p>
          <a href="#" className="text-sm text-blue-400 font-medium flex items-center gap-1">
            <svg className="w-3 h-3 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" /></svg>
            carlinmidia.ofic/social
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 py-2 rounded-lg text-sm font-bold transition-colors">Editar perfil</button>
          <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 py-2 rounded-lg text-sm font-bold transition-colors">Compartilhar perfil</button>
          <button className="bg-zinc-900 hover:bg-zinc-800 px-3 rounded-lg"><Icons.User className="w-5 h-5" /></button>
        </div>

        {/* Highlights */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
          {['Viagens', 'Destaques', 'Trampo', 'Vibe'].map(h => (
            <div key={h} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 p-1">
                <img src={`https://picsum.photos/seed/${h}/100/100`} className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all" />
              </div>
              <span className="text-[10px] font-medium text-zinc-400">{h}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Icons.Plus className="w-6 h-6 text-zinc-500" />
            </div>
            <span className="text-[10px] font-medium text-zinc-400">Novo</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-zinc-900">
        <button onClick={() => setTab('posts')} className={`flex-1 flex justify-center py-3 ${tab === 'posts' ? 'border-t-2 border-white' : 'text-zinc-500'}`}>
          <Icons.Home className="w-6 h-6" />
        </button>
        <button onClick={() => setTab('saved')} className={`flex-1 flex justify-center py-3 ${tab === 'saved' ? 'border-t-2 border-white' : 'text-zinc-500'}`}>
          <Icons.Bookmark className="w-6 h-6" />
        </button>
        <button onClick={() => setTab('tagged')} className={`flex-1 flex justify-center py-3 ${tab === 'tagged' ? 'border-t-2 border-white' : 'text-zinc-500'}`}>
          <Icons.User className="w-6 h-6" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="aspect-square bg-zinc-900 relative group overflow-hidden">
            <img 
              src={`https://picsum.photos/seed/profile-grid-${i}/400/400`} 
              className="w-full h-full object-cover group-active:opacity-80 transition-opacity" 
              loading="lazy"
            />
            {i % 4 === 0 && <Icons.Play className="absolute top-2 right-2 w-4 h-4 drop-shadow-lg" />}
          </div>
        ))}
      </div>
      
      {/* Legal Footer */}
      <div className="p-10 text-center space-y-4">
        <div className="flex justify-center gap-6">
          <button onClick={onOpenTerms} className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-blue-500">Termos</button>
          <button onClick={onOpenPrivacy} className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-blue-500">Privacidade</button>
        </div>
        <p className="text-[8px] text-zinc-800 uppercase tracking-[0.2em]">© 2024 Carlin Mídia Ofic Inc.</p>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default Profile;
