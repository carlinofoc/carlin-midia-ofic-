
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface RegistrationProps {
  onComplete: (user: User, startLite: boolean) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [useLiteMode, setUseLiteMode] = useState(true); // Default to true for accessibility
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    username: '',
    displayName: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      const cleanHandle = value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
      setFormData({ ...formData, [name]: cleanHandle });
      
      if (cleanHandle.length > 2) {
        checkHandleAvailability(cleanHandle);
      } else {
        setHandleAvailable(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const checkHandleAvailability = (handle: string) => {
    setIsCheckingHandle(true);
    setTimeout(() => {
      setIsCheckingHandle(false);
      setHandleAvailable(true);
    }, 400);
  };

  const generateOriginalHandle = () => {
    const base = formData.displayName.split(' ')[0].toLowerCase() || 'carlin';
    const random = Math.floor(Math.random() * 9999);
    const suggested = `${base}_${random}`;
    setFormData({ ...formData, username: suggested });
    checkHandleAvailability(suggested);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `u_${Date.now()}`,
      username: formData.username,
      displayName: formData.displayName,
      avatar: 'assets/profile.png',
      bio: `Novo no Carlin Mídia! ${useLiteMode ? 'Utilizando modo otimizado.' : ''} 🚀`,
      followers: 0,
      following: 0,
      email: formData.email,
      phone: formData.phone,
    };
    onComplete(newUser, useLiteMode);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-y-auto py-10">
      <div className="w-full max-w-md bg-zinc-900 rounded-[2.5rem] border border-zinc-800 p-8 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="text-center space-y-3 relative">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-4 overflow-hidden border-2 border-zinc-800">
            <img src="assets/profile.png" alt="Carlin Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">Carlin Cadastro</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Crie sua conta oficial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">E-mail</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-5 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Telefone</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-5 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              {/* Performance Toggle Option */}
              <div className="bg-black/40 border border-zinc-800 p-4 rounded-2xl mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-xs font-black uppercase text-blue-500">Ativar Modo Light</h4>
                    <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-tighter font-bold">Recomendado para celulares com pouca memória</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setUseLiteMode(!useLiteMode)}
                    className={`w-10 h-5 rounded-full relative transition-all ${useLiteMode ? 'bg-blue-600' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${useLiteMode ? 'left-5' : 'left-0.5'}`}></div>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.email || !formData.phone}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white font-black py-4 rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest mt-2"
              >
                Próximo
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Nome Completo</label>
                <input
                  required
                  type="text"
                  name="displayName"
                  placeholder="Ex: Pedro Silva"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-5 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between px-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Seu @ Único</label>
                   <button type="button" onClick={generateOriginalHandle} className="text-[9px] text-blue-500 font-bold uppercase hover:underline">Gerar automático</button>
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 font-bold">@</span>
                  <input
                    required
                    type="text"
                    name="username"
                    placeholder="handle"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full bg-black border ${handleAvailable ? 'border-green-500/50' : 'border-zinc-800'} rounded-2xl py-4 pl-10 pr-5 text-sm focus:border-blue-500 outline-none transition-all`}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-zinc-800 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={!formData.username || !formData.displayName || isCheckingHandle}
                  className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20"
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-[9px] text-zinc-600 text-center uppercase tracking-widest leading-relaxed">
          v3.5.2 • Versão Lite disponível em configurações.<br/>Segurança Carlin Mídia Oficial.
        </p>
      </div>
    </div>
  );
};

export default Registration;
