
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';
import EditProfilePhoto from './EditProfilePhoto';
import EditBio from './EditBio';

interface ProfileProps {
  user: User;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  isLite: boolean;
  onToggleLite: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenDashboard: () => void;
  onOpenVerification: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onOpenAdControls: () => void;
  onOpenManifesto: () => void;
  onOpenBetaCenter: () => void;
  onOpenCreatorPlus: () => void;
  onOpenRoadmap: () => void;
  onOpenMonetizationInfo: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  user, onOpenTerms, onOpenPrivacy, isLite, onToggleLite, isDark, onToggleDark, 
  onOpenDashboard, onOpenVerification, onUpdateUser, onOpenAdControls, onOpenManifesto, onOpenBetaCenter, onOpenCreatorPlus, onOpenRoadmap, onOpenMonetizationInfo 
}) => {
  const [tab, setTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [showLiteHelp, setShowLiteHelp] = useState(false);
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);

  const containerClasses = isDark ? "bg-black text-white" : "bg-zinc-50 text-zinc-900";
  const cardClasses = isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";
  const borderClasses = isDark ? "border-zinc-900" : "border-zinc-200";

  const handleAvatarUpdate = (newAvatar: string) => {
    onUpdateUser({ ...user, avatar: newAvatar });
    setShowEditPhoto(false);
  };

  const handleBioUpdate = (newBio: string) => {
    onUpdateUser({ ...user, bio: newBio });
    setShowEditBio(false);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto pt-14 lg:pt-8 ${containerClasses} min-h-screen transition-colors pb-32`}>
      {/* Header Info */}
      <div className="px-5 py-6 space-y-6">
        <div className="flex items-center justify-between gap-6">
          <div className="relative group cursor-pointer" onClick={() => setShowEditPhoto(true)}>
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full p-[3px] ${isLite ? 'bg-zinc-800' : 'bg-gradient-to-tr from-blue-600 to-blue-400'}`}>
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-black' : 'bg-white'} overflow-hidden border-2 ${isDark ? 'border-black' : 'border-white'} relative`}>
                <img 
                  src={user.avatar || 'assets/profile.png'} 
                  className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                  alt={`Avatar de ${user.displayName}`}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <span className="text-[10px] font-black text-white uppercase tracking-tighter">Editar</span>
                </div>
              </div>
            </div>
            {user.isFaciallyVerified && (
              <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full border-4 border-black shadow-lg">
                 <Icons.Verified className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="flex flex-1 justify-around text-center">
            <div>
              <p className="font-black text-lg">12</p>
              <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} uppercase tracking-widest font-bold`}>Publicações</p>
            </div>
            <div>
              <p className="font-black text-lg">0</p>
              <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} uppercase tracking-widest font-bold`}>Seguidores</p>
            </div>
            <div>
              <p className="font-black text-lg">0</p>
              <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} uppercase tracking-widest font-bold`}>Seguindo</p>
            </div>
          </div>
        </div>

        {/* Info & Bio */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h2 className="font-black text-lg">{user.displayName}</h2>
            {user.isVerified && <Icons.Verified className="w-4 h-4" />}
            {user.isBetaTester && (
               <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-500 text-[8px] font-black rounded border border-zinc-700 uppercase tracking-widest">Beta</span>
            )}
          </div>
          <p className="text-xs text-blue-500 font-bold uppercase tracking-widest flex items-center gap-2">
            @{user.username}
            {isLite && <span className="bg-blue-500/20 text-blue-500 text-[8px] px-1.5 py-0.5 rounded font-black">LITE</span>}
            {user.isPremium && <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text font-black">CRIADOR+</span>}
          </p>
          <div className="relative group">
            <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-600'} leading-relaxed mt-2 whitespace-pre-wrap`}>
              {user.bio || "Sem biografia ainda."}
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="space-y-3">
          <button 
            onClick={user.isPremium ? onOpenBetaCenter : onOpenCreatorPlus}
            className={`w-full ${user.isPremium ? 'bg-zinc-900 border border-zinc-800' : 'bg-gradient-to-r from-indigo-600 to-blue-600'} text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all relative overflow-hidden group`}
          >
            {user.isPremium && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
            <span className="text-xl group-hover:scale-110 transition-transform">{user.isPremium ? '🧪' : '💎'}</span>
            <span className="text-xs font-black uppercase tracking-widest">{user.isPremium ? 'Acessar LABS (Beta)' : 'Seja Criador+'}</span>
          </button>

          <button 
            onClick={onOpenDashboard}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            <span className="text-xl">📊</span>
            <span className="text-xs font-black uppercase tracking-widest">Painel de Impacto</span>
          </button>

          {!user.isFaciallyVerified && (
            <button 
              onClick={onOpenVerification}
              className={`w-full ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} border py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all`}
            >
              <span className="text-xl">🛡️</span>
              <span className="text-xs font-black uppercase tracking-widest">Obter Selo Verificado</span>
            </button>
          )}
        </div>

        {/* Development & Public Info */}
        <div className={`${cardClasses} rounded-2xl p-5 border space-y-4`}>
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Futuro da Plataforma</h3>
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onOpenRoadmap}
                className={`p-4 rounded-2xl border ${isDark ? 'bg-black border-zinc-800' : 'bg-zinc-50 border-zinc-200'} flex flex-col gap-2 text-left active:scale-[0.98] transition-all`}
              >
                 <span className="text-xl">🗺️</span>
                 <p className="text-[9px] font-black uppercase tracking-widest leading-none">Roadmap</p>
                 <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">O que virá</p>
              </button>
              <button 
                onClick={onOpenMonetizationInfo}
                className={`p-4 rounded-2xl border ${isDark ? 'bg-black border-zinc-800' : 'bg-zinc-50 border-zinc-200'} flex flex-col gap-2 text-left active:scale-[0.98] transition-all`}
              >
                 <span className="text-xl">💰</span>
                 <p className="text-[9px] font-black uppercase tracking-widest leading-none">Economia</p>
                 <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Como lucramos</p>
              </button>
           </div>
        </div>

        {/* Ads & Manifesto Section */}
        <div className={`${cardClasses} rounded-2xl p-5 border space-y-4`}>
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Ética e Ads</h3>
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onOpenAdControls}
                className={`p-4 rounded-2xl border ${isDark ? 'bg-black border-zinc-800' : 'bg-zinc-50 border-zinc-200'} flex flex-col gap-2 text-left active:scale-[0.98] transition-all`}
              >
                 <span className="text-xl">🎯</span>
                 <p className="text-[9px] font-black uppercase tracking-widest leading-none">Filtro Ads</p>
                 <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Escolha ver</p>
              </button>
              <button 
                onClick={onOpenManifesto}
                className={`p-4 rounded-2xl border ${isDark ? 'bg-black border-zinc-800' : 'bg-zinc-50 border-zinc-200'} flex flex-col gap-2 text-left active:scale-[0.98] transition-all`}
              >
                 <span className="text-xl">📜</span>
                 <p className="text-[9px] font-black uppercase tracking-widest leading-none">Manifesto</p>
                 <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Nossos valores</p>
              </button>
           </div>
        </div>

        {/* Accessibility & Modes Toggle Section */}
        <div className={`${cardClasses} rounded-2xl p-5 border space-y-5 transition-colors relative`}>
           <div className="flex justify-between items-center">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Acessibilidade & Performance</h3>
             <button 
                onClick={() => setShowLiteHelp(!showLiteHelp)}
                className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] font-black text-zinc-500 hover:bg-zinc-800"
             >
               ?
             </button>
           </div>
           
           <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest">Modo Light (Otimizado)</h4>
                <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Reduz consumo visual.</p>
              </div>
              <button 
                onClick={onToggleLite}
                className={`w-12 h-6 rounded-full relative transition-all ${isLite ? 'bg-blue-600' : (isDark ? 'bg-zinc-700' : 'bg-zinc-200')}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${isLite ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>

           <div className="flex items-center justify-between border-t pt-4 border-zinc-100/10">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest">Modo Escuro (Dark)</h4>
                <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Foco no conteúdo.</p>
              </div>
              <button 
                onClick={onToggleDark}
                className={`w-12 h-6 rounded-full relative transition-all ${isDark ? 'bg-blue-600' : 'bg-zinc-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${isDark ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => setShowEditBio(true)}
            className={`flex-1 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} border py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors active:scale-95`}
          >
            Editar Biografia
          </button>
          <button 
            onClick={onOpenCreatorPlus}
            className={`flex-1 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} border py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors active:scale-95 text-blue-500`}
          >
            {user.isPremium ? 'Gestão Criador+' : 'Assinar Criador+'}
          </button>
        </div>
      </div>

      <div className={`flex border-t ${borderClasses} mt-4`}>
        <button onClick={() => setTab('posts')} className={`flex-1 flex justify-center py-4 ${tab === 'posts' ? `border-t-2 ${isDark ? 'border-white text-white' : 'border-blue-600 text-blue-600'}` : 'text-zinc-400'}`}>
          <Icons.Home className="w-6 h-6" />
        </button>
        <button onClick={() => setTab('saved')} className={`flex-1 flex justify-center py-4 ${tab === 'saved' ? `border-t-2 ${isDark ? 'border-white text-white' : 'border-blue-600 text-blue-600'}` : 'text-zinc-400'}`}>
          <Icons.Bookmark className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`aspect-square ${isDark ? 'bg-zinc-900' : 'bg-zinc-200'} overflow-hidden relative group`}>
            <img 
              src={`https://picsum.photos/seed/p-${i}/400/400`} 
              className={`w-full h-full object-cover ${isDark ? 'opacity-80' : 'opacity-100'} group-hover:opacity-100 transition-opacity`} 
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="p-10 text-center space-y-4">
        <div className="flex justify-center gap-6">
          <button onClick={onOpenTerms} className={`text-[10px] font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-400'} uppercase tracking-widest hover:text-blue-500`}>Termos</button>
          <button onClick={onOpenPrivacy} className={`text-[10px] font-bold ${isDark ? 'text-zinc-600' : 'text-zinc-400'} uppercase tracking-widest hover:text-blue-500`}>Privacidade</button>
        </div>
        <p className={`text-[9px] ${isDark ? 'text-zinc-800' : 'text-zinc-300'} uppercase tracking-[0.3em]`}>Carlin Mídia Oficial • v4.1 {isLite ? 'Lite' : 'Nativo'}</p>
      </div>
      <div className="h-24"></div>

      {showEditPhoto && (
        <EditProfilePhoto 
          currentAvatar={user.avatar || 'assets/profile.png'} 
          onUpdate={handleAvatarUpdate} 
          onCancel={() => setShowEditPhoto(false)} 
        />
      )}

      {showEditBio && (
        <EditBio 
          currentBio={user.bio || ""}
          onUpdate={handleBioUpdate}
          onCancel={() => setShowEditBio(false)}
        />
      )}
    </div>
  );
};

export default Profile;
