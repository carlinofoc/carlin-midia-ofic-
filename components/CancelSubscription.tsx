
import React, { useState } from 'react';

interface CancelSubscriptionProps {
  onConfirm: () => void;
  onBack: () => void;
}

const CancelSubscription: React.FC<CancelSubscriptionProps> = ({ onConfirm, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="max-w-sm w-full space-y-10 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center mx-auto border border-zinc-800 shadow-2xl">
           <span className="text-3xl">🕊️</span>
        </div>

        <div className="space-y-4">
           <h1 className="text-2xl font-black italic uppercase tracking-tighter">Cancelamento Simples</h1>
           <p className="text-zinc-500 text-sm font-medium leading-relaxed">
             Lamentamos que você esteja indo, mas respeitamos sua decisão. Você terá acesso aos benefícios do <span className="text-blue-500">Criador+</span> até o final do ciclo atual.
           </p>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-4">
           <div className="flex gap-3 items-center justify-center">
              <span className="text-green-500">✔</span>
              <p className="text-[10px] font-black uppercase text-zinc-400">Sem perguntas obrigatórias</p>
           </div>
           <div className="flex gap-3 items-center justify-center">
              <span className="text-green-500">✔</span>
              <p className="text-[10px] font-black uppercase text-zinc-400">Sem cobranças futuras</p>
           </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
           <button 
             onClick={handleCancel}
             disabled={isProcessing}
             className="w-full bg-red-600/10 border border-red-600/20 text-red-500 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
           >
             {isProcessing ? 'Processando...' : 'Confirmar Cancelamento'}
           </button>
           <button 
             onClick={onBack}
             disabled={isProcessing}
             className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl"
           >
             Manter Assinatura
           </button>
        </div>

        <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest leading-relaxed">
           O Carlin sempre terá as portas abertas para você.<br/>
           Não faremos retenção forçada.
        </p>
      </div>
    </div>
  );
};

export default CancelSubscription;
