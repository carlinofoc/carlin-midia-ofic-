
import React from 'react';
import { RoadmapItem } from '../types';

interface RoadmapProps {
  onBack: () => void;
}

const ROADMAP_DATA: RoadmapItem[] = [
  { id: '1', title: 'Modo Realidade Aumentada', description: 'Posts interativos em 3D usando a câmera nativa.', status: 'planned' },
  { id: '2', title: 'Métricas de Valor Social', description: 'Painel que mostra quanto seu conteúdo ajudou pessoas.', status: 'development' },
  { id: '3', title: 'Voz em Tempo Real', description: 'Tradução automática de vídeos para criadores globais.', status: 'testing' },
  { id: '4', title: 'Marketplace de Ativos', description: 'Venda direta de presets e filtros criados por usuários.', status: 'planned' },
  { id: '5', title: 'API de Transparência v2', description: 'Relatórios públicos sobre a saúde do algoritmo.', status: 'development' },
];

const Roadmap: React.FC<RoadmapProps> = ({ onBack }) => {
  const categories = [
    { id: 'planned', label: 'Planejado', icon: '📝', color: 'bg-zinc-800' },
    { id: 'development', label: 'Em Desenvolvimento', icon: '⚡', color: 'bg-blue-600' },
    { id: 'testing', label: 'Em Teste (Beta)', icon: '🧪', color: 'bg-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase text-blue-500">Público • Roadmap</h1>
        </div>

        <div className="space-y-4">
           <h2 className="text-3xl font-black italic tracking-tighter uppercase">Rumo ao Futuro</h2>
           <p className="text-zinc-400 text-sm leading-relaxed">
             Transparência total sobre o que estamos construindo. Aqui você acompanha a evolução do Carlin em tempo real.
           </p>
        </div>

        <div className="space-y-12">
           {categories.map(cat => (
             <div key={cat.id} className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center text-sm`}>{cat.icon}</div>
                   <h3 className="text-xs font-black uppercase tracking-[0.2em]">{cat.label}</h3>
                </div>
                
                <div className="grid gap-4">
                   {ROADMAP_DATA.filter(item => item.status === cat.id).map(item => (
                     <div key={item.id} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-2 hover:border-zinc-700 transition-colors group">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-blue-400 transition-colors">{item.title}</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{item.description}</p>
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </div>

        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] text-center space-y-4">
           <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic">"Assinantes Criador+ podem sugerir e votar nestes recursos no LABS."</p>
           <button onClick={onBack} className="text-[10px] text-blue-500 font-black uppercase tracking-widest hover:underline">Fazer parte do desenvolvimento</button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
