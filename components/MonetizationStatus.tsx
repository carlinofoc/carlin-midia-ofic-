import React, { useState, useMemo } from 'react';
import { User, MonetizationLevel, CreatorBenefits } from '../types';
import { impactService } from '../services/impactService';

interface MonetizationStatusProps {
  user: User;
  onBack: () => void;
}

const MonetizationStatus: React.FC<MonetizationStatusProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'benefits' | 'payout'>('roadmap');
  const [hypoRevenue, setHypoRevenue] = useState(10000);
  
  const isEligible = useMemo(() => impactService.isCreatorEligible(user), [user]);
  const level = useMemo(() => impactService.getMonetizationLevel(user), [user]);
  const benefits = useMemo(() => impactService.getCreatorBenefits(level), [level]);

  const projectedRevenue = useMemo(() => 
    impactService.calculateCreatorRevenue(hypoRevenue, benefits.revenue_share_percentage || 0),
    [hypoRevenue, benefits.revenue_share_percentage]
  );

  const getLevelDisplay = (lvl: MonetizationLevel) => {
    switch(lvl) {
      case 'FULL_MONETIZATION': return { label: "FULL MONETIZATION", color: "text-green-400", bg: "bg-green-500/20", icon: "💎" };
      case 'ADVANCED_PARTIAL_MONETIZATION': return { label: "ADVANCED PARTIAL", color: "text-blue-400", bg: "bg-blue-500/20", icon: "🚀" };
      case 'PARTIAL_MONETIZATION': return { label: "PARTIAL MONETIZATION", color: "text-indigo-400", bg: "bg-indigo-500/20", icon: "📈" };
      case 'CREATOR_PROGRAM': return { label: "CREATOR PROGRAM", color: "text-amber-400", bg: "bg-amber-500/20", icon: "🌱" };
      default: return { label: "NÃO ELEGÍVEL", color: "text-zinc-500", bg: "bg-zinc-900", icon: "🔒" };
    }
  };

  const currentStatus = getLevelDisplay(level);

  return (
    <div className="min-h-screen bg-black text-white pb-32 animate-in fade-in duration-500 overflow-y-auto">
      <div className="sticky top-0 z-[100] bg-black/80 backdrop-blur-md border-b border-zinc-900 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full transition-all active:scale-90">
            <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-lg font-black italic uppercase tracking-tight">Painel de Ganhos</h1>
        </div>
        <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
           <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none">v9.1 RIGOROUS</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Nível de Monetização Atual */}
        <div className={`p-8 rounded-[2.5rem] border border-white/10 ${currentStatus.bg} space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95`}>
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="text-9xl font-black italic">{currentStatus.icon}</span>
           </div>
           
           <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 rounded-3xl bg-black/40 flex items-center justify-center text-4xl shadow-inner border border-white/5">
                    {currentStatus.icon}
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">Status da Conta</p>
                    <h3 className={`text-xl font-black italic tracking-tighter ${currentStatus.color}`}>{currentStatus.label}</h3>
                 </div>
              </div>
           </div>
           
           {level === 'NOT_ELIGIBLE' && (
             <div className="bg-black/60 p-6 rounded-3xl border border-red-500/20 text-center relative z-10">
                <p className="text-xs text-red-400 font-bold italic">"{benefits.message}"</p>
             </div>
           )}

           {level === 'PARTIAL_MONETIZATION' && (
             <div className="bg-blue-600/10 p-5 rounded-3xl border border-blue-500/20 relative z-10">
                <p className="text-[10px] text-blue-300 font-medium leading-relaxed italic">
                  Você está no nível <span className="font-black text-white">PARTIAL_MONETIZATION</span>. Continue engajando para atingir o nível avançado e desbloquear bônus e prioridade em campanhas.
                </p>
             </div>
           )}
        </div>

        {/* Permission Checklist based on Python dict keys */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[3rem] space-y-6 shadow-xl">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black uppercase text-white tracking-widest">Benefícios Desbloqueados</h3>
              <span className="text-[7px] font-black text-zinc-600 uppercase">Privilege Matrix</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BenefitItem 
                label="Selo de Criador (Badge)" 
                unlocked={benefits.badge} 
                icon="🛡️" 
              />
              <BenefitItem 
                label="Destaque Algorítmico (Highlight)" 
                unlocked={benefits.highlight} 
                icon="✨" 
              />
              <BenefitItem 
                label="Participação em Lucros (Revenue Share)" 
                unlocked={benefits.revenue_share} 
                icon="💰" 
              />
              <BenefitItem 
                label="Bônus de Engajamento (Bonus)" 
                unlocked={benefits.bonus} 
                icon="⚡" 
              />
              <BenefitItem 
                label="Campanhas de Elite (Priority)" 
                unlocked={!!benefits.priority_campaigns} 
                icon="🔥" 
              />
           </div>
        </div>

        {/* Meta Visualizações - 12 meses Deadline */}
        <div className="space-y-4">
           <RequirementCard 
            label="Seguidores" 
            current={user.followers} 
            target={1000} 
            percent={Math.min(100, (user.followers / 1000) * 100)} 
            color="bg-blue-500"
            icon="👥"
           />
           <RequirementCard 
            label="Visualizações Acumuladas" 
            current={user.viewsLastYear} 
            target={500000} 
            percent={Math.min(100, (user.viewsLastYear / 500000) * 100)} 
            color="bg-indigo-500"
            icon="🎬"
            info={user.firstViewDate ? `Prazo até ${new Date(new Date(user.firstViewDate).setFullYear(new Date(user.firstViewDate).getFullYear() + 1)).toLocaleDateString()}` : undefined}
           />
        </div>

        {/* Simulador de Repasse para Níveis Ativos */}
        {isEligible && benefits.revenue_share && (
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden">
             <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest">Simulador de Transparência</h3>
                <p className="text-[10px] text-zinc-500 font-medium">Veja como os 10% do lucro social e seu repasse de {benefits.revenue_share_percentage}% se traduzem em ganhos.</p>
             </div>
             
             <div className="space-y-8">
                <div className="space-y-3">
                   <div className="flex justify-between px-1">
                      <span className="text-[8px] font-black uppercase text-zinc-600">Lucro Global da Rede</span>
                      <span className="text-[10px] font-black text-white italic">R$ {hypoRevenue.toLocaleString()}</span>
                   </div>
                   <input 
                     type="range" min="1000" max="100000" step="1000"
                     value={hypoRevenue}
                     onChange={(e) => setHypoRevenue(parseInt(e.target.value))}
                     className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-inner"
                   />
                </div>

                <div className="bg-black/60 p-8 rounded-[2.5rem] border border-zinc-800 flex items-center justify-between shadow-inner group">
                   <div className="space-y-1">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Seu Repasse Estimado</p>
                      <p className="text-4xl font-black italic tracking-tighter text-green-400 group-hover:scale-105 transition-transform duration-500">R$ {projectedRevenue.toFixed(2)}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Cota</p>
                      <span className="px-2 py-1 bg-blue-600 text-[8px] font-black text-white rounded-lg uppercase">{benefits.revenue_share_percentage}% share</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BenefitItem = ({ label, unlocked, icon }: { label: string, unlocked: boolean, icon: string }) => (
  <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${unlocked ? 'bg-indigo-600/10 border-indigo-500/30 shadow-lg' : 'bg-black/20 border-zinc-900/50 opacity-30 grayscale'}`}>
     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${unlocked ? 'bg-indigo-600/20' : 'bg-zinc-900'}`}>
        {icon}
     </div>
     <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-black uppercase tracking-tight truncate ${unlocked ? 'text-white' : 'text-zinc-600'}`}>{label}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
           <div className={`w-1 h-1 rounded-full ${unlocked ? 'bg-green-500' : 'bg-zinc-800'}`}></div>
           <p className="text-[7px] font-bold uppercase tracking-widest text-zinc-500">{unlocked ? 'Ativo' : 'Bloqueado'}</p>
        </div>
     </div>
     {unlocked && <span className="text-blue-400 text-sm">✓</span>}
  </div>
);

const RequirementCard = ({ label, current, target, percent, color, icon, info }: any) => (
  <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 shadow-xl relative overflow-hidden group hover:border-zinc-700 transition-all">
     <div className="flex justify-between items-start">
        <div className="space-y-1">
           <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">{label}</span>
           <p className="text-3xl font-black italic tracking-tighter text-white">{current.toLocaleString()} <span className="text-xs text-zinc-700 font-bold uppercase tracking-widest">/ {target.toLocaleString()}</span></p>
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform ${percent >= 100 ? 'text-green-500' : 'text-zinc-700'}`}>
           {percent >= 100 ? '✅' : icon}
        </div>
     </div>
     <div className="space-y-3">
        <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-zinc-800 p-0.5">
           <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
        <div className="flex justify-between items-center">
           <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{Math.floor(percent)}% completo</span>
           {info && <span className="text-[8px] font-black text-blue-500 uppercase italic tracking-tighter">{info}</span>}
        </div>
     </div>
  </div>
);

export default MonetizationStatus;