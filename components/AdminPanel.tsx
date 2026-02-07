
import React, { useState } from 'react';
import { User } from '../types';
import { impactService } from '../services/impactService';

interface AdminPanelProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onUpdateUser, onBack }) => {
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const handleSuspend = async () => {
    if (!targetId || !reason) {
      alert("Preencha o ID do Criador e o Motivo.");
      return;
    }

    setIsProcessing(true);
    addLog(`Iniciando solicitação POST /api/v1/admin/creator/monetization/suspend...`);

    // In our simulation, we target the current user if the ID matches for demo purposes
    // Otherwise we just simulate the API call
    const result = await impactService.suspendMonetization(currentUser, reason);
    
    addLog(`Resposta recebida: ${result.status}`);
    addLog(result.message);

    if (result.updatedUser) {
      onUpdateUser(result.updatedUser);
      addLog(`Estado local do usuário sincronizado.`);
    }

    setIsProcessing(false);
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

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-2xl">
           <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest">Controle de Monetização</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Endpoint: /api/v1/admin/creator/monetization/suspend</p>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[8px] font-black uppercase text-zinc-600 ml-2">ID do Criador (GUID)</label>
                 <input 
                  value={targetId}
                  onChange={e => setTargetId(e.target.value)}
                  placeholder="Ex: 123456"
                  className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-6 font-mono text-sm text-blue-400 outline-none focus:border-red-500 transition-all"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[8px] font-black uppercase text-zinc-600 ml-2">Motivo da Suspensão</label>
                 <textarea 
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Explique o motivo da sanção administrativa..."
                  className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-6 text-sm text-zinc-300 outline-none focus:border-red-500 transition-all h-24 resize-none"
                 />
              </div>

              <button 
                onClick={handleSuspend}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-xl font-black uppercase text-xs shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </>
                ) : 'Suspender Monetização'}
              </button>
           </div>
        </div>

        {/* Console Log */}
        <div className="bg-black border border-zinc-800 rounded-3xl p-6 h-64 overflow-y-auto font-mono text-[10px] space-y-1">
           {logs.length === 0 ? (
             <p className="text-zinc-700 italic">Aguardando comandos...</p>
           ) : (
             logs.map((log, i) => (
               <p key={i} className={log.includes('Sucesso') || log.includes('SUSPENDED') ? 'text-green-500' : 'text-zinc-500'}>
                 {log}
               </p>
             ))
           )}
        </div>

        <div className="text-center opacity-30 p-10">
           <p className="text-[8px] font-black uppercase tracking-[0.4em]">Carlin Admin Infrastructure v1.0.4</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
