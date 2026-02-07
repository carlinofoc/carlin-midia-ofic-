
import React, { useState, useMemo, useEffect } from 'react';
import { Post, User, CreatorTier, WithdrawalRequest, PaymentMethod as PMType, WithdrawalStatus, PayoutDestination } from '../types';
import { impactService, MIN_WITHDRAWAL_AMOUNT } from '../services/impactService';

interface DashboardProps {
  user: User;
  posts: Post[];
  onBack: () => void;
  onOpenRoadmap: () => void;
  onUpdateUser: (user: User) => void;
}

type Period = '7d' | '30d' | 'total';
type DashboardTab = 'stats' | 'financial';

const Dashboard: React.FC<DashboardProps> = ({ user, posts, onBack, onUpdateUser }) => {
  const [period, setPeriod] = useState<Period>('total');
  const [activeTab, setActiveTab] = useState<DashboardTab>('stats');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawMethod, setWithdrawMethod] = useState<PMType>('PIX');
  const [destinationValue, setDestinationValue] = useState('');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [history, setHistory] = useState<WithdrawalRequest[]>([]);

  // Fetch initial history or refresh when switching to financial tab
  useEffect(() => {
    if (activeTab === 'financial') {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        const { payouts } = await impactService.getPayoutHistory(user);
        setHistory(payouts);
        setIsLoadingHistory(false);
      };
      fetchHistory();
    }
  }, [activeTab, user]);

  const periodMultiplier = useMemo(() => {
    switch(period) {
      case '7d': return 0.25;
      case '30d': return 0.7;
      default: return 1.0;
    }
  }, [period]);

  const videoAnalytics = useMemo(() => {
    const videos = posts.filter(p => p.type === 'video');
    return videos.map(v => {
      const monRes = impactService.calculateMonetization(v, user);
      return {
        ...v,
        monetizationResult: monRes,
        displayEarnings: monRes.totalGanho * periodMultiplier,
        displayViews: Math.floor((v.views || 0) * periodMultiplier)
      };
    }).sort((a, b) => (b.displayEarnings || 0) - (a.displayEarnings || 0));
  }, [posts, user, periodMultiplier]);

  const membershipRevenue = useMemo(() => {
      const tiers = user.membershipTiers || [];
      const gross = tiers.reduce((acc, t) => acc + (t.price * t.subscriberCount), 0);
      const { valorFinal } = impactService.calculateMembershipPayout(gross);
      return valorFinal * periodMultiplier;
  }, [user.membershipTiers, periodMultiplier]);

  const totalEarnings = useMemo(() => {
    if (period === 'total') return user.totalRevenue || 1820.50;
    const videoRevenueTotal = videoAnalytics.reduce((acc, v) => acc + v.displayEarnings, 0);
    return videoRevenueTotal + membershipRevenue;
  }, [period, user.totalRevenue, videoAnalytics, membershipRevenue]);

  const availableForWithdraw = user.availableBalance || 920.25;

  const handleWithdrawRequest = async () => {
    if (!destinationValue.trim()) {
      alert("Por favor, informe os dados de destino do pagamento.");
      return;
    }

    setIsProcessingPayout(true);
    
    const destination: PayoutDestination = {};
    if (withdrawMethod === 'PIX') destination.pixKey = destinationValue;
    else if (withdrawMethod === 'PayPal') destination.paypalEmail = destinationValue;
    else destination.bankAccount = destinationValue;

    const result = await impactService.requestPayout(user, withdrawAmount, withdrawMethod, destination);
    
    if (result.success && result.request) {
      const updatedHistory = [result.request, ...history];
      setHistory(updatedHistory);
      
      const updatedUser = {
        ...user,
        availableBalance: parseFloat((availableForWithdraw - withdrawAmount).toFixed(2)),
        withdrawalHistory: updatedHistory
      };

      onUpdateUser(updatedUser);
      setShowWithdrawModal(false);
      setWithdrawAmount(0);
      setDestinationValue('');
      alert(result.message);
    } else {
      alert(result.message);
    }
    
    setIsProcessingPayout(false);
  };

  const isAdsEligible = user.followers >= 1000 && user.viewsLastYear >= 500000;

  const getStatusColor = (status: WithdrawalStatus) => {
    switch(status) {
      case 'PAID': return 'bg-green-500/20 text-green-400';
      case 'PROCESSING': return 'bg-amber-500/20 text-amber-400';
      case 'REJECTED': 
      case 'REFUSED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-zinc-800 text-zinc-500';
    }
  };

  const getStatusLabel = (status: WithdrawalStatus) => {
    switch(status) {
      case 'PAID': return 'PAGO';
      case 'PROCESSING': return 'PROCESSANDO';
      case 'REJECTED': 
      case 'REFUSED': return 'RECUSADO';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors border border-zinc-800 shadow-xl">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-right">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none text-blue-500">Relatório de Ganhos</h1>
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">Status: {isAdsEligible ? 'ACTIVE' : 'INCOMPLETE'}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-900/50 p-1.5 rounded-[1.5rem] border border-zinc-800">
           <button onClick={() => setActiveTab('stats')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'stats' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500'}`}>Métricas</button>
           <button onClick={() => setActiveTab('financial')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'financial' ? 'bg-blue-600 text-white shadow-xl' : 'text-zinc-500'}`}>Financeiro (BRL)</button>
        </div>

        {activeTab === 'stats' ? (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
            <div className={`p-8 rounded-[2.5rem] border transition-all ${isAdsEligible ? 'bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.2)] border-blue-500/50' : 'bg-zinc-900/40 border-zinc-800'}`}>
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <h3 className="text-xs font-black uppercase text-white tracking-widest">Elegibilidade Global</h3>
                     <p className="text-[10px] text-blue-100/60 font-bold uppercase leading-relaxed">
                       {isAdsEligible 
                        ? 'Metas auditadas e atingidas. Você é um criador verificado para receita.' 
                        : 'Continue produzindo Rios para desbloquear monetização por ads.'}
                     </p>
                  </div>
                  {isAdsEligible && (
                    <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
                       <span className="text-[8px] font-black text-white uppercase tracking-widest">Ativo ✓</span>
                    </div>
                  )}
               </div>
               
               <div className="grid grid-cols-2 gap-8 mt-8 border-t border-white/10 pt-8">
                  <div>
                     <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Inscritos</p>
                     <p className="text-2xl font-black italic">{user.followers.toLocaleString()}</p>
                     <p className="text-[7px] font-bold text-blue-300 uppercase">Auditado</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Views (Anuais)</p>
                     <p className="text-2xl font-black italic">{user.viewsLastYear.toLocaleString()}</p>
                     <p className="text-[7px] font-bold text-blue-300 uppercase">Meta: 500k</p>
                  </div>
               </div>
            </div>

            <div className="flex justify-center">
               <div className="bg-zinc-900/50 p-1.5 rounded-[1.5rem] flex gap-1 border border-zinc-800">
                  <PeriodTab label="7 Dias" active={period === '7d'} onClick={() => setPeriod('7d')} />
                  <PeriodTab label="30 Dias" active={period === '30d'} onClick={() => setPeriod('30d')} />
                  <PeriodTab label="Total" active={period === 'total'} onClick={() => setPeriod('total')} />
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               <MetricSummary label="Ganhos Totais" value={`R$ ${totalEarnings.toFixed(2)}`} icon="💰" color="text-blue-500" />
               <MetricSummary label="Membros" value={`R$ ${membershipRevenue.toFixed(2)}`} icon="💎" color="text-purple-500" />
               <MetricSummary label="Alcance" value={user.followers.toLocaleString()} icon="👥" color="text-blue-400" />
               <MetricSummary label="Views Período" value={Math.floor(user.viewsLastYear * periodMultiplier).toLocaleString()} icon="👁️" color="text-zinc-500" />
            </div>

            <section className="space-y-6">
               <div className="flex justify-between items-end px-2">
                  <h2 className="text-lg font-black uppercase tracking-tighter italic text-white">Performance de Rios</h2>
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Sincronizado</span>
               </div>
               <div className="grid gap-4">
                  {videoAnalytics.length === 0 ? (
                    <div className="py-20 text-center opacity-30 border-2 border-dashed border-zinc-900 rounded-3xl">
                       <p className="text-[10px] font-black uppercase tracking-widest">Nenhum vídeo qualificado</p>
                    </div>
                  ) : (
                    videoAnalytics.map((video) => (
                      <div key={video.id} className="bg-zinc-900/60 border border-zinc-800 rounded-[2rem] p-6 flex items-center justify-between group hover:border-zinc-700 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                               <img src={video.userAvatar} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <h4 className="text-[11px] font-black uppercase text-white truncate w-32">{video.content}</h4>
                               <p className="text-[8px] font-bold text-zinc-500 uppercase">{video.displayViews.toLocaleString()} views</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-blue-400 tracking-tighter">R$ {video.displayEarnings.toFixed(2)}</p>
                            <p className="text-[7px] font-black text-zinc-600 uppercase">Receita Spot</p>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </section>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             <div className="bg-gradient-to-br from-blue-600 to-indigo-950 rounded-[3rem] p-12 text-center shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <span className="text-9xl font-black italic tracking-tighter">VALOR</span>
                </div>
                <div className="relative z-10 space-y-3">
                   <p className="text-[10px] font-black uppercase text-blue-100/60 tracking-[0.4em]">Disponível para Saque</p>
                   <p className="text-7xl font-black italic tracking-tighter text-white">R$ {availableForWithdraw.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="mt-12 bg-white text-blue-950 font-black py-6 px-12 rounded-2xl text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all relative z-10 hover:bg-zinc-100"
                >
                  Solicitar Pagamento Manual
                </button>
                <p className="mt-6 text-[8px] text-blue-200/50 uppercase font-black tracking-widest relative z-10">Moeda: BRL (R$)</p>
             </div>

             <section className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-4">Detalhamento Financeiro</h3>
                <div className="space-y-4">
                   <BreakdownRow label="Receita Ads (totalEarnings)" value={totalEarnings} />
                   <BreakdownRow label="Disponível (availableForWithdraw)" value={availableForWithdraw} />
                   <div className="h-px bg-zinc-800 my-4"></div>
                   <div className="flex justify-between items-center text-white">
                      <span className="text-xs font-black uppercase tracking-widest">Saldo Auditado</span>
                      <span className="text-lg font-black italic tracking-tighter">BRL {totalEarnings.toFixed(2)}</span>
                   </div>
                </div>
             </section>

             <section className="space-y-6">
                <div className="flex justify-between items-center px-4">
                   <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Histórico de Saques</h3>
                   <span className="text-[8px] font-black text-zinc-600 uppercase">Processamento Manual</span>
                </div>
                <div className="space-y-3">
                   {isLoadingHistory ? (
                     <div className="p-20 flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Buscando histórico...</p>
                     </div>
                   ) : history.length === 0 ? (
                     <div className="p-12 text-center border-2 border-dashed border-zinc-900 rounded-[2.5rem] opacity-30">
                        <p className="text-[10px] font-black uppercase tracking-widest">Nenhum saque solicitado</p>
                     </div>
                   ) : (
                     history.map((req) => (
                       <div key={req.id} className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-3xl flex items-center justify-between">
                          <div className="flex items-center gap-5">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                               req.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 
                               req.status === 'PROCESSING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                             }`}>
                                {req.method === 'PIX' ? '💠' : req.method === 'PayPal' ? '💳' : '🏦'}
                             </div>
                             <div>
                                <h4 className="text-[11px] font-black uppercase text-white tracking-tight">Saque {req.method}</h4>
                                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{req.date}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-white">R$ {req.amount.toFixed(2)}</p>
                             <span className={`text-[7px] font-black uppercase px-2 py-1 rounded-full mt-1 inline-block ${getStatusColor(req.status)}`}>
                                {getStatusLabel(req.status)}
                             </span>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </section>
          </div>
        )}

        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6 backdrop-blur-xl">
             <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-10 rounded-[3rem] space-y-8 shadow-3xl animate-in zoom-in-95">
                <div className="space-y-3">
                   <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">Solicitar Saque</h2>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                     Valor disponível: R$ {availableForWithdraw.toFixed(2)}. Análise humana obrigatória.
                   </p>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-zinc-600 ml-4">Valor para Retirada (R$)</label>
                      <input 
                        type="number"
                        min={MIN_WITHDRAWAL_AMOUNT}
                        step="0.01"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                        disabled={isProcessingPayout}
                        className="w-full bg-black border border-zinc-800 rounded-3xl py-6 px-8 text-2xl font-black italic text-white outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                        placeholder="0.00"
                      />
                   </div>

                   <div className="space-y-3">
                      <label className="text-[8px] font-black uppercase text-zinc-600 ml-4">Canal de Pagamento</label>
                      <div className="grid grid-cols-3 gap-2">
                         {(['PIX', 'PayPal', 'Transferência Bancária'] as PMType[]).map(m => (
                           <button 
                             key={m}
                             onClick={() => { setWithdrawMethod(m); setDestinationValue(''); }}
                             disabled={isProcessingPayout}
                             className={`py-4 rounded-xl border text-[8px] font-black uppercase tracking-tighter transition-all flex flex-col items-center gap-1 disabled:opacity-50 ${withdrawMethod === m ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-black border-zinc-800 text-zinc-500'}`}
                           >
                             <span className="text-lg">{m === 'PIX' ? '💠' : m === 'PayPal' ? '💳' : '🏦'}</span>
                             {m.split(' ')[0]}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-zinc-600 ml-4">
                        {withdrawMethod === 'PIX' ? 'Chave PIX' : withdrawMethod === 'PayPal' ? 'Email do PayPal' : 'Dados Bancários'}
                      </label>
                      <input 
                        type="text"
                        value={destinationValue}
                        onChange={(e) => setDestinationValue(e.target.value)}
                        disabled={isProcessingPayout}
                        placeholder={withdrawMethod === 'PIX' ? "CPF, Email, Celular ou Aleatória" : "seu-email@dominio.com"}
                        className="w-full bg-black border border-zinc-800 rounded-3xl py-4 px-8 text-sm font-medium text-white outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                      />
                   </div>
                </div>

                <div className="flex gap-3">
                   <button 
                    onClick={() => setShowWithdrawModal(false)} 
                    disabled={isProcessingPayout}
                    className="flex-1 py-5 bg-zinc-800 text-zinc-400 rounded-2xl font-black uppercase text-[10px] active:scale-95 transition-all disabled:opacity-50"
                   >
                    Voltar
                   </button>
                   <button 
                     onClick={handleWithdrawRequest}
                     disabled={isProcessingPayout || withdrawAmount < MIN_WITHDRAWAL_AMOUNT || withdrawAmount > availableForWithdraw || !destinationValue.trim()}
                     className="flex-1 py-5 bg-white text-blue-950 rounded-2xl font-black uppercase text-[10px] shadow-2xl active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                   >
                     {isProcessingPayout ? (
                       <>
                         <div className="w-3 h-3 border-2 border-blue-950 border-t-transparent rounded-full animate-spin"></div>
                         Enviando...
                       </>
                     ) : 'Confirmar'}
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BreakdownRow = ({ label, value }: { label: string, value: number }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
    <span className="text-xs font-black text-white">R$ {value.toFixed(2)}</span>
  </div>
);

const MetricSummary = ({ label, value, icon, color }: { label: string, value: string, icon: string, color: string }) => (
  <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-[2rem] space-y-2 hover:border-zinc-700 transition-colors text-center shadow-xl">
     <span className="text-2xl block">{icon}</span>
     <div>
        <p className="text-sm font-black tracking-tighter text-white">{value}</p>
        <p className={`text-[8px] font-black uppercase tracking-widest ${color}`}>{label}</p>
     </div>
  </div>
);

const PeriodTab = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2 rounded-2xl text-[8px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-zinc-800 text-white shadow-xl scale-105' : 'text-zinc-600 hover:text-zinc-400'
    }`}
  >
    {label}
  </button>
);

export default Dashboard;
