
import React from 'react';

interface DeveloperInfoProps {
  onBack: () => void;
  onOpenRoadmap: () => void;
}

const DeveloperInfo: React.FC<DeveloperInfoProps> = ({ onBack, onOpenRoadmap }) => {
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
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none text-blue-500">Bastidores</h1>
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">Desenvolvimento Solo</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4">
           <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] mx-auto flex items-center justify-center border border-zinc-800 shadow-2xl overflow-hidden ring-4 ring-blue-600/20">
              <span className="text-4xl">👨‍💻</span>
           </div>
           <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">Uma mente independente,<br/>uma rede coletiva.</h2>
        </div>

        {/* Content Section */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-8 space-y-8 shadow-xl">
           <div className="space-y-6 text-sm text-zinc-300 leading-relaxed font-medium">
              <p>
                O <strong>Carlin Mídia Ofic</strong> não é propriedade de uma grande corporação de tecnologia. Ele é fruto do trabalho de um <strong>único programador independente</strong>.
              </p>
              <p>
                Cada linha de código, cada atualização e cada decisão técnica são realizadas de forma artesanal, com o objetivo de criar uma alternativa justa e transparente no cenário digital atual.
              </p>
              <p className="bg-blue-600/10 border-l-4 border-blue-600 p-4 italic text-white rounded-r-2xl">
                "Este projeto é a união de estudos avançados em Marketing Digital Tecnológico com a vontade de devolver o controle da rede aos seus usuários."
              </p>
           </div>
        </section>

        {/* Community Power */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-[2.5rem] space-y-2">
              <span className="text-2xl">🗳️</span>
              <h4 className="text-xs font-black uppercase text-white tracking-widest">Roadmap Coletivo</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">
                Você não apenas usa o app; você o direciona. As sugestões mais votadas tornam-se prioridade técnica.
              </p>
           </div>
           <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-[2.5rem] space-y-2">
              <span className="text-2xl">🛡️</span>
              <h4 className="text-xs font-black uppercase text-white tracking-widest">Confiança Direta</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">
                Sem intermediários. A transparência é total sobre como o algoritmo funciona e como seus dados são protegidos.
              </p>
           </div>
        </section>

        {/* Educational/Marketing Link */}
        <section className="bg-blue-600 border border-blue-400 rounded-[3rem] p-10 space-y-6 shadow-2xl shadow-blue-600/20">
           <div className="flex items-center gap-3">
              <span className="text-2xl text-white">🎓</span>
              <h3 className="text-xs font-black uppercase text-white tracking-[0.3em]">Base Tecnológica</h3>
           </div>
           <p className="text-xs text-white/90 font-black uppercase tracking-widest leading-relaxed">
             O Carlin serve como um laboratório vivo de Marketing Digital Ético e Engenharia de Software voltada para o bem-estar humano.
           </p>
        </section>

        {/* Final Message */}
        <div className="text-center space-y-6 pt-4">
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em] leading-relaxed">
             Feito com propósito.<br/>Desenvolvido para você.
           </p>
           <button 
             onClick={onOpenRoadmap}
             className="w-full bg-zinc-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all border border-zinc-700 shadow-xl"
           >
             Influenciar o Desenvolvimento
           </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperInfo;
