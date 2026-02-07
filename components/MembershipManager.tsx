
import React, { useState, useMemo } from 'react';
import { User, MembershipTier } from '../types';
import { impactService } from '../services/impactService';

interface MembershipManagerProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

const MembershipManager: React.FC<MembershipManagerProps> = ({ user, onUpdateUser, onBack }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTier, setNewTier] = useState({ name: '', price: 10, benefits: '' });

  const tiers = user.membershipTiers || [];

  const handleAddTier = () => {
    const benefitsList = newTier.benefits.split(',').map(b => b.trim());
    const res = impactService.createMembershipTier(user, newTier.name, newTier.price, benefitsList);
    
    if (res.sucesso && res.tier) {
      onUpdateUser({
        ...user,
        membershipTiers: [...tiers, res.tier]
      });
      setShowAdd(false);
      setNewTier({ name: '', price: 10, benefits: '' });
    } else {
      alert(res.motivo);
    }
  };

  const removeTier = (id: string) => {
    onUpdateUser({
      ...user,
      membershipTiers: tiers.filter(t => t.id !== id)
    });
  };

  const payoutSim = useMemo(() => 
    impactService.calculateMembershipPayout(newTier.price || 0), 
    [newTier.price]
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors border border-zinc-800 shadow-xl">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-right">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Gestão de Assinaturas</h1>
            <span className="text-[7px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1">Seja Membro Engine v1.9</span>
          </div>
        </div>

        {user.followers < 1000 ? (
          <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] text-center space-y-6">
            <span className="text-5xl block opacity-30">🔒</span>
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase tracking-widest">Requisito Mínimo</h3>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mx-auto">
                Você precisa de pelo menos <span className="text-indigo-400 font-bold">1.000 seguidores</span> para ativar o sistema de membros e criar níveis (Bronze, Prata, Ouro).
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Níveis de Assinatura</h3>
              <button 
                onClick={() => setShowAdd(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg"
              >
                + Criar Novo Nível
              </button>
            </div>

            <div className="grid gap-4">
              {tiers.length === 0 ? (
                <div className="p-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem] opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">Configure seus planos de assinatura</p>
                </div>
              ) : (
                tiers.map(tier => (
                  <div key={tier.id} className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <span className="text-xl">{tier.name === 'Bronze' ? '🥉' : tier.name === 'Prata' ? '🥈' : '🥇'}</span>
                         <h4 className="text-sm font-black uppercase italic text-white">{tier.name}</h4>
                      </div>
                      <p className="text-xs font-black text-indigo-400 tracking-tighter">R$ {tier.price.toFixed(2)} / mês</p>
                      <div className="flex gap-3">
                         <p className="text-[9px] text-zinc-500 font-bold uppercase">{tier.subscriberCount} Assinantes</p>
                         <p className="text-[9px] text-green-500 font-bold uppercase">Liquidez: R$ {(tier.price * 0.95).toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeTier(tier.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showAdd && (
          <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-10 rounded-[3rem] space-y-6 shadow-3xl animate-in zoom-in-95">
               <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Configurar Nível</h2>
               
               <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-zinc-500 ml-4">Nome do Nível</label>
                    <input 
                      value={newTier.name}
                      onChange={e => setNewTier({...newTier, name: e.target.value})}
                      placeholder="Ex: Bronze, Prata, Ouro"
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-zinc-500 ml-4">Preço Mensal (R$)</label>
                    <input 
                      type="number"
                      value={newTier.price}
                      onChange={e => setNewTier({...newTier, price: parseFloat(e.target.value)})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Fee Transparency Box */}
                  <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800 space-y-2">
                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span className="text-zinc-500">Taxa Plataforma (5%)</span>
                        <span className="text-red-500">- R$ {payoutSim.taxa.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-t border-zinc-800 pt-2">
                        <span className="text-indigo-400">Seu Repasse Líquido</span>
                        <span className="text-white text-sm tracking-tighter">R$ {payoutSim.valorFinal.toFixed(2)}</span>
                     </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-zinc-500 ml-4">Benefícios do Plano</label>
                    <textarea 
                      value={newTier.benefits}
                      onChange={e => setNewTier({...newTier, benefits: e.target.value})}
                      placeholder="Ex: Dicas exclusivas, Vídeos antecipados..."
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-indigo-500 resize-none h-24"
                    />
                  </div>
               </div>

               <div className="flex gap-2">
                  <button onClick={() => setShowAdd(false)} className="flex-1 py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-black uppercase text-[10px]">Cancelar</button>
                  <button onClick={handleAddTier} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-indigo-600/20">Ativar Nível</button>
               </div>
            </div>
          </div>
        )}

        <div className="p-10 bg-indigo-600/5 border border-indigo-500/10 rounded-[3rem] text-center space-y-4">
           <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Repasse Justo</h4>
           <p className="text-xs text-zinc-500 leading-relaxed italic">
             "O Carlin retém apenas <span className="text-white font-bold">5%</span> sobre as assinaturas de membros para cobrir custos operacionais, garantindo que a maior parte do valor fique com quem gera o conteúdo."
           </p>
        </div>
      </div>
    </div>
  );
};

export default MembershipManager;
