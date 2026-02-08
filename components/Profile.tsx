import React, { useState } from 'react';
import { User, ProfileLink, VerificationLevel } from '../types';
import { Icons, BrandLogo } from '../constants';
import EditProfilePhoto from './EditProfilePhoto';
import EditBio from './EditBio';
import EditLinks from './EditLinks';
import { dbService } from '../services/dbService';
import { liteModeManager } from '../services/liteModeService';
import { impactService } from '../services/impactService';

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
  onOpenMonetizationStatus?: () => void;
  onOpenNotificationSettings: () => void;
  onOpenDeveloperInfo: () => void;
  onOpenDeveloperManifesto: () => void;
  onOpenAdvancedSettings: () => void;
  onOpenImpactSocial?: () => void; 
  onOpenSupport?: () => void;
  onOpenMembershipManager?: () => void;
  onOpenAdmin?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
  user, isLite, isDark, onOpenDashboard, onOpenVerification, onUpdateUser, onOpenCreatorPlus, onOpenAdvancedSettings, onOpenImpactSocial, onOpenSupport, onOpenMonetizationStatus, onOpenMembershipManager, onOpenAdmin
}) => {
  const [tab, setTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);
  const [showEditLinks, setShowEditLinks] = useState(false);

  const features = impactService.getUnlockedFeatures(user);

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
    const updatedUser = dbService.verificarIdentidadeLocal();
    if (updatedUser) onUpdateUser(updatedUser);
  };

  const activeLinks = (user.links || []).filter(l => l.status === 'active');

  const getTierBadge = (level: VerificationLevel = VerificationLevel.BRONZE) => {
    switch (level) {
      case VerificationLevel.OURO: 
        return <span className="bg-yellow-500 text-black text-[7px] font-black px-2 py-0.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)] border border-yellow-400">🥇 OURO</span>;
      case VerificationLevel.PRATA: 
        return <span className="bg-zinc-400 text-black text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg border border-zinc-300">🥈 PRATA</span>;
      case VerificationLevel.BRONZE: 
        return <span className="bg-orange-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg">🥉 BRONZE</span>;
      default: return null;
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto pt-14 lg:pt-8 ${containerClasses} min-h-screen transition-colors pb-32`}>
      <div className="flex items-center justify-between px-5 py-6">
        <BrandLogo size="sm" lightText={isDark} />
        <div className="flex gap-2">
           <button onClick={() => onOpenAdmin?.()} className="p-3 bg-red-600/10 rounded-2xl border border-red-500/20 hover:scale-110 transition-all shadow-lg active:scale-95">
             <span className="text-xs">⚙️</span>
           </button>
           <button onClick={onOpenAdvancedSettings} className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 hover:scale-110 transition-all shadow-lg active:scale-95">
             <Icons.Settings className="w-5 h-5 text-white" />
           </button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-8">
        {/* Profile Header Center Focused */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group cursor-pointer" onClick={() => setShowEditPhoto(true)}>
            <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full p-[3px] transition-all ${user.verificationLevel === VerificationLevel.OURO ? 'bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'bg-zinc-800'}`}>
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-zinc-900' : 'bg-white'} overflow-hidden border-2 ${isDark ? 'border-black' : 'border-white'} relative flex items-center justify-center`}>
                <span className="text-4xl md:text-5xl font-black text-zinc-600 italic select-none">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
                </span>
              </div>
            </div>
            {user.isFaciallyVerified && (
              <div className={`absolute bottom-1 right-1 p-2 rounded-full border-4 border-black shadow-lg ${user.verificationLevel === VerificationLevel.OURO ? 'bg-yellow-500' : 'bg-blue-600'}`}>
                 <Icons.Verified className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-black text-2xl tracking-tighter">{user.displayName}</h2>
                {getTierBadge(user.verificationLevel)}
              </div>
              <p className="text-xs text-orange-500 font-bold uppercase tracking-widest flex items-center gap-2 leading-none">
                @{user.username}
                {isLite && <span className="bg-orange-500/20 text-orange-500 text-[8px] px-1.5 py-0.5 rounded font-black">LITE</span>}
              </p>
            </div>

            {features.hasGrowthBadge && (
              <div className="mt-2">
                <span className="bg-blue-600/10 text-blue-400 text-[8px] font-black px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">📈 Criador em Crescimento</span>
              </div>
            )}

            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'} leading-relaxed mt-4 max-w-sm mx-auto whitespace-pre-wrap cursor-pointer hover:text-white transition-colors`} onClick={() => setShowEditBio(true)}>
              {user.bio || "Toque aqui para adicionar sua biografia."}
            </p>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={features.canSeeBasicAnalytics ? onOpenDashboard : () => alert('Desbloqueie com 50 seguidores.')} 
            className={`bg-zinc-900 border border-zinc-800 text-white py-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.98] transition-all ${!features.canSeeBasicAnalytics ? 'opacity-40 grayscale' : ''}`}
          >
            <span className="text-xl">📊</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Analytics Real {!features.canSeeBasicAnalytics && '🔒'}</span>
          </button>
          
          <button onClick={onOpenMonetizationStatus} className="bg-indigo-600/10 border border-indigo-500/30 text-indigo-500 py-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.98] transition-all">
            <span className="text-xl">🚀</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Jornada Criador</span>
          </button>

          {features.canEnrolMembership && (
            <button onClick={onOpenMembershipManager} className="bg-purple-600/10 border border-purple-500/30 text-purple-500 py-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.98] transition-all col-span-2">
              <span className="text-xl">⭐</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-purple-400">Gerenciar Seja Membro</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
           <button onClick={onOpenImpactSocial} className="w-full bg-orange-600/10 border border-orange-500/30 text-orange-500 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all">
             <span className="text-xl">🌍</span>
             <span className="text-[8px] font-black uppercase tracking-widest text-orange-400">Impacto Social & Transparência</span>
           </button>
        </div>

        <button 
          onClick={onOpenSupport}
          className="w-full bg-gradient-to-r from-blue-600/10 to-orange-500/10 border border-white/5 py-5 rounded-[2rem] flex items-center justify-center gap-4 active:scale-[0.98] transition-all shadow-inner"
        >
          <span className="text-2xl">👨‍💻</span>
          <div className="text-left">
            <h4 className="text-[10px] font-black uppercase text-white tracking-widest leading-none">Apoie o Desenvolvedor</h4>
            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Garantindo a soberania do Carlin</p>
          </div>
        </button>

        {!user.isFaciallyVerified && (
           <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-xl shadow-blue-600/20 animate-pulse cursor-pointer" onClick={onOpenVerification}>
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-white tracking-tighter italic">Eleve seu Perfil</h4>
                    <p className="text-[10px] text-blue-100/80 font-medium">Ative a biometria para nível PRATA ou OURO.</p>
                 </div>
                 <span className="text-2xl">🛡️</span>
              </div>
           </div>
        )}

        {/* Links Section */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Vínculos de Impacto</h3>
             <button onClick={() => setShowEditLinks(true)} className="text-[8px] font-black text-orange-500 uppercase tracking-widest hover:underline">Gerenciar</button>
          </div>
          <div className="space-y-3">
            {activeLinks.length > 0 ? activeLinks.map((link) => (
              <LinkCard key={link.id} link={link} isDark={isDark} cardClasses={cardClasses} onClick={() => handleLinkClick(link)} isSubscriber={!!user.isPremium} />
            )) : <p className="text-[10px] text-zinc-700 uppercase font-black px-1 text-center py-6">Nenhum vínculo ativo no momento.</p>}
          </div>
        </div>
      </div>

      <div className={`flex border-t ${borderClasses} mt-10`}>
        <button onClick={() => setTab('posts')} className={`flex-1 flex justify-center py-5 ${tab === 'posts' ? `border-t-2 ${isDark ? 'border-white text-white' : 'border-orange-500 text-orange-500'}` : 'text-zinc-700'}`}><Icons.Home className="w-6 h-6" /></button>
        <button onClick={() => setTab('saved')} className={`flex-1 flex justify-center py-5 ${tab === 'saved' ? `border-t-2 ${isDark ? 'border-white text-white' : 'border-orange-500 text-orange-500'}` : 'text-zinc-700'}`}><Icons.Bookmark className="w-6 h-6" /></button>
      </div>

      <div className="py-24 text-center space-y-4 opacity-20">
        <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center">
           <Icons.Home className="w-8 h-8 text-zinc-700" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Nenhuma publicação arquivada</p>
      </div>

      {showEditPhoto && <EditProfilePhoto currentAvatar={user.avatar || 'assets/profile.png'} onUpdate={handleAvatarUpdate} onCancel={() => setShowEditPhoto(false)} />}
      {showEditBio && <EditBio currentBio={user.bio || ""} onUpdate={handleBioUpdate} onCancel={() => setShowEditBio(false)} />}
      {showEditLinks && <EditLinks currentLinks={user.links || []} onUpdate={handleLinksUpdate} onCancel={() => setShowEditLinks(false)} />}
    </div>
  );
};

const LinkCard: React.FC<{ link: ProfileLink; isDark: boolean; cardClasses: string; onClick: () => void | Promise<void>; isSmall?: boolean; isSubscriber: boolean; }> = ({ link, cardClasses, onClick, isSmall = false, isSubscriber }) => {
  const isPinned = link.type === 'pinned';
  const isMonetized = link.type === 'monetized';
  const isExclusive = link.type === 'exclusive';
  const isLocked = isExclusive && !isSubscriber;

  const typeStyles = isPinned ? "border-blue-500/50 bg-blue-500/5" : isMonetized ? "border-green-500/50 bg-green-500/5" : isExclusive ? (isLocked ? "border-zinc-800 bg-zinc-900/50" : "border-purple-500/50 bg-purple-500/5") : "";

  if (isLocked) {
    return (
      <button onClick={onClick as any} className={`w-full block ${cardClasses} rounded-[2rem] p-6 border-2 ${typeStyles} opacity-90`}>
        <div className="flex flex-col items-center text-center space-y-2">
          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Conteúdo Exclusivo 🧪</p>
          <p className="text-xs font-black text-white uppercase italic tracking-tighter">Assine o Carlin Lab para acessar</p>
        </div>
      </button>
    );
  }

  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" onClick={onClick as any} className={`block ${cardClasses} rounded-[2rem] transition-all hover:scale-[1.01] border-2 ${typeStyles} ${isSmall ? 'p-4' : 'p-6'}`}>
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <strong className={`block font-black uppercase tracking-tight truncate ${isSmall ? 'text-[11px]' : 'text-sm'} ${isExclusive ? 'text-purple-400' : isMonetized ? 'text-green-400' : isPinned ? 'text-blue-400' : 'text-white'}`}>
              {link.title}
            </strong>
          </div>
          {!isSmall && <span className="text-[10px] text-zinc-500 truncate block font-medium opacity-60">{link.url.replace('https://', '')}</span>}
        </div>
        <div className="ml-4 shrink-0 text-zinc-700">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
        </div>
      </div>
    </a>
  );
};

export default Profile;