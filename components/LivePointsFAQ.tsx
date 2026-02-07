
import React from 'react';

interface LivePointsFAQProps {
  onClose: () => void;
}

const FAQ_DATA = [
  {
    q: "Como ganho pontos assistindo a uma live?",
    a: "Assistindo à live por 5 minutos consecutivos você recebe automaticamente 300 pontos."
  },
  {
    q: "O que posso fazer com os pontos?",
    a: "Você pode doar os pontos ao criador da live para aumentar o engajamento e o alcance dela."
  },
  {
    q: "Quanto o engajamento aumenta?",
    a: "Cada doação de 300 pontos aumenta o engajamento da live em 1% no algoritmo de recomendação."
  },
  {
    q: "Existe um limite de impulso por live?",
    a: "Sim. O impulso por pontos é limitado a um teto de 30% (9.000 pontos totais) por live para garantir que o engajamento orgânico real continue sendo a prioridade."
  },
  {
    q: "Os pontos valem para sempre?",
    a: "Não. Os pontos expiram automaticamente quando a live termina."
  },
  {
    q: "Isso gera dinheiro direto para o criador?",
    a: "Não diretamente. O boost influencia a recomendação algorítmica, aumentando o público, não a receita imediata."
  }
];

const LivePointsFAQ: React.FC<LivePointsFAQProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/95 z-[2000] flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md max-h-[80vh] flex flex-col rounded-[3rem] shadow-3xl overflow-hidden">
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <span className="text-2xl">💡</span>
             <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Manual de Pontos</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 hide-scrollbar">
          <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-3xl mb-4">
             <p className="text-[9px] font-black uppercase text-blue-400 tracking-[0.2em] mb-2">🚀 Objetivo Principal</p>
             <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
               Impulsionar o alcance orgânico das lives para acelerar as metas de monetização dos seus criadores favoritos.
             </p>
          </div>

          {FAQ_DATA.map((item, i) => (
            <div key={i} className="space-y-2 border-l-2 border-blue-600/30 pl-4 py-1">
               <h4 className="text-[11px] font-black uppercase text-blue-400 tracking-widest leading-relaxed">{item.q}</h4>
               <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">{item.a}</p>
            </div>
          ))}

          <div className="bg-orange-600/5 border border-orange-500/20 p-5 rounded-3xl mt-4">
             <p className="text-[9px] font-black uppercase text-orange-400 tracking-[0.2em] mb-2">🚨 Regra de Governança</p>
             <p className="text-[10px] text-zinc-500 leading-relaxed italic">
               O impulso por pontos atua como um multiplicador temporário e não substitui o engajamento orgânico real. O teto de 30% assegura a integridade do algoritmo.
             </p>
          </div>
        </div>

        <div className="p-8 pt-4 shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl"
          >
            Entendi, voltar à Live
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivePointsFAQ;
