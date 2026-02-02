
import React from 'react';

interface ReachInfoProps {
  onClose: () => void;
}

const ReachInfo: React.FC<ReachInfoProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black z-[1000] overflow-y-auto pt-16 p-6 lg:p-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-2xl mx-auto space-y-12 pb-24">
        <div className="flex justify-between items-center">
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-black">C</span>
           </div>
           <button onClick={onClose} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="space-y-4">
           <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">Uma plataforma criada para quem cria</h1>
           <p className="text-xl text-zinc-400 font-medium leading-relaxed">
             O Carlin Mídia Ofic nasceu para resolver um problema real: criadores produzindo conteúdo de valor e sendo invisibilizados por algoritmos fechados.
           </p>
        </div>

        <div className="grid gap-6">
           <InfoCard 
            icon="⚖️" 
            title="Alcance por Relevância" 
            text="Aqui, o conteúdo não compete contra o tamanho da conta. Ele encontra quem realmente se interessa pelo tema."
           />
           <InfoCard 
            icon="🚫" 
            title="Zero Shadowban" 
            text="Não trabalhamos com bloqueios ocultos. Se o seu conteúdo respeita as diretrizes, ele é entregue sem interferência artificial."
           />
           <InfoCard 
            icon="🔄" 
            title="Circulação Perpétua" 
            text="Não matamos conteúdos com o tempo. Conteúdos úteis continuam sendo recomendados enquanto forem relevantes."
           />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 space-y-6">
           <h3 className="text-lg font-black uppercase text-blue-500 tracking-widest">Nosso Compromisso</h3>
           <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                 <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                 </div>
                 <p className="text-zinc-300 font-medium">Entrega prioritária para seguidores reais.</p>
              </li>
              <li className="flex gap-4 items-start">
                 <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                 </div>
                 <p className="text-zinc-300 font-medium">Recomendação para novos públicos por interesse real.</p>
              </li>
              <li className="flex gap-4 items-start">
                 <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                 </div>
                 <p className="text-zinc-300 font-medium">Tratamento igual para criadores pequenos e grandes.</p>
              </li>
           </ul>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-white text-black py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
        >
          Entendi, vamos começar
        </button>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, text }: { icon: string, title: string, text: string }) => (
  <div className="flex gap-6 p-6 hover:bg-zinc-900 rounded-[2rem] transition-colors border border-transparent hover:border-zinc-800">
     <span className="text-4xl shrink-0">{icon}</span>
     <div className="space-y-1">
        <h4 className="text-lg font-black italic tracking-tighter text-white uppercase">{title}</h4>
        <p className="text-sm text-zinc-500 leading-relaxed">{text}</p>
     </div>
  </div>
);

export default ReachInfo;
