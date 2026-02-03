
import React, { useState, useMemo } from 'react';
import { Post, User, ProfileLink } from '../types';

interface DashboardProps {
  user: User;
  posts: Post[];
  onBack: () => void;
  onOpenRoadmap: () => void;
}

type Period = '7d' | '30d' | 'total';

const Dashboard: React.FC<DashboardProps> = ({ user, posts, onBack, onOpenRoadmap }) => {
  const [period, setPeriod] = useState<Period>('total');

  // Multiplier simulates real-time filtering since we use local storage as mock DB
  const periodMultiplier = useMemo(() => {
    switch(period) {
      case '7d': return 0.25;
      case '30d': return 0.7;
      default: return 1.0;
    }
  }, [period]);

  const linksAnalytics = useMemo(() => {
    const baseLinks = user.links || [];
    return baseLinks.map(link => {
      const views = Math.floor(link.views * periodMultiplier);
      const clicks = Math.floor(link.clicks * periodMultiplier);
      const convRate = views > 0 ? (clicks / views) * 100 : 0;
      const revenue = link.type === 'monetized' ? clicks * 0.15 : 0;
      
      return {
        ...link,
        displayViews: views,
        displayClicks: clicks,
        displayConv: convRate,
        displayRevenue: revenue
      };
    }).sort((a, b) => b.displayClicks - a.displayClicks);
  }, [user.links, periodMultiplier]);

  const totalClicks = linksAnalytics.reduce((acc, l) => acc + l.displayClicks, 0);
  const totalRevenue = linksAnalytics.reduce((acc, l) => acc + l.displayRevenue, 0);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors border border-zinc-800">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-right">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Vínculos Analytics</h1>
            <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Impacto & Conversão v5.3</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-center">
           <div className="bg-zinc-900/50 p-1.5 rounded-[1.5rem] flex gap-1 border border-zinc-800">
              <PeriodTab label="7 Dias" active={period === '7d'} onClick={() => setPeriod('7d')} />
              <PeriodTab label="30 Dias" active={period === '30d'} onClick={() => setPeriod('30d')} />
              <PeriodTab label="Total" active={period === 'total'} onClick={() => setPeriod('total')} />
           </div>
        </div>

        {/* Summary Bento */}
        <div className="grid grid-cols-2 gap-4">
           <MetricSummary label="Total de Cliques" value={totalClicks.toLocaleString()} icon="🖱️" color="text-blue-500" />
           <MetricSummary label="Receita Estimada" value={`R$ ${totalRevenue.toFixed(2)}`} icon="💰" color="text-green-500" />
        </div>

        {/* Ranking Section */}
        <section className="space-y-6">
           <div className="flex justify-between items-end px-2">
              <h2 className="text-lg font-black uppercase tracking-tighter italic">Ranking de Performance</h2>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Ordenado por Cliques</span>
           </div>

           <div className="space-y-4">
              {linksAnalytics.length === 0 ? (
                <div className="py-20 text-center opacity-30 border-2 border-dashed border-zinc-900 rounded-[2rem]">
                   <p className="text-[10px] font-black uppercase tracking-widest">Sem dados no período</p>
                </div>
              ) : (
                linksAnalytics.map((link, idx) => (
                  <LinkPerformanceRow key={link.id} link={link} rank={idx + 1} />
                ))
              )}
           </div>
        </section>

        {/* Global Conversion Chart (SVG) */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
           <h3 className="text-[9px] font-black uppercase text-blue-500 tracking-[0.2em]">Saúde da Conversão (Funil)</h3>
           <div className="h-32 flex items-end justify-around gap-2 px-2">
              {linksAnalytics.map((link, i) => (
                <div key={link.id} className="flex-1 flex flex-col items-center gap-2 group">
                   <div 
                    className={`w-full rounded-t-xl transition-all duration-1000 ${link.displayConv > 20 ? 'bg-green-500' : 'bg-blue-600'}`} 
                    style={{ height: `${Math.max(10, link.displayConv * 1.5)}%` }}
                   >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded pointer-events-none">
                         {link.displayConv.toFixed(1)}%
                      </div>
                   </div>
                   <span className="text-[7px] font-black text-zinc-600 uppercase truncate w-full text-center">L{i+1}</span>
                </div>
              ))}
           </div>
           <p className="text-[8px] text-zinc-500 text-center uppercase font-bold tracking-widest">Distribuição percentual por vínculo ativo</p>
        </section>
      </div>
    </div>
  );
};

const LinkPerformanceRow: React.FC<{ link: any, rank: number }> = ({ link, rank }) => {
  const isMonetized = link.type === 'monetized';
  const isPinned = link.type === 'pinned';
  const isExclusive = link.type === 'exclusive';

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] p-6 space-y-5 hover:border-zinc-700 transition-all relative overflow-hidden group">
      {/* Rank Badge */}
      <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-10 transition-opacity">
         <span className="text-6xl font-black italic tracking-tighter">#{rank}</span>
      </div>

      <div className="flex items-start gap-4 pr-12">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${isMonetized ? 'bg-green-600/10 border-green-500/20 text-green-500' : isExclusive ? 'bg-purple-600/10 border-purple-500/20 text-purple-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
           <span className="text-xl">
             {isPinned ? '📌' : isMonetized ? '💰' : isExclusive ? '🧪' : '🔗'}
           </span>
        </div>
        <div className="flex-1 min-w-0">
           <h4 className="text-sm font-black uppercase text-white tracking-tight truncate group-hover:text-blue-500 transition-colors">
             {link.title}
           </h4>
           <p className="text-[10px] text-zinc-500 truncate font-medium mt-0.5">{link.url}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 border-t border-zinc-800 pt-5">
         <div className="space-y-0.5">
            <span className="text-[7px] font-black uppercase text-zinc-600 tracking-widest block">👁️ Views</span>
            <p className="text-xs font-black">{link.displayViews}</p>
         </div>
         <div className="space-y-0.5">
            <span className="text-[7px] font-black uppercase text-zinc-600 tracking-widest block">🖱️ Cliques</span>
            <p className="text-xs font-black">{link.displayClicks}</p>
         </div>
         <div className="space-y-0.5">
            <span className="text-[7px] font-black uppercase text-zinc-600 tracking-widest block">📊 Conv.</span>
            <p className="text-xs font-black text-blue-500">{link.displayConv.toFixed(1)}%</p>
         </div>
         <div className="space-y-0.5">
            <span className="text-[7px] font-black uppercase text-zinc-600 tracking-widest block">💰 Receita</span>
            <p className="text-xs font-black text-green-500">R$ {link.displayRevenue.toFixed(2)}</p>
         </div>
      </div>

      {/* Mini Conversion Bar */}
      <div className="w-full h-1 bg-black rounded-full overflow-hidden">
         <div 
          className={`h-full transition-all duration-1000 ${link.displayConv > 25 ? 'bg-green-500' : 'bg-blue-600'}`} 
          style={{ width: `${Math.min(100, link.displayConv * 3)}%` }}
         ></div>
      </div>
    </div>
  );
};

const MetricSummary = ({ label, value, icon, color }: { label: string, value: string, icon: string, color: string }) => (
  <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-[2.5rem] space-y-2 hover:border-zinc-700 transition-colors">
     <span className="text-2xl">{icon}</span>
     <div>
        <p className="text-xl font-black tracking-tighter text-white">{value}</p>
        <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${color}`}>{label}</p>
     </div>
  </div>
);

const PeriodTab = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
    }`}
  >
    {label}
  </button>
);

export default Dashboard;
