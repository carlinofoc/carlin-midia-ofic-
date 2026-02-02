
import React from 'react';

interface ReachInfoProps {
  onClose: () => void;
}

const ReachInfo: React.FC<ReachInfoProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black z-[1000] overflow-y-auto pt-16 p-6 lg:p-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-2xl mx-auto space-y-12 pb-24">
        <div className="flex justify-between items-center">
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
              <span className="text-white text-2xl font-black italic tracking-tighter">C</span>
           </div>
           <button onClick={onClose} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="space-y-4">
           <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-[0.9]">Não competimos com ninguém. Somos uma alternativa.</h1>
           <p className="text-lg text-zinc-400 font-medium leading-relaxed">
             No Carlin Mídia Ofic, você não precisa gritar para ser visto. Você cresce com base em relevância, constância e confiança.
           </p>
        </div>

        <div className="grid gap-4">
           <InfoCard 
            icon="⚖️" 
            title="Alcance por Valor" 
            text="Nosso algoritmo prioriza o que educa ou inspira. O tamanho da conta é secundário ao valor da ideia."
           />
           <InfoCard 
            icon="🤝" 
            title="Confiança Mútua" 
            text="Não existe shadowban. Se o conteúdo respeita a comunidade, ele circula. Ponto final."
           />
           <InfoCard 
            icon="🌱" 
            title="Crescimento Gradual" 
            text="Priorizamos o criador consistente. Aqui, a pressa não vence a qualidade."
           />
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-10">
              <span className="text-6xl italic font-black">4.1</span>
           </div>
           
           <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.3em]">Visão de Futuro</h3>
           <div className="space-y-6">
              <Principle text="Crescer devagar para manter os valores." />
              <Principle text="Priorizar segurança e relevância real." />
              <Principle text="Formar uma comunidade que confia no app." />
           </div>
        </div>

        <div className="text-center space-y-6">
           <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest italic leading-relaxed">
              "Não queremos ser a maior rede do mundo.<br/>Queremos ser a mais justa."
           </p>
           <button 
             onClick={onClose}
             className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all"
           >
             Fazer parte da rede justa
           </button>
        </div>
      </div>
    </div>
  );
};

const Principle = ({ text }: { text: string }) => (
  <div className="flex gap-4 items-center">
    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
    <p className="text-sm text-zinc-200 font-medium">{text}</p>
  </div>
);

const InfoCard = ({ icon, title, text }: { icon: string, title: string, text: string }) => (
  <div className="bg-zinc-900/30 p-8 rounded-[2.5rem] border border-zinc-800 hover:border-blue-500/30 transition-all flex gap-6">
     <span className="text-3xl shrink-0">{icon}</span>
     <div className="space-y-1">
        <h4 className="text-xs font-black uppercase tracking-widest text-white">{title}</h4>
        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{text}</p>
     </div>
  </div>
);

export default ReachInfo;
