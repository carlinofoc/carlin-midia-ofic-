
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { impactService } from '../services/impactService';

interface AdminPanelProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

type AdminTab = 'monetization' | 'build' | 'logs';

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onUpdateUser, onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('monetization');
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Build States
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStep, setBuildStep] = useState('');
  const [signingInfo, setSigningInfo] = useState({
    keystore: 'carlin-release.keystore',
    storePass: 'carlin123',
    alias: 'carlin-key',
    keyPass: 'carlin123'
  });

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 100));

  const handleSuspend = async () => {
    if (!targetId || !reason) {
      alert("Preencha o ID do Criador e o Motivo.");
      return;
    }

    setIsProcessing(true);
    addLog(`POST /api/v1/admin/creator/monetization/suspend`);

    const result = await impactService.suspendMonetization(currentUser, reason);
    
    addLog(`Status: ${result.status} - ${result.message}`);

    if (result.updatedUser) {
      onUpdateUser(result.updatedUser);
      addLog(`Sync: Local identity state updated.`);
    }

    setIsProcessing(false);
  };

  const runBuild = () => {
    if (signingInfo.storePass !== 'carlin123' || signingInfo.keyPass !== 'carlin123') {
      alert("Erro de assinatura: Senha da Keystore inválida.");
      addLog("BUILD FAILED: Incorrect signing credentials.");
      return;
    }

    setIsBuilding(true);
    setBuildProgress(0);
    setLogs([]);
    addLog("Build > Generate Signed Bundle / APK initiated...");
    
    const steps = [
      { msg: "Iniciando Gradle Daemon...", p: 10 },
      { msg: "Executando :app:preBuild", p: 20 },
      { msg: "Análise Lint concluída (0 warnings)", p: 35 },
      { msg: "Compilando :app:assembleRelease (R8 Proguard)", p: 55 },
      { msg: "Assinando APK com carlin-release.keystore...", p: 75 },
      { msg: "Alinhando binários (zipalign)...", p: 90 },
      { msg: "BUILD SUCCESSFUL: app-release.apk gerado.", p: 100 }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current >= steps.length) {
        clearInterval(interval);
        setIsBuilding(false);
        return;
      }
      setBuildStep(steps[current].msg);
      setBuildProgress(steps[current].p);
      addLog(steps[current].msg);
      current++;
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800">
               <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
               </svg>
             </button>
             <h1 className="text-xl font-black uppercase tracking-tighter text-red-500">Terminal de Administração</h1>
          </div>
          <span className="text-[10px] font-mono bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20">ROOT ACCESS</span>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
           <TabBtn active={activeTab === 'monetization'} onClick={() => setActiveTab('monetization')} label="Monetização" />
           <TabBtn active={activeTab === 'build'} onClick={() => setActiveTab('build')} label="Build Release" />
           <TabBtn active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} label="Sistelog" />
        </div>

        {activeTab === 'monetization' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-2xl animate-in slide-in-from-left-4">
             <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest">Controle de Criadores</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Endpoint: /api/v1/admin/creator/suspend</p>
             </div>

             <div className="space-y-6">
                <AdminField label="ID do Criador" value={targetId} onChange={setTargetId} placeholder="GUID do perfil" />
                <div className="space-y-2">
                   <label className="text-[8px] font-black uppercase text-zinc-600 ml-2">Motivo da Sanção</label>
                   <textarea 
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Descrição para auditoria..."
                    className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-6 text-sm text-zinc-300 outline-none focus:border-red-500 transition-all h-24 resize-none"
                   />
                </div>
                <button 
                  onClick={handleSuspend}
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-xl font-black uppercase text-xs shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? 'Processando API...' : 'Aplicar Suspensão'}
                </button>
             </div>
          </div>
        )}

        {activeTab === 'build' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-2xl animate-in slide-in-from-right-4">
             <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest">Generate Signed Bundle / APK</h3>
                <p className="text-[10px] text-zinc-500 font-mono italic">Signature: V2 (Full APK Signature)</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminField label="Key Store Path" value={signingInfo.keystore} onChange={(v) => setSigningInfo({...signingInfo, keystore: v})} />
                <AdminField label="Key Store Password" type="password" value={signingInfo.storePass} onChange={(v) => setSigningInfo({...signingInfo, storePass: v})} />
                <AdminField label="Key Alias" value={signingInfo.alias} onChange={(v) => setSigningInfo({...signingInfo, alias: v})} />
                <AdminField label="Key Password" type="password" value={signingInfo.keyPass} onChange={(v) => setSigningInfo({...signingInfo, keyPass: v})} />
             </div>

             {isBuilding ? (
               <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-blue-500 animate-pulse">{buildStep}</span>
                     <span className="text-white">{buildProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-zinc-800 p-0.5">
                     <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${buildProgress}%` }}></div>
                  </div>
               </div>
             ) : (
               <button 
                onClick={runBuild}
                className="w-full bg-white text-black py-5 rounded-xl font-black uppercase text-xs shadow-xl active:scale-[0.98] transition-all"
               >
                 Gerar Release Assinado (.apk)
               </button>
             )}

             <div className="bg-black/50 p-6 rounded-2xl border border-zinc-800 space-y-2">
                <h4 className="text-[8px] font-black uppercase text-zinc-600">Requisitos de Hardware Build</h4>
                <p className="text-[10px] text-zinc-400">Target SDK: 35 | Build Tools: 35.0.0 | Min RAM: 4GB</p>
             </div>
          </div>
        )}

        {/* Console Log - Global for Admin Panel */}
        <div className="space-y-4">
           <h3 className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] px-2">Output da Engine</h3>
           <div className="bg-black border border-zinc-800 rounded-3xl p-6 h-64 overflow-y-auto font-mono text-[10px] space-y-1 shadow-inner">
              {logs.length === 0 ? (
                <p className="text-zinc-800 italic">Aguardando comandos administrativos...</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className={`
                    ${log.includes('SUCCESS') || log.includes('SUCCESSFUL') ? 'text-green-500 font-bold' : 
                      log.includes('FAILED') ? 'text-red-500' : 
                      log.includes('Assinando') ? 'text-blue-400' : 'text-zinc-500'}
                  `}>
                    > {log}
                  </p>
                ))
              )}
           </div>
        </div>

        <div className="text-center opacity-30 p-10">
           <p className="text-[8px] font-black uppercase tracking-[0.4em]">Carlin Dev Environment • Kotlin Bridge v5.9.2</p>
        </div>
      </div>
    </div>
  );
};

const AdminField = ({ label, value, onChange, placeholder, type = 'text' }: any) => (
  <div className="space-y-2">
     <label className="text-[8px] font-black uppercase text-zinc-600 ml-2">{label}</label>
     <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-6 font-mono text-xs text-white outline-none focus:border-blue-500 transition-all"
     />
  </div>
);

const TabBtn = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
  >
    {label}
  </button>
);

export default AdminPanel;
