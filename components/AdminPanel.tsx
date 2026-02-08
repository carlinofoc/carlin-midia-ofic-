
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { impactService } from '../services/impactService';

interface AdminPanelProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

type AdminTab = 'monetization' | 'terminal' | 'build' | 'vcs';
type BuildFormat = 'apk' | 'aab';

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onUpdateUser, onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('terminal');
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>(["Carlin OS v5.9.2-stable (aarch64)", "Type 'help' for available commands."]);
  
  // Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [currentDir, setCurrentDir] = useState('~/carlin-midia-ofic');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Build States
  const [buildFormat, setBuildFormat] = useState<BuildFormat>('apk');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStep, setBuildStep] = useState('');
  const [buildSuccess, setBuildSuccess] = useState(false);
  const [generatedFileName, setGeneratedFileName] = useState('');

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const executeCommand = (cmd: string) => {
    const fullCmd = cmd.trim();
    if (!fullCmd) return;

    addLog(`[[b;##3b82f6;]${currentDir}] $ ${fullCmd}`);
    const args = fullCmd.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        addLog("Comandos disponíveis: ls, cd, pwd, clear, git, ./build_apk.sh, build_apk.bat, whoami, exit");
        break;
      case 'clear':
        setLogs([]);
        break;
      case 'whoami':
        addLog(currentUser.username + " (root)");
        break;
      case 'pwd':
        addLog(currentDir);
        break;
      case 'ls':
        addLog("android/  ios/  src/  public/  build_apk.sh  build_apk.bat  package.json");
        break;
      case 'git':
        if (args[1] === 'status') {
          addLog("On branch main. Your branch is up to date with 'origin/main'.");
          addLog("nothing to commit, working tree clean");
        } else {
          addLog("Usage: git status, git pull, git push");
        }
        break;
      case './build_apk.sh':
      case 'build_apk.bat':
        setActiveTab('build');
        runBuild(command === 'build_apk.bat' ? 'Windows (CMD)' : 'Linux (Bash)');
        break;
      case 'cd':
        if (args[1]) {
           setCurrentDir(args[1] === '..' ? '~/carlin-midia-ofic' : `${currentDir}/${args[1]}`);
        }
        break;
      default:
        addLog(`sh: command not found: ${command}`);
    }
    setTerminalInput('');
  };

  const runBuild = (env: string) => {
    setIsBuilding(true);
    setBuildSuccess(false);
    setBuildProgress(0);
    
    const appName = "CarlinMidiaOfic";
    const dateStr = new Date().toISOString().split('T')[0];
    const finalFileName = `${appName}-${dateStr}.apk`;
    setGeneratedFileName(finalFileName);

    const isWin = env.includes('Windows');

    const steps = [
      { msg: `🚀 Build iniciado: ${appName} (${env})`, p: 5 },
      { msg: "📂 Entering directory: android/", p: 15 },
      { msg: isWin ? "🧹 Cleaning build cache (call gradlew.bat clean)..." : "🧹 Limpando cache (./gradlew clean)...", p: 30 },
      { msg: isWin ? "🏗️ Compilando :app:assembleRelease (call gradlew.bat)..." : "🏗️ Compilando :app:assembleRelease (./gradlew)...", p: 55 },
      { msg: "🧧 Assinando binário com V2 Signature...", p: 75 },
      { msg: isWin 
          ? `📦 Cópia: copy .\\android\\app\\build\\outputs\\apk\\release\\app-release.apk ..\\${finalFileName}`
          : `📦 Cópia: cp ./android/app/build/outputs/apk/release/app-release.apk ./${finalFileName}`, p: 90 },
      { msg: "✅ APK GERADO COM SUCESSO!", p: 100 }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current >= steps.length) {
        clearInterval(interval);
        setIsBuilding(false);
        setBuildSuccess(true);
        addLog(`BUILD SUCCESSFUL [${env}]`);
        addLog(`📍 Artefato: ./${finalFileName}`);
        return;
      }
      setBuildStep(steps[current].msg);
      setBuildProgress(steps[current].p);
      addLog(steps[current].msg);
      current++;
    }, 1000);
  };

  const handleSuspend = async () => {
    if (!targetId || !reason) return alert("Preencha todos os campos.");
    setIsProcessing(true);
    const result = await impactService.suspendMonetization(currentUser, reason);
    addLog(`API_CALL: /admin/creator/suspend -> ${result.status}`);
    if (result.updatedUser) onUpdateUser(result.updatedUser);
    setIsProcessing(false);
    setTargetId('');
    setReason('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-10 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 text-zinc-400">
               <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
               </svg>
             </button>
             <div>
                <h1 className="text-xl font-black uppercase tracking-tighter text-red-600">Admin Console</h1>
                <p className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">Host: carlin-v5-prod-01</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-green-500 uppercase">System Status: OK</span>
                <span className="text-[6px] font-mono text-zinc-600">UPTIME: 142:52:10</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold text-xs">ROOT</div>
          </div>
        </div>

        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 overflow-x-auto hide-scrollbar">
           <TabBtn active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} label="Terminal" icon=">_" />
           <TabBtn active={activeTab === 'build'} onClick={() => setActiveTab('build')} label="Build" icon="🏗️" />
           <TabBtn active={activeTab === 'monetization'} onClick={() => setActiveTab('monetization')} label="Monetização" icon="💰" />
           <TabBtn active={activeTab === 'vcs'} onClick={() => setActiveTab('vcs')} label="VCS" icon="🌿" />
        </div>

        {activeTab === 'terminal' && (
          <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 h-[500px] flex flex-col">
             <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-[9px] font-mono text-zinc-500">bash — {currentDir}</span>
                <div className="w-10"></div>
             </div>
             <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-1 bg-[#0a0a0a] selection:bg-blue-500/30">
                {logs.map((log, i) => (
                   <p key={i} className={`break-all leading-relaxed ${log.includes('ERROR') || log.includes('not found') ? 'text-red-500' : log.includes('SUCCESS') || log.includes('SUCESSO') ? 'text-green-500' : 'text-zinc-400'}`}>
                      {log.includes('~/carlin-midia-ofic') ? (
                         <>
                            <span className="text-blue-500 font-bold">{log.split(' $ ')[0]}</span>
                            <span className="text-zinc-300"> $ {log.split(' $ ')[1]}</span>
                         </>
                      ) : log}
                   </p>
                ))}
                <div ref={terminalBottomRef} />
             </div>
             <form 
               onSubmit={(e) => { e.preventDefault(); executeCommand(terminalInput); }}
               className="p-4 bg-[#0a0a0a] border-t border-zinc-900 flex items-center gap-2"
             >
                <span className="text-blue-500 font-mono text-[11px] font-bold shrink-0">{currentDir} $</span>
                <input 
                  autoFocus
                  value={terminalInput}
                  onChange={e => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[11px] font-mono text-white"
                  placeholder="Type command (e.g. ./build_apk.sh)..."
                />
             </form>
          </div>
        )}

        {activeTab === 'build' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-xl">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-sm font-black uppercase text-white tracking-widest">Build Generator</h3>
                      <p className="text-[10px] text-zinc-500 font-mono">Signer: V2 (Full APK Signature)</p>
                   </div>
                   <div className="flex bg-black p-1 rounded-lg border border-zinc-800">
                      <button onClick={() => setBuildFormat('apk')} className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${buildFormat === 'apk' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>APK</button>
                      <button onClick={() => setBuildFormat('aab')} className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${buildFormat === 'aab' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>AAB</button>
                   </div>
                </div>

                {isBuilding ? (
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-blue-500 animate-pulse">{buildStep}</span>
                        <span>{buildProgress}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${buildProgress}%` }}></div>
                     </div>
                  </div>
                ) : buildSuccess ? (
                  <div className="bg-green-600/10 border border-green-500/20 p-6 rounded-2xl text-center space-y-4 animate-in zoom-in-95">
                     <span className="text-4xl">📦</span>
                     <div>
                        <p className="text-sm font-black text-green-500 uppercase tracking-widest">Build Completed</p>
                        <p className="text-[9px] text-zinc-500 font-mono mt-1">{generatedFileName}</p>
                     </div>
                     <button onClick={() => window.open('https://github.com/carlin-oficial/carlin-midia-ofic/releases', '_blank')} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs active:scale-95 transition-all">Download Binário</button>
                  </div>
                ) : (
                  <button onClick={() => runBuild('Manual UI')} className="w-full bg-zinc-100 text-black py-5 rounded-xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">
                    Iniciar Gradle Release Build
                  </button>
                )}
             </div>
          </div>
        )}

        {activeTab === 'monetization' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 animate-in slide-in-from-left-4">
             <div className="space-y-4">
                <AdminField label="Creator ID (GUID)" value={targetId} onChange={setTargetId} placeholder="e.g. u_8232915" />
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase text-zinc-600 ml-2">Reason for Suspension</label>
                   <textarea 
                    value={reason} onChange={e => setReason(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm text-white outline-none focus:border-red-600 h-32 resize-none"
                    placeholder="Violation description..."
                   />
                </div>
                <button onClick={handleSuspend} disabled={isProcessing} className="w-full bg-red-600 text-white py-5 rounded-xl font-black uppercase text-xs disabled:opacity-50">
                   {isProcessing ? 'Sincronizando API...' : 'Aplicar Suspensão'}
                </button>
             </div>
          </div>
        )}

        {activeTab === 'vcs' && (
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-xl">🌿</div>
                 <div>
                    <h4 className="text-white font-black uppercase text-sm">Branch: main</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">HEAD is at 8f2d4e1 [v3.6.1 stable]</p>
                 </div>
              </div>
              <div className="bg-black p-6 rounded-2xl border border-zinc-800 space-y-1">
                 <p className="text-[10px] text-zinc-600 font-mono italic">// git config --global user.name "CarlinOficial"</p>
                 <p className="text-[10px] text-zinc-400 font-mono">Repo: github.com/carlinofoc/carlin-midia-ofic-</p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

const AdminField = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-2">
     <label className="text-[9px] font-black uppercase text-zinc-600 ml-2">{label}</label>
     <input 
      value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-6 font-mono text-xs text-white outline-none focus:border-red-600 transition-all"
     />
  </div>
);

const TabBtn = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${active ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
  >
    <span className="text-xs">{icon}</span>
    {label}
  </button>
);

export default AdminPanel;
