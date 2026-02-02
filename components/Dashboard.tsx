
import React from 'react';
import { Post } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  posts: Post[];
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ posts, onBack }) => {
  // Mock calculations for aggregate stats
  const totalLikes = posts.reduce((acc, p) => acc + p.likes, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.comments, 0);
  const avgRelevance = posts.length > 0 ? (posts.reduce((acc, p) => acc + (p.stats?.relevanceScore || 0), 0) / posts.length).toFixed(0) : 0;
  const reachedPeople = totalLikes * 12 + 1240; // Simulated reach logic

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-xl mx-auto space-y-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Meu Impacto Real</h1>
        </div>

        <p className="text-sm text-zinc-500 font-medium leading-relaxed">
          No Carlin, não medimos apenas números frios. Medimos o valor que você entrega para a comunidade através da <span className="text-blue-500 font-black">relevância unificada.</span>
        </p>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 gap-4">
          <MetricCard 
            title="Pessoas que viram você" 
            value={reachedPeople.toLocaleString()} 
            description="Número total de vezes que seu conteúdo foi exibido em telas."
            icon="👥"
          />
          
          <div className="grid grid-cols-2 gap-4">
             <MetricCard 
                title="Interações" 
                value={(totalLikes + totalComments).toLocaleString()} 
                description="Curtidas e comentários."
                icon="💬"
              />
              <MetricCard 
                title="Selo de Qualidade" 
                value={`${avgRelevance}`} 
                description="Média de relevância unificada."
                icon="⚖️"
              />
          </div>
        </div>

        {/* Circulation Status Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest">Status de Entrega</h3>
              <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1 rounded-full">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[8px] font-black text-green-500 uppercase">Ativo</span>
              </div>
           </div>
           
           <div className="space-y-4">
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                Seus conteúdos continuam circulando organicamente. Nosso algoritmo não "mata" posts antigos se eles ainda entregarem valor para novos usuários.
              </p>
              
              <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-zinc-800/50">
                 <div className="text-2xl">✨</div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Entrega para Novos Públicos</p>
                    <p className="text-[8px] text-zinc-500 font-bold uppercase mt-1">Garantida pela Relevância v4.1</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-blue-600/5 border border-blue-600/10 p-6 rounded-3xl text-center">
           <p className="text-[9px] text-blue-400 uppercase tracking-widest font-black leading-relaxed">
             "O sucesso no Carlin não é sobre o quanto você grita, mas sobre o quanto você ajuda."
           </p>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, description, icon }: { title: string, value: string, description: string, icon: string }) => (
  <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] p-6 space-y-3 shadow-xl">
    <div className="flex justify-between items-start">
       <span className="text-2xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-2xl font-black text-white tracking-tighter">{value}</h3>
      <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mt-1">{title}</p>
    </div>
    <p className="text-[8px] text-zinc-600 font-medium uppercase leading-tight">{description}</p>
  </div>
);

export default Dashboard;
