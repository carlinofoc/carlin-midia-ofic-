
import React, { useState } from 'react';
import { User, ProfileLink } from '../types';
import { Icons } from '../constants';
import EditProfilePhoto from './EditProfilePhoto';
import EditBio from './EditBio';
import EditLinks from './EditLinks';
import { dbService } from '../services/dbService';
import { liteModeManager } from '../services/liteModeService';

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
  onOpenNotificationSettings: () => void;
  onOpenDeveloperInfo: () => void;
  onOpenDeveloperManifesto: () => void;
  onOpenAdvancedSettings: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  user, onOpenTerms, onOpenPrivacy, isLite, onToggleLite, isDark, onToggleDark, 
  onOpenDashboard, onOpenVerification, onUpdateUser, onOpenAdControls, onOpenManifesto, onOpenBetaCenter, onOpenCreatorPlus, onOpenRoadmap, onOpenMonetizationInfo, onOpenNotificationSettings, onOpenDeveloperInfo, onOpenDeveloperManifesto, onOpenAdvancedSettings
}) => {
  const [tab, setTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);
  const [showEditLinks, setShowEditLinks] = useState(false);

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

  const handleLinksUpdate = (newLinks: ProfileLink[]) => {
    onUpdateUser({ ...user, links: newLinks });
    setShowEditLinks(false);
  };

  const handleLinkClick = async (link: ProfileLink) => {
    if (link.type === 'exclusive' && !user.isPremium) {
      onOpenCreatorPlus();
      return;
    }

    if (!link.id || !user.id) return;
    await dbService.trackLinkClick(user.id, link.id);
    
    // Refresh user state
    const updatedUser = dbService.verificarIdentidadeLocal();
    if (updatedUser) {
      onUpdateUser(updatedUser);
    }
  };

  const activeLinks = (user.links || []).filter(l => l.status === 'active');
  const pinnedLink = activeLinks.find(l => l.type === 'pinned');
  const otherLinks = activeLinks.filter(l => l.type !== 'pinned');

  return (
    <div className={`w-full max-w-2xl mx-auto pt-14 lg:pt-8 ${containerClasses} min-h-screen transition-colors pb-32`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-lg font-black uppercase tracking-widest text-blue-500">Perfil Oficial</h1>
        <button 
          onClick={onOpenAdvancedSettings}
          className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 hover:scale-110 active:rotate-90 transition-all shadow-lg"
        >
          <Icons.Settings className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Header Info */}
      <div className="px-5 py-6 space-y-6">
        <div className="flex items-center justify-between gap-6">
          <div className="relative group cursor-pointer" onClick={() => setShowEditPhoto(true)}>
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full p-[3px] ${isLite ? 'bg-zinc-800' : 'bg-gradient-to-tr from-blue-600 to-blue-400'}`}>
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-black' : 'bg-white'} overflow-hidden border-2 ${isDark ? 'border-black' : 'border-white'} relative`}>
                <img 
                  src={liteModeManager.getOptimizedImageUrl(user.avatar || 'assets/profile.png')} 
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
              <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} uppercase tracking-widest font-bold`}>Posts</p>
            </div>
            <div>
              <p className="font-black text-lg">{user.followers.toLocaleString()}</p>
              <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} uppercase tracking-widest font-bold`}>Seguidores</p>
            </div>
            <div>
              <p className="font-black text-lg">{user.following.toLocaleString()}</p>
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

          {/* Pinned Link Spot */}
          {pinnedLink && (
            <div className="py-2">
              <LinkCard 
                link={pinnedLink} 
                isDark={isDark} 
                cardClasses={cardClasses} 
                onClick={() => handleLinkClick(pinnedLink)}
                isSmall={true}
                isSubscriber={!!user.isPremium}
              />
            </div>
          )}

          <div className="relative group">
            <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-600'} leading-relaxed mt-1 whitespace-pre-wrap`}>
              {user.bio || "Sem biografia ainda."}
            </p>
          </div>
        </div>

        {/* Links do Perfil Section */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Vínculos & Portfólio</h3>
            <button 
              onClick={() => setShowEditLinks(true)}
              className="text-[9px] font-black uppercase text-zinc-500 hover:text-blue-500 transition-colors"
            >
              Gerenciar Links
            </button>
          </div>
          <div className="space-y-3">
            {otherLinks.length > 0 ? (
              otherLinks.map((link) => (
                <LinkCard 
                  key={link.id} 
                  link={link} 
                  isDark={isDark} 
                  cardClasses={cardClasses} 
                  onClick={() => handleLinkClick(link)} 
                  isSubscriber={!!user.isPremium}
                />
              ))
            ) : !pinnedLink && (
              <div className="space-y-2 opacity-80">
                <StaticLink label="Instagram oficial do criador" url="https://instagram.com/usuario" isDark={isDark} />
                <StaticLink label="Canal do YouTube oficial" url="https://youtube.com/usuario" isDark={isDark} />
              </div>
            )}
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
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => setShowEditBio(true)}
            className={`flex-1 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} border py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors active:scale-95`}
          >
            Editar Biografia
          </button>
          <button 
            onClick={onOpenCreatorPlus}
            className={`flex-1 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} border py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors active:scale-95 text-blue-500`}
          >
            {user.isPremium ? 'Gestão Premium' : 'Assinar Premium'}
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
              src={liteModeManager.getOptimizedImageUrl(`https://picsum.photos/seed/p-${i}/400/400`)} 
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
        <p className={`text-[9px] ${isDark ? 'text-zinc-800' : 'text-zinc-300'} uppercase tracking-[0.3em]`}>Carlin Mídia Oficial • v5.3 Native</p>
      </div>
      <div className="h-24"></div>

      {showEditPhoto && <EditProfilePhoto currentAvatar={user.avatar || 'assets/profile.png'} onUpdate={handleAvatarUpdate} onCancel={() => setShowEditPhoto(false)} />}
      {showEditBio && <EditBio currentBio={user.bio || ""} onUpdate={handleBioUpdate} onCancel={() => setShowEditBio(false)} />}
      {showEditLinks && <EditLinks currentLinks={user.links || []} onUpdate={handleLinksUpdate} onCancel={() => setShowEditLinks(false)} />}
    </div>
  );
};

