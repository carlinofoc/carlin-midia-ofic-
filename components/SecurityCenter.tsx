
import React, { useState } from 'react';
import { User, Post } from '../types';
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
        alert("Chaves rotacionadas com sucesso! Todos os dados foram re-encriptados.");
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
            <h1 className="text-xl font-black italic tracking-tighter uppercase text-blue-500 leading-none">Cofre Carlin v4.6</h1>
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">Simulação Mongoose/AES-GCM</span>
          </div>
        </div>

        {/* Dashboard de Chaves */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-[3rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="text-7xl font-black italic">AES</span>
           </div>

           <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-blue-500"></span> Chave Individual do Usuário (Buffer)
              </h3>
              <div className="bg-black p-6 rounded-2xl border border-zinc-800">
                 <p className="text-[10px] font-mono text-zinc-500 break-all leading-relaxed">
                    0x{user.chave.toUpperCase()}
                 </p>
              </div>
           </div>

           <div className="flex flex-col gap-4">
              <button 
                onClick={handleRotate}
                disabled={isRotating}
                className={`w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl shadow-blue-500/10 ${isRotating ? 'opacity-50' : ''}`}
              >
                {isRotating ? 'Rotacionando e Re-encriptando...' : 'Rotacionar Chaves de Segurança'}
              </button>
              <p className="text-[9px] text-zinc-500 font-bold uppercase text-center tracking-tighter">
                A rotação gera uma nova chave AES-256 e recriptografa seu Nome e Email.
              </p>
           </div>
        </section>

        {/* Database Visualization */}
        <section className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <h3 className="text-xs font-black uppercase text-white tracking-widest">Tabela: Usuarios (Mock MongoDB)</h3>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
              <pre className="text-[10px] font-mono text-zinc-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                 {JSON.stringify({
                   id: user.id,
                   nome: user.nome_encrypted,
                   email: user.email_encrypted,
                   senha_hash: user.passwordHash.substring(0, 32) + "...",
                   chave_aes: "[PROTECTED_BUFFER]"
                 }, null, 2)}
              </pre>
           </div>
        </section>

        <div className="p-10 bg-blue-600/5 border border-dashed border-blue-600/20 rounded-[3rem] text-center space-y-4">
           <p className="text-[11px] text-zinc-400 leading-relaxed italic">
             "O Carlin garante Zero-Knowledge. Nem mesmo o administrador do sistema pode ler seus dados sem a chave individual gerada no seu registro."
           </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;
