
import React, { useState } from 'react';
import { User } from '../types';
import { dbService } from '../services/dbService';
import { comparePasswords, decrypt, generateSessionToken } from '../services/cryptoService';
import { BrandLogo } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
}

type Status = 'idle' | 'checking' | 'unlocking' | 'success';

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const user = dbService.verificarIdentidadeLocal();
    if (!user) {
      setError("Nenhuma identidade local encontrada.");
      return;
    }

    setStatus('checking');
    
    setTimeout(async () => {
      // 1. Validar Senha
      const isPwValid = await comparePasswords(password, user.passwordHash);
      if (!isPwValid) {
        setError("Senha Mestra inválida.");
        setStatus('idle');
        return;
      }

      // 2. Verificar Registro Backend
      if (!dbService.isIdentidadeRegistradaNoBackend()) {
        await dbService.registrarNoBackend(user);
      }

      // 3. Desbloquear Cofre
      setStatus('unlocking');
      const decName = await decrypt(user.nome_encrypted, user.chave);

      if (decName) {
        const token = await generateSessionToken(user.id);
        setStatus('success');
        setTimeout(() => {
          onLogin({ ...user, displayName: decName, sessionToken: token });
        }, 1000);
      } else {
        setError("Erro ao descriptografar o envelope. Chave mestra corrompida.");
        setStatus('idle');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 rounded-[3rem] border border-zinc-800 p-10 space-y-8 animate-in fade-in duration-500 shadow-2xl relative overflow-hidden">
        
        {status === 'idle' ? (
          <>
            <div className="flex flex-col items-center space-y-6">
               <BrandLogo size="lg" />
               <div className="text-center">
                  <h1 className="text-xl font-black italic tracking-tighter uppercase text-white leading-none">Abrir Cofre</h1>
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2">Segurança • Carlin Midia Ofic</p>
               </div>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4 pt-4">
               <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-orange-500 transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input 
                    required type="password" placeholder="Sua Senha Mestra" 
                    className="w-full bg-black border border-zinc-800 rounded-3xl py-5 pl-14 pr-7 text-sm outline-none focus:border-orange-500/50 transition-all text-white placeholder:text-zinc-700"
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
               </div>

               {error && <p className="text-[10px] text-red-500 font-black uppercase text-center">{error}</p>}

               <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl hover:bg-zinc-200">
                 Desbloquear Hardware
               </button>
            </form>

            <button onClick={onNavigateToRegister} className="w-full text-[9px] text-zinc-600 font-black uppercase tracking-[0.1em] hover:text-orange-500 transition-colors">
               Novo dispositivo? Provisionar ID
            </button>
          </>
        ) : (
          <div className="text-center space-y-10 py-10">
             <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-orange-600/10 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-orange-500 border-r-orange-500/30 rounded-full animate-spin"></div>
                <span className="absolute inset-0 flex items-center justify-center text-5xl">
                   {status === 'checking' && '📡'}
                   {status === 'unlocking' && '🔐'}
                   {status === 'success' && '✨'}
                </span>
             </div>
             <div className="space-y-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                   {status === 'checking' && 'Handshake...'}
                   {status === 'unlocking' && 'Unwrapping...'}
                   {status === 'success' && 'Bem-vindo'}
                </h2>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] animate-pulse">
                   {status === 'checking' && 'Sincronizando com Carlin Midia Ofic...'}
                   {status === 'unlocking' && 'Decriptando Cofre Zero-Knowledge...'}
                   {status === 'success' && 'Identidade validada com sucesso.'}
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