const LinkCard: React.FC<{ 
  link: ProfileLink; 
  isDark: boolean; 
  cardClasses: string; 
  onClick: () => void | Promise<void>;
  isSmall?: boolean;
  isSubscriber: boolean;
}> = ({ link, isDark, cardClasses, onClick, isSmall = false, isSubscriber }) => {
  const isPinned = link.type === 'pinned';
  const isMonetized = link.type === 'monetized';
  const isExclusive = link.type === 'exclusive';
  const isLocked = isExclusive && !isSubscriber;

  const typeStyles = 
    isPinned ? "border-blue-500/50 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]" :
    isMonetized ? "border-green-500/50 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]" :
    isExclusive ? (isLocked ? "border-zinc-800 bg-zinc-900/50 opacity-90" : "border-purple-500/50 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]") :
    "";

  if (isLocked) {
    return (
      <button 
        onClick={onClick as any}
        className={`w-full block ${cardClasses} rounded-[1.5rem] p-5 transition-all hover:border-zinc-700 active:scale-[0.98] group relative overflow-hidden border-2 ${typeStyles}`}
      >
        <div className="absolute top-0 right-0 p-2"><span className="text-[10px]">🔒</span></div>
        <div className="flex flex-col items-center text-center space-y-2">
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Conteúdo Exclusivo Carlin Lab</p>
          <p className="text-xs font-black text-white uppercase italic tracking-tighter">Assine o Carlin Lab para acessar</p>
        </div>
      </button>
    );
  }

  return (
    <a 
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick as any}
      className={`block ${cardClasses} rounded-[1.5rem] transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden border-2 ${typeStyles} ${isSmall ? 'p-3' : 'p-5'}`}
    >
      <div className="absolute top-0 right-0 p-2">
        <span className="text-[10px]">
          {isPinned && '📌'}
          {isMonetized && '💰'}
          {isExclusive && '🧪'}
        </span>
      </div>

      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <strong className={`block font-black uppercase tracking-tight group-hover:text-blue-500 transition-colors truncate ${isSmall ? 'text-[11px]' : 'text-sm'} ${isExclusive ? 'text-purple-400' : isMonetized ? 'text-green-400' : 'text-white'}`}>
              {link.title}
            </strong>
          </div>
          {!isSmall && (
            <div className="space-y-1">
               <span className="text-[11px] text-zinc-500 truncate block font-medium group-hover:text-zinc-400">
                 {link.url}
               </span>
               {isMonetized && (
                 <span className="text-[8px] font-black uppercase text-green-500 tracking-widest flex items-center gap-1">
                   <span className="w-1 h-1 rounded-full bg-green-500"></span> Link Monetizado
                 </span>
               )}
               {isExclusive && (
                 <span className="text-[8px] font-black uppercase text-purple-500 tracking-widest flex items-center gap-1">
                   <span className="w-1 h-1 rounded-full bg-purple-500"></span> Carlin Lab Labs
                 </span>
               )}
            </div>
          )}
        </div>
        {link.clicks !== undefined && !isSmall && (
          <div className="bg-zinc-900/50 border border-zinc-800 px-2 py-1 rounded-lg ml-2 shrink-0">
             <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">
               {link.clicks.toLocaleString()} {link.clicks === 1 ? 'click' : 'clicks'}
             </span>
          </div>
        )}
      </div>
    </a>
  );
};

const StaticLink = ({ label, url, isDark }: { label: string, url: string, isDark: boolean }) => (
  <div className={`${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} border rounded-2xl p-4 transition-all group cursor-default`}>
    <strong className="block text-xs font-black uppercase text-white mb-1 tracking-tight group-hover:text-blue-500 transition-colors">
      {label}
    </strong>
    <span className="text-[11px] text-blue-500 truncate block font-bold group-hover:text-blue-400">
      {url}
    </span>
  </div>
);

export default Profile;
