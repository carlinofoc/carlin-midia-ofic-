
import React from 'react';

interface MonetizationInfoProps {
  onBack: () => void;
}

const MonetizationInfo: React.FC<MonetizationInfoProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-xl mx-auto space-y-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase text-blue-500">Transparência Financeira</h1>
        </div>

        <div className="space-y-4">
           <h2 className="text-3xl font-black italic uppercase leading-none">Como ganhamos dinheiro?</h2>
           <p className="text-zinc-400 text-sm font-medium leading-relaxed">
             Muitos apps lucram explorando vícios. Nós escolhemos o caminho do valor real. Veja como sustentamos o Carlin Mídia Ofic:
           </p>
        </div>

        <div className="space-y-4">
           <SourceCard 
            title="Assinatura Criador+" 
            text="Nossa principal fonte. Criadores apoiam a plataforma em troca de ferramentas avançadas e participação no desenvolvimento." 
            icon="💎"
           />
           <SourceCard 
            title="Publicidade Ética" 
            text="Aceitamos apenas marcas verificadas de Educação, Tech e Inovação. Bloqueamos cassinos, apostas e promessas enganosas." 
            icon="🎯"
           />
           <SourceCard 
            title="Taxas de Marketplace (Em breve)" 
            text="Receberemos uma pequena porcentagem sobre vendas de cursos e e-books feitos dentro da plataforma por nossos criadores." 
            icon="🛍️"
           />
        </div>

        <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] space-y-6 text-center">
           <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Independência Editorial</h4>
           <p className="text-xs text-zinc-500 leading-relaxed italic">
             "Ao diversificar nossa renda, garantimos que nenhum anunciante ou investidor possa nos obrigar a mudar o algoritmo para prejudicar a experiência do usuário."
           </p>
        </div>
      </div>
    </div>
  );
};

const SourceCard = ({ title, text, icon }: { title: string, text: string, icon: string }) => (
  <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex gap-6 items-start shadow-xl">
     <span className="text-3xl shrink-0">{icon}</span>
     <div className="space-y-2">
        <h4 className="text-xs font-black uppercase text-white tracking-widest">{title}</h4>
        <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{text}</p>
     </div>
  </div>
);

export default MonetizationInfo;
