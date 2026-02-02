
import React, { useState } from 'react';
import { User } from '../types';
import { comparePasswords, decrypt, generateSessionToken } from '../services/cryptoService';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const saved = localStorage.getItem('carlin_user');
    if (!saved) {
      setError("Identidade não encontrada neste dispositivo.");
      setIsProcessing(false);
      return;
    }

    const user: User = JSON.parse(saved);

    if (user.username === handle.toLowerCase() && user.passwordHash) {
      const isValid = await comparePasswords(password, user.passwordHash);
      if (isValid) {
        // Descriptografar Tabelas para Memória
        const decName = user.nome_encrypted ? await decrypt(user.nome_encrypted, password) : user.displayName;
        const decEmail = user.email_encrypted ? await decrypt(user.email_encrypted, password) : user.email;

        if (decName) {
          const sessionToken = await generateSessionToken(user.id);
          onLogin({ 
            ...user, 
            displayName: decName, 
            email: decEmail || user.email,
            sessionToken 
          });
          setIsProcessing(false);
          return;
        }
      }
    }

    setError("Chave Mestra ou Handle inválidos.");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-[3rem] border border-zinc-800 p-10 space-y-8 animate-in fade-in duration-500 shadow-3xl">
        <div className="text-center space-y-4">
           <div className="w-20 h-20 bg-zinc-800 rounded-[2rem] mx-auto flex items-center justify-center border border-zinc-700 shadow-2xl"><span className="text-3xl">🗝️</span></div>
           <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white leading-none">Desbloquear</h1>
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Insira sua Chave Mestra</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
           <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-600 ml-5">Handle @</label>
              <input required type="text" value={handle} onChange={(e) => setHandle(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-3xl py-5 px-7 text-sm focus:border-blue-500 outline-none transition-all" />
           </div>
           <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-600 ml-5">Senha Mestra</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-3xl py-5 px-7 text-sm focus:border-blue-500 outline-none transition-all" />
           </div>

           {error && <p className="text-[10px] text-red-500 font-black uppercase text-center animate-pulse">{error}</p>}

           <button type="submit" disabled={isProcessing} className="w-full bg-white text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl shadow-white/5">
             {isProcessing ? 'Validando Chave...' : 'Abrir Cofre'}
           </button>
        </form>

        <button onClick={onNavigateToRegister} className="w-full text-[10px] text-zinc-500 font-bold uppercase hover:text-blue-500">Novo aqui? Criar Identidade Criptografada</button>
      </div>
    </div>
  );
};

export default Login;
