
import React, { useState, useEffect } from 'react';
import { liteModeManager } from '../services/liteModeService';
import { LiteMode } from '../types';

const LiteLayout: React.FC = () => {
  const [usage, setUsage] = useState(liteModeManager.network.getUsedDataMB());
  const [cpu, setCpu] = useState(liteModeManager.cpu.getCpuUsage());
  const [mode, setMode] = useState<LiteMode>(liteModeManager.getLiteMode());
  const [isFlushing, setIsFlushing] = useState(false);
  const [showRulesBadge, setShowRulesBadge] = useState(false);

  useEffect(() => {
    const handleDataUpdate = (e: any) => setUsage(e.detail);
    const handleModeUpdate = (e: any) => setMode(e.detail);
    const handleRulesApplied = () => {
      setShowRulesBadge(true);
      setTimeout(() => setShowRulesBadge(false), 3000);
    };

    window.addEventListener('carlin-data-usage-updated', handleDataUpdate);
    window.addEventListener('carlin-lite-mode-changed', handleModeUpdate);
    window.addEventListener('carlin-lite-rules-applied', handleRulesApplied);
    
    const interval = setInterval(() => {
      setCpu(liteModeManager.cpu.getCpuUsage());
    }, 3000);

    return () => {
      window.removeEventListener('carlin-data-usage-updated', handleDataUpdate);
      window.removeEventListener('carlin-lite-mode-changed', handleModeUpdate);
      window.removeEventListener('carlin-lite-rules-applied', handleRulesApplied);
      clearInterval(interval);
    };
  }, []);

  const handleFlush = async () => {
    setIsFlushing(true);
    await liteModeManager.clearCache();
    setTimeout(() => setIsFlushing(false), 800);
  };

  const isAdvanced = mode === LiteMode.LITE_AVANCADO;

  return (
    <div className={`w-full ${isAdvanced ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-zinc-900/60 border-zinc-800'} border-b px-4 py-2 flex items-center justify-between gap-4 backdrop-blur-sm animate-in slide-in-from-top-4 duration-300`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isAdvanced ? 'bg-indigo-500' : 'bg-zinc-500'} animate-pulse`}></div>
        <div className="flex flex-col">
          <span className={`text-[8px] font-black ${isAdvanced ? 'text-indigo-400' : 'text-zinc-400'} uppercase tracking-widest leading-none`}>
            Carlin Lite • {isAdvanced ? 'AVANÇADO' : 'ANTIGO'}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
             <span className="text-[10px] font-black text-white italic tracking-tighter">
               {usage.toFixed(2)}MB <span className={`${isAdvanced ? 'text-indigo-300/50' : 'text-zinc-500'} font-normal`}>DATA</span>
             </span>
             {showRulesBadge && (
               <span className="text-[7px] bg-blue-500 text-white font-black px-1.5 py-0.5 rounded uppercase animate-in zoom-in duration-300">Rules Active</span>
             )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
           <span className={`text-[7px] font-black ${isAdvanced ? 'text-indigo-500' : 'text-zinc-500'} uppercase`}>CPU Load</span>
           <span className={`text-[9px] font-black ${cpu > 70 ? 'text-red-500' : (isAdvanced ? 'text-indigo-300' : 'text-zinc-300')}`}>{cpu}%</span>
        </div>
        
        <div className="flex gap-1.5">
          <button 
            onClick={handleFlush}
            disabled={isFlushing}
            className={`px-3 py-1 ${isAdvanced ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-zinc-700 hover:bg-zinc-600'} text-white rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all active:scale-95 disabled:opacity-50`}
          >
            {isFlushing ? 'Flushing...' : 'Flush Cache'}
          </button>
          <button 
            onClick={() => liteModeManager.setMode(LiteMode.NORMAL)}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all"
          >
            Standard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiteLayout;
