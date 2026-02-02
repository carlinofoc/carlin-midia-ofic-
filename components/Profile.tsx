
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

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
}

const Profile: React.FC<ProfileProps> = ({ user, onOpenTerms, onOpenPrivacy, isLite, onToggleLite, isDark, onToggleDark, onOpenDashboard, onOpenVerification }) => {
  const [tab, setTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [showLiteHelp, setShowLiteHelp] = useState(false);

  const containerClasses = isDark ? "bg-black text-white" : "bg-zinc-50 text-zinc-900";
  const cardClasses = isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";
  const borderClasses = isDark ? "border-zinc-900" : "border-zinc-200";

  return (
    <div className={`w-full max-w-2xl mx-auto pt-14 lg:pt-8 ${containerClasses} min-h-screen transition-colors`}>
      {/* Header Info */}
      <div className="px-5 py-6 space-y-6">
        <div className="flex items-center justify-between gap-6">
          <div className="relative">
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full p-[3px] ${isLite ? 'bg-zinc-800' : 'bg-gradient-to-tr from-blue-600 to-blue-400'}`}>
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-black' : 'bg-white'} overflow-hidden border-2 ${isDark ? 'border-black' : 'border-white'}`}>
                <img 
                  src={user.avatar || 'assets/profile.png'} 
                  className="w-full h-full object-cover"
                  alt={`Avatar de ${user.displayName}`}
                />
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
          </div>
          <p className="text-xs text-blue-500 font-bold uppercase tracking-widest flex items-center gap-2">
            @{user.username}
            {isLite && <span className="bg-blue-500/20 text-blue-500 text-[8px] px-1.5 py-0.5 rounded font-black">LITE ATIVO</span>}
          </p>
          <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-600'} leading-relaxed mt-2`}>{user.bio}</p>
          
          {user.isFaciallyVerified && (
            <div className="flex items-center gap-2 bg-blue-600/5 border border-blue-600/10 px-3 py-2 rounded-xl mt-3">
               <span className="text-blue-500 text-sm">🛡️</span>
               <p className="text-[10px] text-zinc-400 font-medium leading-tight">
                 Perfil verificado por reconhecimento facial e atividade real como criador.
               </p>
            </div>
          )}
        </div>

        {/* Main Actions */}
        <div className="space-y-3">
          <button 
            onClick={onOpenDashboard}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            <span className="text-xl">📊</span>
            <span className="text-xs font-black uppercase tracking-widest">Ver Meu Impacto Real</span>
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
           
           {showLiteHelp && (
             <div className="bg-blue-600 p-4 rounded-xl animate-in slide-in-from-top-2 duration-300">
                <h4 className="text-xs font-black text-white uppercase mb-1">Como ativar o modo otimizado?</h4>
                <p className="text-[10px] text-white/80 leading-tight">O Modo Light remove animações pesadas e efeitos de desfoque, ideal para celulares Android com 2GB-4GB RAM.</p>
             </div>
           )}
           
           <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest">Modo Light (Otimizado)</h4>
                <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Reduz consumo de bateria e melhora a fluidez.</p>
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
                <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Melhora o contraste e reduz fadiga visual.</p>
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
          <button className={`flex-1 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} border py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors`}>Editar Perfil</button>
          <button className={`flex-1 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'} border py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors`}>Configurações</button>
        </div>
      </div>

      {/* Grid Tabs */}
      <div className={`flex border-t ${borderClasses} mt-4`}>
        <button onClick={() => setTab('posts')} className={`flex-1 flex justify-center py-4 ${tab === 'posts' ? `border-t-2 ${isDark ? 'border-white text-white' : 'border-blue-600 text-blue-600'}` : 'text-zinc-400'}`}>
          <Icons.Home className="w-6 h-6" />
        </button>
        <button onClick={() => setTab('saved')} className={`flex-1 flex justify-center py-4 ${tab === 'saved' ? `border-t-2 ${isDark ? 'border-white text-white' : 'border-blue-600 text-blue-600'}` : 'text-zinc-400'}`}>
          <Icons.Bookmark className="w-6 h-6" />
        </button>
      </div>

      {/* Photos Grid */}
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
    </div>
  );
};

export default Profile;
