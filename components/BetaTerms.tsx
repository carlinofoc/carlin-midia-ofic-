
import React from 'react';

interface BetaTermsProps {
  onClose: () => void;
}

const BetaTerms: React.FC<BetaTermsProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-black text-zinc-300 p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black italic tracking-tighter uppercase text-white">Termo do Programa Beta</h1>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 space-y-8 shadow-xl">
            <div className="space-y-4">
              <p className="text-zinc-400 font-medium">O Programa Beta do Carlin Mídia Ofic permite que assinantes testem recursos e versões do aplicativo antes do lançamento oficial.</p>
              <p className="font-black text-white uppercase tracking-widest text-[11px]">Ao participar, o usuário concorda que:</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                 <span className="text-blue-500 font-black shrink-0">✔</span>
                 <p className="text-[13px] text-zinc-300">As versões beta podem conter erros ou instabilidade sistêmica.</p>
              </div>
              <div className="flex gap-4 items-start">
                 <span className="text-blue-500 font-black shrink-0">✔</span>
                 <p className="text-[13px] text-zinc-300">Os recursos testados podem ser alterados ou removidos sem aviso prévio.</p>
              </div>
              <div className="flex gap-4 items-start">
                 <span className="text-blue-500 font-black shrink-0">✔</span>
                 <p className="text-[13px] text-zinc-300">O feedback enviado pode ser usado para melhorias definitivas do app.</p>
              </div>
              <div className="flex gap-4 items-start">
                 <span className="text-blue-500 font-black shrink-0">✔</span>
                 <p className="text-[13px] text-zinc-300">A participação é voluntária e pode ser cancelada a qualquer momento.</p>
              </div>
            </div>

            <div className="p-5 bg-red-600/5 border border-red-600/10 rounded-2xl">
               <p className="text-[11px] text-red-500/80 font-medium leading-relaxed italic text-center">
                 "O Carlin Mídia Ofic não se responsabiliza por falhas temporárias em versões marcadas como Beta ou Experimental."
               </p>
            </div>
          </section>

          <div className="p-8 text-center">
             <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
               Transparência Carlin • v4.1 Labs
             </p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all"
          >
            Li e Concordo com os Termos
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetaTerms;
