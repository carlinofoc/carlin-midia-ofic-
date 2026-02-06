
import React, { useState } from 'react';
import { User, VerificationLevel, UserRegistration, UserAccount } from '../types';
import { dbService } from '../services/dbService';
import CarlinLabBanner from './CarlinLabBanner';
import VerificationProcess from './VerificationProcess';

interface RegistrationProps {
  onComplete: (user: User, startLite: boolean) => void;
  onNavigateToLogin: () => void;
}

/**
 * Replicates Kotlin: class RegistrationFlow
 */
const Registration: React.FC<RegistrationProps> = ({ onComplete, onNavigateToLogin }) => {
  const [view, setView] = useState<'form' | 'provisioning' | 'biometrics'>('form');
  const [regData, setRegData] = useState<UserRegistration>({
    name: '',
    email: '',
    level: VerificationLevel.BRONZE,
    consentAccepted: false,
    password: ''
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 8));

  // Replicates Kotlin: private fun requestSelfie(user: UserAccount)
  const requestSelfie = (user: UserAccount) => {
    setView('biometrics');
  };

  // Replicates Kotlin: private fun createBasicAccount(user: UserAccount)
  const createBasicAccount = (user: UserAccount) => {
    executeProvisioningFlow();
  };

  // Replicates Kotlin: fun start(user: UserAccount)
  const startRegistrationFlow = (e: React.FormEvent) => {
    e.preventDefault();

    const userAccount: UserAccount = {
      id: `temp_${Date.now()}`,
      name: regData.name,
      email: regData.email,
      level: regData.level,
      consentAccepted: regData.consentAccepted
    };

    switch (userAccount.level) {
      case VerificationLevel.BRONZE:
        createBasicAccount(userAccount);
        break;
      case VerificationLevel.PRATA:
      case VerificationLevel.OURO:
        requestSelfie(userAccount);
        break;
    }
  };

  const executeProvisioningFlow = async (biometricData?: { hash: string, level: VerificationLevel }) => {
    setView('provisioning');
    addLog("[PROVISION] Initializing secure cofre...");
    setProgress(10);
    
    const user = await dbService.criarIdentidade(regData.name, regData.email, regData.password || 'default123', regData.level);
    
    setTimeout(async () => {
      addLog("[PROVISION] Handshake: Registering ID...");
      setProgress(40);
      
      if (biometricData) {
        addLog(`[PROVISION] Sealing ${biometricData.level} biometrics...`);
        await dbService.salvarBiometria(user.id, biometricData.hash, biometricData.level);
        user.verificationLevel = biometricData.level;
        user.level = biometricData.level;
        user.isFaciallyVerified = true;
      } else {
        addLog("[PROVISION] Initial level set to BRONZE (No selfie).");
        user.verificationLevel = VerificationLevel.BRONZE;
        user.level = VerificationLevel.BRONZE;
      }

      user.consentAccepted = regData.consentAccepted;

      await dbService.registrarNoBackend(user);
      setProgress(100);
      addLog("[SUCCESS] ID Secured and Synced.");
      
      setTimeout(() => onComplete(user, false), 1000);
    }, 1500);
  };

  if (view === 'biometrics') {
    return (
      <VerificationProcess 
        user={{ id: 'temp_reg' }} 
        onComplete={(data) => executeProvisioningFlow(data)} 
        onCancel={() => setView('form')} 
        onOpenPolicy={() => {}}
        externalData={regData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start py-20 px-6 overflow-y-auto">
      <div className="w-full max-w-md space-y-6">
        {view === 'form' && <CarlinLabBanner />}
        
        <div className="w-full bg-zinc-900 rounded-[3rem] border border-zinc-800 p-10 shadow-3xl relative overflow-hidden">
          {view === 'form' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-xl border-2 border-zinc-800">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">Cadastro Seguro</h1>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Carlin Secure v5.2</p>
              </div>

              <form onSubmit={startRegistrationFlow} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-zinc-600 ml-4">Nome Completo</label>
                   <input 
                    required 
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500 transition-all text-white" 
                    onChange={e => setRegData({...regData, name: e.target.value})} 
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-zinc-600 ml-4">E-mail Privado</label>
                   <input 
                    required 
                    type="email" 
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500 transition-all text-white" 
                    onChange={e => setRegData({...regData, email: e.target.value})} 
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-black uppercase text-zinc-600 ml-4">Senha Mestra</label>
                   <input 
                    required 
                    type="password" 
                    placeholder="Mínimo 8 caracteres" 
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm outline-none focus:border-blue-500 transition-all text-white" 
                    onChange={e => setRegData({...regData, password: e.target.value})} 
                   />
                </div>
                
                <div className="space-y-2 pt-2">
                   <label className="text-[8px] font-black uppercase text-zinc-500 ml-4">Selo de Identidade Inicial</label>
                   <div className="grid grid-cols-3 gap-2">
                      <LevelSelect label="Bronze" active={regData.level === VerificationLevel.BRONZE} onClick={() => setRegData({...regData, level: VerificationLevel.BRONZE})} />
                      <LevelSelect label="Prata" active={regData.level === VerificationLevel.PRATA} onClick={() => setRegData({...regData, level: VerificationLevel.PRATA})} />
                      <LevelSelect label="Ouro" active={regData.level === VerificationLevel.OURO} onClick={() => setRegData({...regData, level: VerificationLevel.OURO})} />
                   </div>
                   <p className="text-[8px] text-zinc-600 text-center uppercase tracking-tight">Ouro requer documento de identidade físico.</p>
                </div>

                <div className="flex items-center gap-3 px-4 pt-2">
                   <input 
                    type="checkbox" 
                    required 
                    className="w-4 h-4 rounded bg-black border-zinc-800 text-blue-500" 
                    onChange={e => setRegData({...regData, consentAccepted: e.target.checked})} 
                   />
                   <span className="text-[9px] text-zinc-500 font-bold uppercase">Aceito a Política de Biometria e Dados</span>
                </div>
                
                <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                  {regData.level === VerificationLevel.BRONZE ? 'Finalizar Cadastro Bronze' : 'Iniciar Sensores (v5.9)'}
                </button>
              </form>

              <button onClick={onNavigateToLogin} className="w-full text-[10px] text-zinc-600 font-bold uppercase hover:text-blue-500">
                Já possui conta? Entrar no Cofre
              </button>
            </div>
          ) : (
            <div className="space-y-10 py-6 text-center animate-in fade-in">
               <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-500 transition-all duration-500" strokeDasharray={364} strokeDashoffset={364 - (364 * progress) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-2xl font-black italic text-white">{progress}%</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Provisionando Identidade</h2>
                  <div className="bg-black/50 rounded-3xl p-6 border border-zinc-800 text-left h-40 overflow-hidden font-mono text-[9px]">
                     {logs.map((log, i) => (
                       <p key={i} className={`mb-1 ${i === 0 ? 'text-blue-400' : 'text-zinc-600'}`}>{i === 0 ? '●' : '○'} {log}</p>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LevelSelect = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button type="button" onClick={onClick} className={`py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-black border-zinc-800 text-zinc-600'}`}>
    {label}
  </button>
);

export default Registration;
