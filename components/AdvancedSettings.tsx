
import React, { useState, useEffect } from 'react';
import { User, LiteConfig } from '../types';
import { Icons } from '../constants';
import { liteModeManager } from '../services/liteModeService';

interface AdvancedSettingsProps {
  user: User;
  onBack: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  isLite: boolean;
  onToggleLite: () => void;
  liteConfig: LiteConfig;
  onUpdateLiteConfig: (config: LiteConfig) => void;
  onOpenSecurityCenter: () => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ 
  user, onBack, isDark, onToggleDark, isLite, onToggleLite, liteConfig, onUpdateLiteConfig, onOpenSecurityCenter 
}) => {
  const [currentUsage, setCurrentUsage] = useState(liteModeManager.network.getUsedDataMB());
  const [memoryUsage, setMemoryUsage] = useState(liteModeManager.getMemoryStatus());
  const [isWeak, setIsWeak] = useState(liteModeManager.isConnectionWeak());
  const [cpuUsage, setCpuUsage] = useState(liteModeManager.cpu.getCpuUsage());
  const [autoStatus, setAutoStatus] = useState(liteModeManager.auto.getStatus());

  useEffect(() => {
    const handleDataUpdate = (e: any) => setCurrentUsage(e.detail);
    const handleMemUpdate = (e: any) => setMemoryUsage(e.detail);
    
    window.addEventListener('carlin-data-usage-updated', handleDataUpdate);
    window.addEventListener('carlin-memory-updated', handleMemUpdate);

    const statsInterval = setInterval(() => {
      setIsWeak(liteModeManager.isConnectionWeak());
      setCpuUsage(liteModeManager.cpu.getCpuUsage());
      setAutoStatus(liteModeManager.auto.getStatus());
      setMemoryUsage(liteModeManager.getMemoryStatus());
    }, 2000);
    
    return () => {
      window.removeEventListener('carlin-data-usage-updated', handleDataUpdate);
      window.removeEventListener('carlin-memory-updated', handleMemUpdate);
      clearInterval(statsInterval);
    };
  }, []);

  const updateConfig = (key: keyof LiteConfig, value: any) => {
    onUpdateLiteConfig({ ...liteConfig, [key]: value });
  };

  const usagePercent = Math.min(100, (currentUsage / liteConfig.maxDataUsageMB) * 100);
  const memPercent = Math.min(100, (memoryUsage.used / memoryUsage.max) * 100);

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
          <div className="text-right">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Opções Avançadas</h1>
            <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Hierarquia LiteManager v5.5</span>
          </div>
        </div>

        {/* System Architecture Visualization */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
           <ManagerStatus label="Network" active={!isWeak} icon="📡" sub={isWeak ? 'LOW' : 'STABLE'} />
           <ManagerStatus label="Memory" active={memPercent < 90} icon="🧠" sub={`${memoryUsage.max}MB`} />
           <ManagerStatus label="CPU" active={cpuUsage < 70} icon="⚡" sub={`${cpuUsage}% Load`} />
           <ManagerStatus label="Auto-Ctrl" active={autoStatus.active} icon="🤖" sub={autoStatus.active ? 'AUTO' : 'IDLE'} />
        </div>

        {/* Auto Controller Message */}
        {autoStatus.active && (
          <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl animate-pulse">
             <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest text-center">
               Auto-Optimization Active: {autoStatus.reason}
             </p>
          </div>
        )}

        {/* Lite Engine Configuration Section */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
           <div className="px-8 py-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <span className="text-xl">🚀</span>
                 <h3 className="text-xs font-black uppercase tracking-widest text-white">Carlin Lite Engine</h3>
              </div>
              <button 
                onClick={onToggleLite}
                className={`w-12 h-6 rounded-full relative transition-all ${isLite ? 'bg-blue-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${isLite ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>

           <div className={`p-8 space-y-6 transition-opacity ${!isLite ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 p-5 rounded-3xl border border-zinc-800/50 space-y-3">
                   <div className="flex justify-between items-start">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Network Monitor</p>
                      <button onClick={() => liteModeManager.network.resetUsage()} className="text-[8px] font-black text-blue-500 hover:text-white uppercase transition-colors">Reset</button>
                   </div>
                   <p className="text-sm font-black text-white italic tracking-tighter">
                     {currentUsage.toFixed(2)} MB <span className="text-zinc-600 font-normal text-[10px] uppercase">/ {liteConfig.maxDataUsageMB} MB</span>
                   </p>
                   <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${usagePercent > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                   </div>
                </div>

                <div className="bg-black/40 p-5 rounded-3xl border border-zinc-800/50 space-y-3">
                   <div className="flex justify-between items-start">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Memory Manager</p>
                      <span className="text-[8px] font-black text-blue-500 uppercase">LRU Active</span>
                   </div>
                   <p className="text-sm font-black text-white italic tracking-tighter">
                     {memoryUsage.used.toFixed(1)} MB <span className="text-zinc-600 font-normal text-[10px] uppercase">/ {memoryUsage.max} MB</span>
                   </p>
                   <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${memPercent > 80 ? 'bg-orange-500' : 'bg-indigo-500'}`}
                        style={{ width: `${memPercent}%` }}
                      ></div>
                   </div>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-zinc-400">Quota de Dados (MB)</label>
                    <span className="text-xs font-black text-blue-500 italic tracking-tighter">{liteConfig.maxDataUsageMB} MB</span>
                  </div>
                  <div className="flex gap-2">
                    {[5, 10, 15].map(val => (
                      <button key={val} onClick={() => updateConfig('maxDataUsageMB', val)} className={`flex-1 py-2 rounded-xl border text-[10px] font-black transition-all ${liteConfig.maxDataUsageMB === val ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-black border-zinc-800 text-zinc-500'}`}>{val} MB</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-zinc-400">RAM Local Reservada (GB)</label>
                    <span className="text-xs font-black text-blue-500 italic tracking-tighter">{liteConfig.maxRamUsageGB} GB</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(val => (
                      <button key={val} onClick={() => updateConfig('maxRamUsageGB', val)} className={`flex-1 py-2 rounded-xl border text-[10px] font-black transition-all ${liteConfig.maxRamUsageGB === val ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-black border-zinc-800 text-zinc-500'}`}>{val} GB</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-zinc-400">CPU Monitor Throttling (%)</label>
                      <span className="text-xs font-black text-blue-500 italic tracking-tighter">{liteConfig.cpuLimitPercent}%</span>
                   </div>
                   <input type="range" min="20" max="80" step="10" value={liteConfig.cpuLimitPercent} onChange={(e) => updateConfig('cpuLimitPercent', parseInt(e.target.value))} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-zinc-800">
                 <ToggleOption label="Redução de Imagem (Glide)" desc="Otimiza recursos via CacheManager e NetworkMonitor." active={liteConfig.reduceImageQuality} onToggle={() => updateConfig('reduceImageQuality', !liteConfig.reduceImageQuality)} />
                 <ToggleOption label="Throttling de Vídeo" desc="CpuManager desabilita autoplay em baixa performance." active={liteConfig.disableAutoPlayVideos} onToggle={() => updateConfig('disableAutoPlayVideos', !liteConfig.disableAutoPlayVideos)} />
                 <ToggleOption label="LiteAutoController" desc="Ativa otimizações automaticamente em conexões instáveis." active={liteConfig.aggressiveCache} onToggle={() => updateConfig('aggressiveCache', !liteConfig.aggressiveCache)} />
              </div>
           </div>
        </section>

        <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] text-center space-y-4">
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
             Arquitetura LiteManager v5.5.0 (Stable)<br/>
             Sub-sistemas independentes integrados.
           </p>
        </div>
      </div>
    </div>
  );
};

const ManagerStatus = ({ label, active, icon, sub }: { label: string, active: boolean, icon: string, sub: string }) => (
  <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-2xl flex flex-col items-center gap-1 text-center shadow-lg transition-all">
     <span className="text-lg">{icon}</span>
     <span className="text-[8px] font-black uppercase text-white leading-none">{label}</span>
     <span className={`text-[7px] font-black uppercase ${active ? 'text-blue-500' : 'text-red-500'}`}>{sub}</span>
  </div>
);

const ToggleOption = ({ label, desc, active, onToggle, disabled = false }: { label: string, desc: string, active: boolean, onToggle: () => void, disabled?: boolean }) => (
  <div className={`flex items-center justify-between p-6 rounded-3xl hover:bg-zinc-800/50 transition-colors ${disabled ? 'opacity-40' : ''}`}>
    <div className="flex-1 pr-6 space-y-1">
       <h4 className="text-xs font-black uppercase text-white tracking-widest">{label}</h4>
       <p className="text-[10px] text-zinc-500 leading-tight">{desc}</p>
    </div>
    <button onClick={onToggle} disabled={disabled} className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-blue-600' : 'bg-zinc-700'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

export default AdvancedSettings;
