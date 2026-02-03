
import React, { useState } from 'react';
import { User } from '../types';
import { dbService } from '../services/dbService';
import { comparePasswords, decrypt, generateSessionToken } from '../services/cryptoService';

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
            <div className="text-center space-y-4">
               <div className="w-20 h-20 bg-zinc-800 rounded-[2rem] mx-auto flex items-center justify-center border border-zinc-700 shadow-xl">
                  <span className="text-3xl">🗝️</span>
               </div>
               <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white leading-none">Abrir Cofre</h1>
               <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Identidade Verificada</p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
               <input 
                required type="password" placeholder="Sua Senha Mestra" 
                className="w-full bg-black border border-zinc-800 rounded-3xl py-5 px-7 text-sm outline-none focus:border-blue-500 transition-all"
                value={password} onChange={e => setPassword(e.target.value)}
               />

               {error && <p className="text-[10px] text-red-500 font-black uppercase text-center">{error}</p>}

               <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl">
                 Desbloquear Hardware
               </button>
            </form>

            <button onClick={onNavigateToRegister} className="w-full text-[10px] text-zinc-600 font-bold uppercase hover:text-blue-500">
               Novo dispositivo? Provisionar ID
            </button>
          </>
        ) : (
          <div className="text-center space-y-8 py-10">
             <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="absolute inset-0 flex items-center justify-center text-4xl">
                   {status === 'checking' && '📡'}
                   {status === 'unlocking' && '🔐'}
                   {status === 'success' && '✨'}
                </span>
             </div>
             <div className="space-y-4">
                <h2 className="text-xl font-black italic uppercase tracking-tighter">
                   {status === 'checking' && 'Verificando Handshake'}
                   {status === 'unlocking' && 'Decriptando Cofre'}
                   {status === 'success' && 'Acesso Permitido'}
                </h2>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] animate-pulse">
                   {status === 'checking' && 'Validando registro no servidor...'}
                   {status === 'unlocking' && 'Unwrapping DEK payloads...'}
                   {status === 'success' && 'Seja bem-vindo ao Carlin.'}
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
