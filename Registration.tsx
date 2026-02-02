
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface RegistrationProps {
  onComplete: (user: User) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  
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
    }, 600);
  };

  const generateOriginalHandle = () => {
    const base = formData.displayName.split(' ')[0].toLowerCase() || 'user';
    const random = Math.floor(Math.random() * 9999);
    const suggested = `${base}_${random}`;
    setFormData({ ...formData, username: suggested });
    checkHandleAvailability(suggested);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `u_${Date.now()}`,
      username: formData.username,
      displayName: formData.displayName,
      avatar: 'assets/profile.png', // Definido como a foto oficial
      bio: `Novo no Carlin! Me siga para acompanhar meu conteúdo. ✨`,
      followers: 0,
      following: 0,
      email: formData.email,
      phone: formData.phone,
    };
    onComplete(newUser);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 overflow-y-auto py-12">
      <div className="w-full max-w-md bg-zinc-900 rounded-[3rem] border border-zinc-800 p-8 md:p-10 shadow-3xl space-y-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]"></div>
        
        <div className="text-center space-y-3 relative">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-2 rotate-3 overflow-hidden">
            <img src="assets/profile.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">Carlin Mídia</h1>
          <div className="flex justify-center gap-1">
            <div className={`h-1 w-8 rounded-full transition-colors ${step === 1 ? 'bg-blue-600' : 'bg-zinc-800'}`}></div>
            <div className={`h-1 w-8 rounded-full transition-colors ${step === 2 ? 'bg-blue-600' : 'bg-zinc-800'}`}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">E-mail Principal</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">📧</span>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">WhatsApp / Telefone</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">📱</span>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Crie uma Senha</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">🔒</span>
                  <input
                    required
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.email || !formData.phone || formData.password.length < 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Seu Nome Real</label>
                <input
                  required
                  type="text"
                  name="displayName"
                  placeholder="Ex: Carlos Oliveira"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end mb-1 px-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Seu @ Único</label>
                  <button 
                    type="button" 
                    onClick={generateOriginalHandle}
                    className="text-[10px] text-blue-500 font-bold hover:underline"
                  >
                    Gerar Original
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 font-black text-lg">@</span>
                  <input
                    required
                    type="text"
                    name="username"
                    placeholder="seu_nome"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full bg-black border ${handleAvailable ? 'border-green-500/50' : 'border-zinc-800'} rounded-2xl py-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-700`}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {isCheckingHandle ? (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : handleAvailable ? (
                      <span className="text-green-500 text-xs">✓</span>
                    ) : null}
                  </div>
                </div>
                {handleAvailable && (
                  <p className="text-[9px] text-green-500 font-bold uppercase tracking-tighter px-2">Esse @ é original e está disponível!</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={!formData.username || !formData.displayName || isCheckingHandle}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-600/20 text-xs uppercase tracking-widest"
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="pt-6 border-t border-zinc-800/50 text-center">
          <p className="text-[9px] text-zinc-600 leading-relaxed uppercase font-medium">
            Segurança de dados ponta-a-ponta.<br/>
            Ao entrar, você aceita nossos Termos e Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
