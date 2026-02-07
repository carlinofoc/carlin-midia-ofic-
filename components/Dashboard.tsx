import React, { useState, useMemo, useEffect } from 'react';
import { Post, User, WithdrawalRequest, PaymentMethod as PMType, CreatorDashboardSnapshot, MonthlyCreatorStats } from '../types';
import { impactService, CreatorGrowthProjection } from '../services/impactService';

interface DashboardProps {
  user: User;
  posts: Post[];
  onBack: () => void;
  onOpenRoadmap: () => void;
  onUpdateUser: (user: User) => void;
}

type DashboardTab = 'stats' | 'financial' | 'simulator';

const Dashboard: React.FC<DashboardProps> = ({ user, onBack, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('stats');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawMethod] = useState<PMType>('PIX');
  const [destinationValue, setDestinationValue] = useState('');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [history, setHistory] = useState<WithdrawalRequest[]>([]);
  const [projection, setProjection] = useState<CreatorGrowthProjection | null>(null);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlyCreatorStats[]>([]);

  // Mocked platform revenue for simulation
  const platformRevenueMock = 150000;

  useEffect(() => {
    setProjection(impactService.calculateCreatorProjection(user));
    setMonthlyHistory(impactService.getMonthlyStats(user));
    
    if (activeTab === 'financial') {
      const fetchHistory = async () => {
        const { payouts } = await impactService.getPayoutHistory(user);
        setHistory(payouts);
      };
      fetchHistory();
    }
  }, [activeTab, user]);

  /**
   * REPLICATED FROM PYTHON v9.5 logic
   */
  const snapshot = useMemo<CreatorDashboardSnapshot>(() => {
    const level = impactService.getMonetizationLevel(user);
    const benefits = impactService.getCreatorBenefits(level);
    const creatorShare = benefits.revenue_share_percentage || 0;
    
    const dashboard = impactService.generateCreatorDashboard(user, platformRevenueMock, creatorShare);
    return impactService.dashboardToJSON(dashboard);
  }, [user]);

  const availableForWithdraw = user.availableBalance || 0;

  const handleWithdrawRequest = async () => {
    if (!destinationValue.trim()) return alert("Informe dados de destino.");
    setIsProcessingPayout(true);
    const result = await impactService.requestPayout(user, withdrawAmount, withdrawMethod, {});
    if (result.success && result.request) {
      const updatedHistory = [result.request, ...history];
      setHistory(updatedHistory);
      onUpdateUser({ ...user, availableBalance: availableForWithdraw - withdrawAmount, withdrawalHistory: updatedHistory });
      setShowWithdrawModal(false);
    }
    setIsProcessingPayout(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors border border-zinc-800 shadow-xl active:scale-95">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-right">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none text-blue-500">Analytics Pro</h1>
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">Sincronização Engine v9.5</span>
          </div>
        </div>

        {/* Snapshot Summary: Python generate_creator_dashboard view */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 space-y-8 shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <span className="text-8xl font-black italic">DATA</span>
            </div>
            
            <div className="flex justify-between items-start relative z-10">
               <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest">Resumo do Criador</h3>
                  <p className="text-[9px] text-zinc-500 font-mono italic">Sync ISO: {snapshot.last_update}</p>
               </div>
               <span className="text-[7px] font-black text-zinc-600 uppercase">C-ID: {snapshot.creator_id.split('_').pop()}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
               <SnapshotMetric label="Followers" value={snapshot.followers.toLocaleString()} icon="👥" />
               <SnapshotMetric label="Views Total" value={snapshot.total_views.toLocaleString()} icon="👁️" />
               <SnapshotMetric label="Revenue (Est)" value={`R$ ${snapshot.estimated_revenue.toFixed(2)}`} icon="💰" color="text-green-400" />
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800 relative z-10">
               <div className="flex justify-between items-end">
                  <div className="space-y-1 pr-10">
                     <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-tight">
                        Meta: <span className="text-white">{snapshot.next_goal}</span>
                     </p>
                  </div>
                  <span className="text-[10px] font-black text-blue-500 italic">{snapshot.progress_percentage}%</span>
               </div>
               <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-zinc-800 p-0.5 shadow-inner">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                    style={{ width: `${snapshot.progress_percentage}%` }}
                  ></div>
               </div>
               {snapshot.disclaimer && (
                 <p className="text-[8px] text-zinc-600 uppercase font-black tracking-tight italic pt-2">
                   * {snapshot.disclaimer}
                 </p>
               )}
            </div>
        </div>

        <div className="flex bg-zinc-900/50 p-1.5 rounded-[1.5rem] border border-zinc-800 overflow-x-auto hide-scrollbar">
           <TabBtn active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} label="Performance" />
           <TabBtn active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} label="Saque" />
           <TabBtn active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')} label="🚀 Carreira" />
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-10 animate-in slide-in-from-left-4">
            <div className={`p-8 rounded-[2.5rem] border border-white/10 bg-zinc-900/40 space-y-6 relative overflow-hidden shadow-2xl`}>
               <h3 className="text-xs font-black uppercase text-blue-400 tracking-widest relative z-10">Status do Algoritmo</h3>
               <div className="grid grid-cols-2 gap-8 relative z-10">
                  <div>
                     <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Nível de Monetização</p>
                     <p className="text-2xl font-black italic tracking-tighter text-white truncate">{snapshot.monetization_level.replace('_', ' ')}</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Eficiência de Engajamento</p>
                     <p className="text-2xl font-black italic tracking-tighter text-white">{projection?.scalingEfficiency}%</p>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               <MetricSummary label="Escalabilidade" value={user.followers >= 1000 ? 'ALTA' : 'MÉDIA'} icon="📈" color="text-blue-400" />
               <MetricSummary label="Retorno ROI" value={`R$ ${projection?.monthlyRevenuePotential.toFixed(2)}`} icon="📅" color="text-green-500" />
               <MetricSummary label="Verified" value={user.isVerified ? 'SIM' : 'NÃO'} icon="🛡️" color="text-indigo-400" />
               <MetricSummary label="Constância" value="ESTÁVEL" icon="🔋" color="text-amber-500" />
            </div>

            {/* Histórico Mensal - Python MonthlyCreatorStats integration */}
            <div className="space-y-6 pt-4">
               <div className="flex justify-between items-center px-4">
                  <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">Histórico Mensal</h3>
                  <span className="text-[7px] font-black text-zinc-600 uppercase italic">MonthlyCreatorStats Table</span>
               </div>
               <div className="space-y-3">
                  {monthlyHistory.map((stat, i) => (
                    <MonthlyStatRow key={i} stat={stat} />
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'simulator' && projection && (
          <div className="space-y-8 animate-in zoom-in-95">
             <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <span className="text-7xl font-black italic">SCALE</span>
                </div>
                <div className="space-y-6 relative z-10">
                   <h2 className="text-2xl font-black italic uppercase tracking-tighter text-indigo-400">Plano de Escala v9.5</h2>
                   <div className="grid gap-4">
                      <SimulatorCard 
                        label="Prazo de Meta Ads" 
                        value={projection.daysToMonetization > 0 ? `${projection.daysToMonetization} dias` : "Meta Atingida"} 
                        desc="Baseado em tendência de views"
                        icon="⌛"
                      />
                      <SimulatorCard 
                        label="Previsão Base (12m)" 
                        value={`${projection.estimatedFollowers12m.toLocaleString()} seg.`} 
                        desc="Projeção algorítmica Carlin"
                        icon="🚀"
                      />
                      <SimulatorCard 
                        label="Status de Carreira" 
                        value={projection.currentStatus} 
                        desc="Avaliação do Business Engine"
                        icon="🛡️"
                      />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-10 animate-in slide-in-from-right-4">
             <div className="bg-gradient-to-br from-blue-600 to-indigo-950 rounded-[3rem] p-12 text-center shadow-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                <p className="text-[10px] font-black uppercase text-blue-100/60 tracking-[0.4em] mb-4">Disponível para Transferência</p>
                <p className="text-6xl font-black italic tracking-tighter">R$ {availableForWithdraw.toFixed(2)}</p>
                <button 
                  onClick={() => setShowWithdrawModal(true)} 
                  className="mt-12 bg-white text-blue-950 font-black py-5 px-10 rounded-2xl text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all hover:bg-blue-50"
                >
                  Solicitar Saque (Manual)
                </button>
             </div>
             <p className="text-[9px] text-center text-zinc-600 uppercase font-black tracking-widest italic">
               Auditoria humana obrigatória para segurança do criador.
             </p>
          </div>
        )}

        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6 backdrop-blur-md">
             <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-10 rounded-[3rem] space-y-8 animate-in zoom-in-95">
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Configurar Retirada</h2>
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-zinc-500 ml-4">Valor Desejado</label>
                      <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-xl font-black text-white outline-none focus:border-blue-500" placeholder="R$ 0,00" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-zinc-500 ml-4">Dados de Destino (PIX/Email)</label>
                      <input type="text" value={destinationValue} onChange={(e) => setDestinationValue(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-blue-500" placeholder="Insira a chave..." />
                   </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-4 bg-zinc-800 text-zinc-400 rounded-2xl font-black uppercase text-[10px]">Voltar</button>
                   <button 
                     onClick={handleWithdrawRequest} 
                     disabled={isProcessingPayout}
                     className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg disabled:opacity-50"
                   >
                     {isProcessingPayout ? 'Validando...' : 'Confirmar'}
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Fixed: Explicitly typed sub-components as React.FC to allow proper 'key' prop handling in JSX
const SnapshotMetric: React.FC<{ label: string; value: string; icon: string; color?: string }> = ({ label, value, icon, color = "text-white" }) => (
  <div className="space-y-1.5">
     <div className="flex items-center gap-2">
        <span className="text-sm opacity-50">{icon}</span>
        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
     </div>
     <p className={`text-sm font-black italic tracking-tight ${color}`}>{value}</p>
  </div>
);

// Fixed: Explicitly typed MonthlyStatRow as React.FC to satisfy JSX 'key' requirement and MonthlyCreatorStats interface
const MonthlyStatRow: React.FC<{ stat: MonthlyCreatorStats }> = ({ stat }) => (
  <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] flex items-center justify-between group hover:border-zinc-700 transition-all">
     <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-black flex flex-col items-center justify-center border border-zinc-800">
           <span className="text-[6px] font-black text-zinc-600 uppercase leading-none">{stat.year}</span>
           <span className="text-[10px] font-black text-white italic leading-none mt-0.5">{stat.month.toString().padStart(2, '0')}</span>
        </div>
        <div>
           <p className="text-[10px] font-black uppercase text-zinc-400">Mensal: <span className="text-white">{stat.views_in_month.toLocaleString()} views</span></p>
           <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Followers: {stat.followers.toLocaleString()}</p>
        </div>
     </div>
     <div className="text-right">
        <p className="text-xs font-black text-green-400 italic">R$ {stat.estimated_revenue.toFixed(2)}</p>
        <p className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">Revenue Share</p>
     </div>
  </div>
);

// Fixed: Explicitly typed SimulatorCard as React.FC with specific props instead of any
const SimulatorCard: React.FC<{ label: string; value: string; desc: string; icon: string }> = ({ label, value, desc, icon }) => (
  <div className="bg-black/40 border border-white/5 p-6 rounded-[2rem] flex items-center gap-5 group hover:border-indigo-500/30 transition-all">
     <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
     <div>
        <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{label}</h4>
        <p className="text-xl font-black text-white italic tracking-tighter">{value}</p>
        <p className="text-[8px] font-bold text-indigo-400 uppercase mt-1">{desc}</p>
     </div>
  </div>
);

// Fixed: Explicitly typed TabBtn as React.FC with specific props instead of any
const TabBtn: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-zinc-800 text-zinc-500'}`}>
    {label}
  </button>
);

// Fixed: Explicitly typed MetricSummary as React.FC with specific props instead of any
const MetricSummary: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-[2rem] space-y-2 text-center shadow-xl">
     <span className="text-2xl block">{icon}</span>
     <div>
        <p className="text-xs font-black tracking-tighter text-white truncate px-1">{value}</p>
        <p className={`text-[8px] font-black uppercase tracking-widest ${color}`}>{label}</p>
     </div>
  </div>
);

export default Dashboard;