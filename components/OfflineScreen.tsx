
import React, { useState } from 'react';
import { BrandLogo } from '../constants';

interface OfflineScreenProps {
  onRetry: () => void;
}

const OfflineScreen: React.FC<OfflineScreenProps> = ({ onRetry }) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleRetry = () => {
    setIsChecking(true);
    setTimeout(() => {
      onRetry();
      setIsChecking(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50"></div>
      
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-12">
        <div className="animate-pulse opacity-50">
          <BrandLogo size="md" />
        </div>

        <div className="space-y-6">
          <div className="w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border border-zinc-800 shadow-2xl mx-auto relative overflow-hidden">
             <span className="text-4xl">📡</span>
             <div className="absolute inset-0 border-2 border-red-500/20 rounded-[2.5rem] animate-ping"></div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Conexão Perdida</h2>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">Status: Bridge Offline</p>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Não conseguimos sincronizar com o ecossistema Carlin. <br/>
            Verifique seus dados móveis ou Wi-Fi.
          </p>
        </div>

        <div className="w-full space-y-4">
          <button 
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Sincronizando...
              </>
            ) : 'Tentar Reconectar'}
          </button>
          
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
             <p className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.2em]">
               Fallback System v3.6.0 • Local Identity Cache Active
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineScreen;
