
import React, { useState } from 'react';
import { User } from '../types';
import { dbService } from '../services/dbService';
import CarlinLabBanner from './CarlinLabBanner';

interface RegistrationProps {
  onComplete: (user: User, startLite: boolean) => void;
  onNavigateToLogin: () => void;
}

type Step = 'form' | 'provisioning';

const Registration: React.FC<RegistrationProps> = ({ onComplete, onNavigateToLogin }) => {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 8));

  const startFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('provisioning');
    
    // Passo 1: Gerar Identidade
    addLog("Iniciando hardware provision...");
    setProgress(10);
    const user = await dbService.criarIdentidade(formData.name, formData.email, formData.password);
    
    setTimeout(async () => {
      // Passo 2: Registrar Backend
      addLog("Handshake: registrando ID no backend...");
      setProgress(30);
      await dbService.registrarNoBackend(user);

      setTimeout(() => {
        // Passo 4: Vincular e Envelopar
        addLog("Wrapping Data Encryption Keys (DEKs)...");
        setProgress(90);
        
        setTimeout(() => {
           addLog("Cofre selado com sucesso.");
           setProgress(100);
           setTimeout(() => onComplete(user, false), 800);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start py-20 px-6 overflow-y-auto">
      <div className="w-full max-w-md space-y-6">
        {step === 'form' && <CarlinLabBanner />}
        
        <div className="w-full bg-zinc-900 rounded-[3rem] border border-zinc-800 p-10 shadow-3xl relative overflow-hidden">
          {step === 'form' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-xl border-2 border-zinc-800">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">Provisionar Hardware</h1>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Cofre Carlin v5.2</p>
              </div>

              <form onSubmit={startFlow} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-zinc-600 ml-4">Dados de Identidade</label>
                   <input 
                      required placeholder="Nome Completo" 
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500 transition-all text-white" 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <input 
                  required type="email" placeholder="E-mail Privado" 
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500 transition-all text-white" 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-zinc-600 ml-4">Segurança do Cofre</label>
                   <input 
                      required type="password" placeholder="Senha Mestra (Proteção Local)" 
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500 transition-all text-white" 
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                
                <button 
                  type="submit" 
                  disabled={formData.password.length < 8}
                  className="w-full bg-white text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-30 active:scale-95 transition-all"
                >
                  Gerar Identidade & Cofre
                </button>
              </form>

              <button onClick={onNavigateToLogin} className="w-full text-[10px] text-zinc-600 font-bold uppercase hover:text-blue-500">
                Já possui identidade vinculada? Entrar
              </button>
            </div>
          ) : (
            <div className="space-y-10 py-6 text-center animate-in fade-in">
               <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                     <circle 
                        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" 
                        className="text-blue-500 transition-all duration-500" 
                        strokeDasharray={364} 
                        strokeDashoffset={364 - (364 * progress) / 100} 
                        strokeLinecap="round" 
                     />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                     <span className="text-2xl font-black italic text-white">{progress}%</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Provisionando Hardware</h2>
                  <div className="bg-black/50 rounded-3xl p-6 border border-zinc-800 text-left h-48 overflow-hidden font-mono text-[9px]">
                     {logs.map((log, i) => (
                       <p key={i} className={`mb-1 ${i === 0 ? 'text-blue-400' : 'text-zinc-600'}`}>
                         {i === 0 ? '●' : '○'} {log}
                       </p>
                     ))}
                  </div>
               </div>
               
               <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.3em] animate-pulse">
                  Não feche o app durante o selamento do cofre.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
