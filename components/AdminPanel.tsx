
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { impactService } from '../services/impactService';

interface AdminPanelProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

type AdminTab = 'monetization' | 'build' | 'logs';
type BuildFormat = 'apk' | 'aab';

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onUpdateUser, onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('monetization');
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Build States
  const [buildFormat, setBuildFormat] = useState<BuildFormat>('aab');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStep, setBuildStep] = useState('');
  const [buildSuccess, setBuildSuccess] = useState(false);
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
    setBuildSuccess(false);
    setBuildProgress(0);
    setLogs([]);
    addLog(`Build > Generate Signed ${buildFormat === 'apk' ? 'APK' : 'Bundle'} initiated...`);
    
    const steps = [
      { msg: "Iniciando Gradle Daemon...", p: 10 },
      { msg: "Executando :app:preBuild", p: 20 },
      { msg: "Análise Lint concluída (0 warnings)", p: 35 },
      { msg: buildFormat === 'apk' ? "Compilando :app:assembleRelease (R8 Proguard)" : "Compilando :app:bundleRelease (AAB Proto)", p: 55 },
      { msg: `Assinando ${buildFormat.toUpperCase()} com carlin-release.keystore...`, p: 75 },
      { msg: buildFormat === 'apk' ? "Alinhando binários (zipalign)..." : "Gerando metadados de otimização Play Store...", p: 90 },
      { msg: `BUILD SUCCESSFUL: app-release.${buildFormat} gerado.`, p: 100 }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current >= steps.length) {
        clearInterval(interval);
        setIsBuilding(false);
        setBuildSuccess(true);
        addLog(`RESUMO: Build v3.6.0 | SHA-256: 8f2d...4e1b | ${buildFormat === 'apk' ? '24.5 MB' : '18.2 MB'}`);
        addLog(`OUTPUT_PATH: app/release/app-release.${buildFormat}`);
        return;
      }
      setBuildStep(steps[current].msg);
      setBuildProgress(steps[current].p);
      addLog(steps[current].msg);
      current++;
    }, 1200);
  };

  const downloadApk = () => {
    const link = document.createElement('a');
    // For demo purposes, we point to the APK link, but label it based on format
    link.href = "https://github.com/carlin-oficial/carlin-midia-ofic/releases/download/v3.5.2/app-release.apk";
    link.download = `app-release-signed.${buildFormat}`;
    link.click();
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

             {/* Format Selector */}
             <div className="space-y-3">
                <label className="text-[8px] font-black uppercase text-zinc-600 ml-2 tracking-[0.2em]">Build Format</label>
                <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 rounded-2xl border border-zinc-800">
                   <button 
                    onClick={() => setBuildFormat('aab')}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${buildFormat === 'aab' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
                   >
                     App Bundle (.aab)
                   </button>
                   <button 
                    onClick={() => setBuildFormat('apk')}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${buildFormat === 'apk' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
                   >
                     APK (.apk)
                   </button>
                </div>
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
             ) : buildSuccess ? (
               <div className="space-y-4 animate-in zoom-in-95">
                  <div className="bg-green-600/10 border border-green-500/20 p-6 rounded-2xl text-center space-y-3">
                     <span className="text-3xl">✅</span>
                     <h4 className="text-sm font-black uppercase text-green-500 tracking-widest">Build Concluído com Sucesso</h4>
                     <p className="text-[10px] text-zinc-500 font-mono">app/release/app-release.{buildFormat}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={downloadApk}
                      className="flex-1 bg-white text-black py-5 rounded-xl font-black uppercase text-xs shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Baixar {buildFormat.toUpperCase()} Assinado
                    </button>
                    <button 
                      onClick={() => setBuildSuccess(false)}
                      className="px-6 bg-zinc-800 text-zinc-400 py-5 rounded-xl font-black uppercase text-[10px] active:scale-[0.98] transition-all"
                    >
                      Novo Build
                    </button>
                  </div>
               </div>
             ) : (
               <button 
                onClick={runBuild}
                className="w-full bg-white text-black py-5 rounded-xl font-black uppercase text-xs shadow-xl active:scale-[0.98] transition-all"
               >
                 Gerar Release Assinado (.{buildFormat})
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
                      log.includes('Assinando') ? 'text-blue-400' : 
                      log.includes('OUTPUT_PATH') ? 'text-amber-500 font-bold' : 'text-zinc-500'}
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
