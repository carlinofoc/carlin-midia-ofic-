
import React from 'react';

interface CreatorPlusFAQProps {
  onBack: () => void;
}

const CreatorPlusFAQ: React.FC<CreatorPlusFAQProps> = ({ onBack }) => {
  const faqs = [
    {
      q: "O Criador+ aumenta meu alcance?",
      a: "Não. O Carlin preza pela meritocracia do conteúdo. A assinatura oferece ferramentas extras, mas não interfere no algoritmo de entrega."
    },
    {
      q: "O que é o Programa Beta?",
      a: "É um laboratório onde você testa novos recursos (como AR ou novos filtros) antes do lançamento público, ajudando a moldar o app."
    },
    {
      q: "Posso cancelar quando quiser?",
      a: "Sim. O cancelamento é feito em dois cliques, sem multas ou burocracia. Você mantém o acesso até o fim do período pago."
    },
    {
      q: "Por que cobrar uma assinatura?",
      a: "Para manter o Carlin livre de anúncios invasivos (como cassinos) e sustentar servidores de alta performance focados em criadores reais."
    },
    {
      q: "Como funcionam as votações?",
      a: "No Centro Beta, listamos ideias de novos recursos. Assinantes votam e comentam, definindo a prioridade do nosso time de engenharia."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-xl mx-auto space-y-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">FAQ Criador+</h1>
        </div>

        <div className="space-y-6">
          {faqs.map((item, i) => (
            <div key={i} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-3">
              <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest leading-relaxed">
                {item.q}
              </h3>
              <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] text-center">
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
             Dúvida não listada? <br/>
             <span className="text-blue-500">suporte@carlin.ofic</span>
           </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorPlusFAQ;
