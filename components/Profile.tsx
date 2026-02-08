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
  const isDeveloper = user.profileType === 'developer';

  const containerClasses = isDark ? "bg-black text-white" : "bg-zinc-50 text-zinc-900";
  const cardClasses = isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";

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
        return <span className="bg-amber-400 text-zinc-950 text-[7px] font-black px-2 py-0.5 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3)] border border-amber-300 uppercase tracking-tighter">🥇 Ouro</span>;
      case VerificationLevel.PRATA: 
        return <span className="bg-zinc-300 text-zinc-950 text-[7px] font-black px-2 py-0.5 rounded-full border border-zinc-100 uppercase tracking-tighter">🥈 Prata</span>;
      case VerificationLevel.BRONZE: 
        return <span className="bg-orange-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">🥉 Bronze</span>;
      default: return null;
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto pt-14 lg:pt-8 ${containerClasses} min-h-screen transition-colors pb-32`}>
      <div className="flex items-center justify-between px-6 py-6">
        <BrandLogo size="sm" lightText={isDark} />
        <div className="flex gap-2">
           <button onClick={onOpenAdvancedSettings} className="p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-95">
             <Icons.Settings className="w-5 h-5 text-white" />
           </button>
           {isDeveloper && (
              <button onClick={onOpenAdmin} className="p-3 bg-red-600/10 rounded-2xl border border-red-500/20 hover:bg-red-600/20 transition-all active:scale-95">
                <span className="text-xs">ROOT</span>
              </button>
           )}
        </div>
      </div>

      <div className="px-6 py-4 space-y-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-5">
          <div className="relative group cursor-pointer" onClick={() => setShowEditPhoto(true)}>
            <div className={`w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] p-[3px] transition-all transform group-hover:scale-105 ${user.isFaciallyVerified ? 'bg-gradient-to-tr from-blue-500 to-indigo-700 shadow-2xl' : 'bg-zinc-800'}`}>
              <div className={`w-full h-full rounded-[2.3rem] ${isDark ? 'bg-zinc-900' : 'bg-white'} overflow-hidden border-2 border-black flex items-center justify-center relative`}>
                {user.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" alt={user.displayName} />
                ) : (
                  <span className="text-4xl font-black text-zinc-700 italic">{user.displayName?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>
            {user.isFaciallyVerified && (
              <div className="absolute -bottom-1 -right-1 p-2 bg-blue-600 rounded-2xl border-4 border-black shadow-xl">
                 <Icons.Verified className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-black text-2xl tracking-tighter text-white">{user.displayName}</h2>
              {getTierBadge(user.verificationLevel)}
            </div>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">@{user.username}</p>
            
            {isDeveloper && (
              <div className="mt-4">
                 <span className="bg-blue-600/10 text-blue-400 text-[8px] font-black px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-[0.2em] shadow-lg shadow-blue-950/20">
                   Soberania do Desenvolvedor
                 </span>
              </div>
            )}

            <div className="flex items-center justify-center gap-10 mt-8 py-3 border-y border-zinc-900/50">
               <ProfileStat label="Posts" value={isDeveloper ? 0 : user.postsCount} />
               <ProfileStat label="Seguidores" value={isDeveloper ? 0 : user.followersCount} />
               <ProfileStat label="Seguindo" value={isDeveloper ? 0 : user.followingCount} />
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mt-6 max-w-sm mx-auto whitespace-pre-wrap px-4 italic cursor-pointer hover:text-white transition-colors" onClick={() => setShowEditBio(true)}>
              {user.bio || "Defina sua biografia e conecte-se ao mundo."}
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          <ActionButton onClick={onOpenDashboard} label="Relatório Real" icon="📊" active={features.canSeeBasicAnalytics} />
          <ActionButton onClick={onOpenMonetizationStatus} label="Metas & Ganhos" icon="💰" active />
          
          <button onClick={onOpenImpactSocial} className="col-span-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg">
             <span className="text-lg">🌍</span>
             <span className="text-[9px] font-black uppercase tracking-[0.2em]">Impacto Social & Doações</span>
          </button>
        </div>

        {/* Links Section */}
        <div className="space-y-4 pt-4">
           <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Pontes de Valor</h3>
              <button onClick={() => setShowEditLinks(true)} className="text-[8px] font-black text-blue-500 uppercase tracking-widest hover:underline">Gerenciar</button>
           </div>
           <div className="grid gap-3">
              {activeLinks.length > 0 ? activeLinks.map(link => (
                // Fixed: Added key prop and updated LinkCardItem to support async onClick through React.FC typing
                <LinkCardItem key={link.id} link={link} onClick={() => handleLinkClick(link)} isPremium={!!user.isPremium} />
              )) : (
                <div className="p-8 border-2 border-dashed border-zinc-900 rounded-[2rem] text-center opacity-30">
                   <p className="text-[9px] font-black uppercase tracking-widest">Nenhuma ponte ativa</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-zinc-900 mt-12">
        <TabIcon active={tab === 'posts'} onClick={() => setTab('posts')} icon={<Icons.Home className="w-5 h-5" />} />
        <TabIcon active={tab === 'saved'} onClick={() => setTab('saved')} icon={<Icons.Bookmark className="w-5 h-5" />} />
      </div>

      <div className="py-24 text-center space-y-4 opacity-10 grayscale">
         <div className="w-16 h-16 rounded-3xl bg-zinc-800 mx-auto flex items-center justify-center shadow-inner">
            <Icons.Home className="w-8 h-8 text-zinc-400" />
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">Acervo Vazio</p>
      </div>

      {showEditPhoto && <EditProfilePhoto currentAvatar={user.avatar} onUpdate={handleAvatarUpdate} onCancel={() => setShowEditPhoto(false)} />}
      {showEditBio && <EditBio currentBio={user.bio || ""} onUpdate={handleBioUpdate} onCancel={() => setShowEditBio(false)} />}
      {showEditLinks && <EditLinks currentLinks={user.links || []} onUpdate={handleLinksUpdate} onCancel={() => setShowEditLinks(false)} />}
    </div>
  );
};

// Fixed: Explicitly typed sub-components as React.FC to allow proper 'key' prop handling in JSX
const ProfileStat: React.FC<{ label: string, value: number }> = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-lg font-black text-white italic tracking-tighter leading-none">{value}</span>
    <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-1.5">{label}</span>
  </div>
);

// Fixed: Explicitly typed sub-components as React.FC to allow proper 'key' prop handling in JSX
const ActionButton: React.FC<{ onClick: () => void, label: string, icon: string, active: boolean }> = ({ onClick, label, icon, active }) => (
  <button 
    onClick={active ? onClick : undefined}
    className={`bg-zinc-900 border border-zinc-800 py-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xl ${!active ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:border-zinc-700'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
  </button>
);

