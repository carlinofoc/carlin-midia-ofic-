
import React, { useMemo } from 'react';
import { User, ImpactResult, SocialDonation } from '../types';
import { impactService } from '../services/impactService';
import { ImpactMessage } from '../constants';

interface ImpactSocialScreenProps {
  user: User;
  onBack: () => void;
}

const ImpactSocialScreen: React.FC<ImpactSocialScreenProps> = ({ user, onBack }) => {
  // O ImpactService gerencia a sincronização com o ImpactRepository (Kotlin logic)
  const impact = useMemo(() => impactService.calculateUserImpact(user), [user]);

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors border border-zinc-800 shadow-lg">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-right">
             <h1 className="text-xl font-black italic tracking-tighter uppercase text-indigo-500 leading-none">Impacto Social</h1>
             <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">Transparência Financeira Carlin</span>
          </div>
        </div>

        {/* Hero Manifesto (Kotlin ImpactMessage) */}
        <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden">
           <div className="absolute -top-10 -right-10 opacity-5">
              <span className="text-9xl font-black italic">10%</span>
           </div>
           <h3 className="text-xs font-black uppercase text-indigo-400 tracking-widest">Nosso Compromisso</h3>
           <p className="text-sm font-medium leading-relaxed italic text-zinc-200">
             "{ImpactMessage.USER_MESSAGE.trim()}"
           </p>
        </div>

        {/* Hero Impact Score */}
        <div className="bg-gradient-to-br from-indigo-900/40 via-black to-black border border-indigo-500/20 rounded-[3rem] p-10 text-center space-y-6 shadow-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="text-9xl font-black italic">ECO</span>
           </div>
           
           <div className="relative">
              <div className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-500/20 flex items-center justify-center relative">
                 <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin duration-[3s]"></div>
                 <span className="text-4xl font-black italic text-indigo-400">{impact.ecoScore}</span>
              </div>
              <p className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.4em] mt-4">Eco-Contribution Score</p>
           </div>

           <div className="pt-4 space-y-2">
              <p className="text-2xl font-black tracking-tighter">R$ {impact.totalValueGenerated.toFixed(2)}</p>
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Valor Total Gerado (Transparência)</p>
           </div>
        </div>

        {/* Breakdown Section (Kotlin ImpactResult mapping) */}
        <div className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 px-4">Destinação do Faturamento</h3>
           <div className="grid grid-cols-2 gap-4">
              <DistributionCard 
                label="Reinvestimento" 
                value={impact.reinvestment} 
                icon="🚀" 
                desc="Evolução do App"
                color="text-blue-500"
              />
              <DistributionCard 
                label="Impacto Social" 
                value={impact.socialImpact} 
                icon="🌍" 
                desc="Causas & Doações"
                color="text-indigo-500"
              />
              <DistributionCard 
                label="Renda Dev" 
                value={impact.founderIncome} 
                icon="👨‍💻" 
                desc="Sustento do Autor"
                color="text-emerald-500"
              />
              <DistributionCard 
                label="Reserva" 
                value={impact.reserve} 
                icon="🛡️" 
                desc="Segurança Técnica"
                color="text-amber-500"
              />
           </div>
        </div>

        {/* Regional Distribution Section (Kotlin SocialDonation logic) */}
        <div className="space-y-6">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Histórico de Distribuição</h3>
              <span className="text-[9px] font-black text-indigo-500 uppercase">ImpactRepository v1.1</span>
           </div>
           
           <div className="space-y-4">
              {impact.donations.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-zinc-900 rounded-[2.5rem] text-center opacity-30">
                   <p className="text-[10px] font-black uppercase tracking-widest">Aguardando geração de receita para doações</p>
                </div>
              ) : (
                impact.donations.map((donation, idx) => (
                  <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] space-y-4 hover:border-indigo-500/30 transition-all shadow-lg">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-xl shadow-inner">
                             📦
                          </div>
                          <div>
                             <h4 className="text-[11px] font-black uppercase text-white tracking-tight">{donation.city}</h4>
                             <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{donation.month}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-xs font-black text-white">R$ {donation.amount.toFixed(2)}</span>
                       </div>
                    </div>
                    
                    {/* Kotlin Logic implementation: "Neste mês, doamos X cestas básicas em Y." */}
                    <div className="pt-4 border-t border-zinc-800/50">
                       <p className="text-[11px] text-zinc-300 font-medium leading-relaxed italic">
                         "Neste mês, doamos <span className="text-indigo-400 font-bold">{donation.basketsDistributed}</span> cestas básicas em <span className="text-white font-bold">{donation.city}</span>."
                       </p>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Policy Quote */}
        <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[3rem] text-center space-y-6 shadow-xl">
           <span className="text-3xl">⚖️</span>
           <p className="text-xs text-zinc-400 leading-relaxed italic font-medium">
             "Diferente de outras redes que escondem seus lucros, o Carlin expõe cada centavo. Nossas doações são convertidas em cestas básicas reais distribuídas pelo país e registradas no ImpactRepository."
           </p>
           <button className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.2em] hover:underline">Ler Carlin Transparency Policy</button>
        </div>

        <button className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 shadow-xl transition-all">
           Exportar Relatório Consolidado
        </button>
      </div>
    </div>
  );
};

const DistributionCard = ({ label, value, icon, desc, color }: { label: string, value: number, icon: string, desc: string, color: string }) => (
  <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2rem] space-y-3">
     <div className="flex justify-between items-start">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-black text-white">R$ {value.toFixed(2)}</span>
     </div>
     <div>
        <h4 className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</h4>
        <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">{desc}</p>
     </div>
  </div>
);

export default ImpactSocialScreen;
