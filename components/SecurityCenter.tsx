
import React, { useState } from 'react';
import { User } from '../types';
import { dbService } from '../services/dbService';

interface SecurityCenterProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const SecurityCenter: React.FC<SecurityCenterProps> = ({ user, onBack, onUpdateUser }) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleRotate = async () => {
    setIsRotating(true);
    try {
      const updatedUser = await dbService.rotacionarChave(user);
      setTimeout(() => {
        onUpdateUser(updatedUser);
        setIsRotating(false);
        alert("Chaves rotacionadas com sucesso! Todos os dados foram re-encriptados com novos envelopes.");
      }, 2000);
    } catch {
      alert("Erro ao rotacionar chaves.");
      setIsRotating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-right">
            <h1 className="text-xl font-black italic tracking-tighter uppercase text-blue-500 leading-none">Cofre Carlin v4.9</h1>
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">Envelope Encryption Bridge</span>
          </div>
        </div>

        {/* Auditoria Visual de Envelope */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="text-7xl font-black italic">WRAP</span>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <span className="text-2xl">🏛️</span>
                 <h3 className="text-xs font-black uppercase text-white tracking-widest leading-none">Arquitetura de Cofre Hierárquico</h3>
              </div>

              {/* Diagrama de Envelope */}
              <div className="flex flex-col items-center gap-4 py-4">
                 <div className="w-full bg-blue-600/10 border border-blue-600/30 p-4 rounded-2xl flex items-center justify-between group hover:bg-blue-600/20 transition-all">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-blue-500 uppercase">Camada 1: Master Key</span>
                       <span className="text-[10px] font-mono text-white truncate w-40">0x{user.chave.slice(0, 20)}...</span>
                    </div>
                    <span className="text-xl">🔑</span>
                 </div>
                 
                 <div className="w-0.5 h-6 bg-zinc-800"></div>

                 <div className="w-full bg-indigo-600/10 border border-indigo-600/30 p-4 rounded-2xl flex items-center justify-between group hover:bg-indigo-600/20 transition-all">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-indigo-500 uppercase">Camada 2: Encrypted DEK</span>
                       <span className="text-[10px] font-mono text-white italic">Criptografada via AES-GCM-256</span>
                    </div>
                    <span className="text-xl">🧧</span>
                 </div>

                 <div className="w-0.5 h-6 bg-zinc-800"></div>

                 <div className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-zinc-500 uppercase">Camada 3: Seus Dados</span>
                       <span className="text-[10px] text-zinc-300 font-medium">Nome, Email, Bio (Zero-Knowledge)</span>
                    </div>
                    <span className="text-xl">📦</span>
                 </div>
              </div>

              <p className="text-[10px] text-zinc-500 leading-relaxed italic text-center">
                "O Carlin v4.9 gera uma chave única para cada dado. Mesmo que uma chave de dados seja comprometida, a Master Key protege todo o restante do ecossistema."
              </p>
           </div>
        </section>

        {/* Auditoria de Algoritmo */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-8 space-y-6 shadow-2xl">
           <div className="flex items-center gap-3">
              <span className="text-2xl">⚖️</span>
              <h3 className="text-xs font-black uppercase text-white tracking-widest leading-none">Pesos de Relevância (Simulação)</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase text-blue-500">Amigos</h4>
                 <ul className="space-y-2 text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">
                    <li className="flex justify-between">Interesse Comum <span>50%</span></li>
                    <li className="flex justify-between">Engajamento <span>30%</span></li>
                    <li className="flex justify-between">Recência <span>20%</span></li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase text-orange-500">Explorar</h4>
                 <ul className="space-y-2 text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">
                    <li className="flex justify-between">Viralidade <span>50%</span></li>
                    <li className="flex justify-between">Match Interesse <span>30%</span></li>
                    <li className="flex justify-between">Diversidade <span>20%</span></li>
                 </ul>
              </div>
           </div>
        </section>

        {/* Gerenciamento de Chaves */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-[3rem] p-8 space-y-6 shadow-2xl">
           <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-blue-500"></span> Master Key do Dispositivo
              </h3>
              <div className="bg-black p-6 rounded-2xl border border-zinc-800">
                 <p className="text-[10px] font-mono text-zinc-500 break-all leading-relaxed">
                    0x{user.chave.toUpperCase()}
                 </p>
              </div>
           </div>

           <button 
             onClick={handleRotate}
             disabled={isRotating}
             className={`w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl ${isRotating ? 'opacity-50' : ''}`}
           >
             {isRotating ? 'Regerando Envelopes...' : 'Rotacionar Master Key & Re-wrap'}
           </button>
        </section>

        <div className="p-10 bg-blue-600/5 border border-dashed border-blue-600/20 rounded-[3rem] text-center space-y-4">
           <p className="text-[11px] text-zinc-400 leading-relaxed italic">
             "Carlin v4.9 implementa Zero-Knowledge real. Nem mesmo backups do servidor contêm chaves de leitura, pois elas residem apenas na sua chave mestra criptografada."
           </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;