// Fixed: Explicitly typed LinkCardItem as React.FC to allow 'key' prop and updated onClick type to allow Promise
const LinkCardItem: React.FC<{ link: ProfileLink, onClick: () => void | Promise<void>, isPremium: boolean }> = ({ link, onClick, isPremium }) => {
  const isExclusive = link.type === 'exclusive';
  const locked = isExclusive && !isPremium;
  
  return (
    <button 
      onClick={onClick}
      className={`w-full p-5 rounded-[2rem] border-2 flex items-center justify-between transition-all active:scale-[0.98] ${
        locked ? 'bg-zinc-950 border-zinc-800' : 
        link.type === 'pinned' ? 'bg-blue-600/5 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' :
        link.type === 'monetized' ? 'bg-emerald-600/5 border-emerald-500/20' :
        link.type === 'exclusive' ? 'bg-indigo-600/5 border-indigo-500/20 shadow-[0_0_20px_rgba(129,140,248,0.1)]' :
        'bg-zinc-900 border-zinc-800'
      }`}
    >
      <div className="flex-1 text-left min-w-0 pr-4">
         <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-black uppercase tracking-tight truncate ${locked ? 'text-zinc-600' : 'text-white'}`}>
               {locked ? 'Conteúdo Trancado' : link.title}
            </span>
            {link.type === 'pinned' && <span className="text-[7px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter">Fixado</span>}
         </div>
         <p className="text-[9px] text-zinc-500 font-bold truncate tracking-widest">
           {locked ? 'Assine o Carlin Lab para liberar' : link.url.replace('https://', '')}
         </p>
      </div>
      <div className="shrink-0 text-zinc-700">
         {locked ? '🧪' : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>}
      </div>
    </button>
  );
};

// Fixed: Explicitly typed sub-components as React.FC to allow proper 'key' prop handling in JSX
const TabIcon: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button onClick={onClick} className={`flex-1 py-5 flex justify-center transition-all ${active ? 'text-white border-t-2 border-white' : 'text-zinc-700'}`}>
    {icon}
  </button>
);

export default Profile;