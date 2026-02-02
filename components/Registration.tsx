
import React, { useState } from 'react';
import { User } from '../types';
import { dbService } from '../services/dbService';

interface RegistrationProps {
  onComplete: (user: User, startLite: boolean) => void;
  onNavigateToLogin: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete, onNavigateToLogin }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useLiteMode, setUseLiteMode] = useState(true);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const newUser = await dbService.criarUsuario(formData.displayName, formData.email, formData.password);
      
      setTimeout(() => {
        onComplete(newUser, useLiteMode);
        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      alert("Falha na simulação do servidor.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md bg-zinc-900 rounded-[3rem] border border-zinc-800 p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-xl border-2 border-zinc-800">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">Novo Registro</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Hooks de Criptografia Ativos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <InputGroup label="Seu Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" />
              <InputGroup label="Sua Senha" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" />
              <button type="button" onClick={() => setStep(2)} disabled={!formData.email || formData.password.length < 8} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest mt-2 transition-all">Próximo Passo</button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <InputGroup label="Nome de Exibição" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Como quer ser chamado?" />
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-zinc-800 text-white font-black py-4 rounded-2xl text-[10px] uppercase">Voltar</button>
                <button type="submit" disabled={isProcessing || !formData.displayName} className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  {isProcessing ? 'Gerando Chave AES...' : 'Finalizar Registro'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, type = "text", value, onChange, placeholder }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-4">{label}</label>
    <input required type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-black border border-zinc-800 rounded-3xl py-4 px-6 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-zinc-800" />
  </div>
);

export default Registration;
