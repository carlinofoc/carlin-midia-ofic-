
import React from 'react';
import { Post, User } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  user: User;
  posts: Post[];
  onBack: () => void;
  onOpenRoadmap: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, posts, onBack, onOpenRoadmap }) => {
  // Cálculos simulados para métricas humanas
  const totalLikes = posts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.comments, 0);
  // Fix: Property 'stats' does not exist on type 'Post', defaulting to 0
  const totalSaves = 0;
  const reachedPeople = (totalLikes * 8) + (totalComments * 15) + (totalSaves * 25) + 420;

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="flex flex-col items-end">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Dashboard Oficial</h1>
            <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Valor Humano & Real</span>
          </div>
        </div>

        {/* Panel 1: Impacto Real */}
        <section className="space-y-6">
           <div className="text-center space-y-2">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Você impactou pessoas hoje.</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic">"Não comparamos você com ninguém. Apenas com quem você era ontem."</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricBox icon="👥" label="Pessoas Alcançadas" value={reachedPeople.toLocaleString()} subtext="Vida real além das telas" />
              <MetricBox icon="💬" label="Conversas Geradas" value={totalComments.toLocaleString()} subtext="Conexões genuínas" />
              <MetricBox icon="🔖" label="Valor Percebido" value={totalSaves.toLocaleString()} subtext="Conteúdos salvos" />
           </div>
        </section>

        {/* Panel 2: Distribuição Justa */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-8 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest">Distribuição Justa</h3>
              <span className="text-[8px] font-black bg-blue-600/10 text-blue-500 px-2 py-0.5 rounded uppercase">Transparência v4.1</span>
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                 <p className="text-2xl font-black tracking-tighter">100%</p>
                 <p className="text-[9px] text-zinc-500 font-bold uppercase">Entrega para Seguidores</p>
              </div>
              <div className="space-y-1">
                 <p className="text-2xl font-black tracking-tighter">Em Expansão</p>
                 <p className="text-[9px] text-zinc-500 font-bold uppercase">Status de Recomendação</p>
              </div>
           </div>
           <p className="text-[10px] text-zinc-400 leading-relaxed italic">
             "Seu conteúdo é entregue primeiro para quem já te segue e depois para quem se interessa pelo tema."
           </p>
        </section>

        {/* Panel 3: Constância */}
        <section className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 border border-blue-500/10 rounded-[3rem] p-8 flex items-center gap-8">
           <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-3xl shadow-xl shadow-blue-500/20">🔥</div>
           <div className="flex-1 space-y-2">
              <h4 className="text-sm font-black uppercase text-white tracking-widest">Sequência de Evolução</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Você manteve constância esta semana. Criadores consistentes crescem de forma saudável aqui. <span className="text-blue-500 font-bold">Continue assim.</span>
              </p>
           </div>
        </section>

        {/* Panel 4: Segurança */}
        <section className="bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[2.5rem] p-8 flex justify-between items-center">
           <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-zinc-100">Status de Confiança</h4>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                {user.isFaciallyVerified ? "Identidade Protegida • IA Guardian OK" : "Pendente de Verificação Facial"}
              </p>
           </div>
           <div className={`p-3 rounded-2xl ${user.isFaciallyVerified ? 'bg-green-600/10 text-green-500' : 'bg-zinc-800 text-zinc-600'}`}>
              <Icons.Verified className="w-6 h-6" />
           </div>
        </section>

        {/* Panel 5: Voz da Comunidade */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 space-y-6">
           <div className="flex items-center gap-3">
              <span className="text-2xl">🗳️</span>
              <h3 className="text-xs font-black uppercase text-white tracking-widest">Voz da Comunidade</h3>
           </div>
           <div className="space-y-4">
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Você já votou em <strong>3 novos recursos</strong> este mês. Sua opinião está ajudando a construir a versão v4.2 do Carlin Mídia Ofic.
              </p>
              <button 
                onClick={onOpenRoadmap}
                className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
              >
                Ver recursos aprovados
              </button>
           </div>
        </section>

        <div className="text-center py-10 space-y-4">
           <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.4em] leading-relaxed">
             Não queremos ser a maior rede do mundo.<br/>Queremos ser a mais justa.
           </p>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ icon, label, value, subtext }: { icon: string, label: string, value: string, subtext: string }) => (
  <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-[2.5rem] space-y-2 hover:border-blue-500/30 transition-colors shadow-xl">
    <span className="text-2xl">{icon}</span>
    <div className="space-y-0.5">
       <p className="text-2xl font-black tracking-tighter text-white">{value}</p>
       <p className="text-[9px] font-black uppercase text-blue-500 tracking-widest">{label}</p>
    </div>
    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">{subtext}</p>
  </div>
);

export default Dashboard;
