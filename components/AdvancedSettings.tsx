
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface AdvancedSettingsProps {
  user: User;
  onBack: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  isLite: boolean;
  onToggleLite: () => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ user, onBack, isDark, onToggleDark, isLite, onToggleLite }) => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-right">
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Opções Avançadas</h1>
            <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Personalização & Poder</span>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
           {/* Categoria: Interface */}
           <SettingsCategory title="Interface & Experiência" icon="🎨">
              <ToggleOption 
                label="Modo Escuro (OLED)" 
                desc="Otimiza o consumo de bateria e foco visual." 
                active={isDark} 
                onToggle={onToggleDark} 
              />
              <ToggleOption 
                label="Modo Light (Otimizado)" 
                desc="Reduz o peso visual e consumo de recursos." 
                active={isLite} 
                onToggle={onToggleLite} 
              />
              <ToggleOption 
                label="Animações Fluídas" 
                desc="Habilita transições suaves entre as telas." 
                active={animationsEnabled} 
                onToggle={() => setAnimationsEnabled(!animationsEnabled)} 
              />
           </SettingsCategory>

           {/* Categoria: Privacidade Ativa */}
           <SettingsCategory title="Privacidade Ativa" icon="🛡️">
              <ActionButton 
                label="Exportar Meus Dados" 
                desc="Baixe um arquivo JSON com todas as suas informações." 
                onClick={() => alert('Preparando pacote de dados...')} 
              />
              <ActionButton 
                label="Limpar Cache Local" 
                desc="Remove imagens e vídeos temporários para liberar espaço." 
                onClick={() => alert('Cache limpo com sucesso.')} 
              />
           </SettingsCategory>

           {/* Categoria: Laboratório (Escalabilidade) */}
           <SettingsCategory title="Carlin Labs" icon="🧪">
              <p className="px-6 py-2 text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                Recursos experimentais que ainda estão sendo refinados pela nossa mente independente.
              </p>
              <ToggleOption 
                label="Modo Foco Extremo" 
                desc="Esconde todos os números de curtidas para saúde mental." 
                active={false} 
                onToggle={() => {}} 
                disabled={true}
              />
           </SettingsCategory>
        </div>

        {/* Info Footer */}
        <div className="p-10 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] text-center space-y-4">
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
             Este painel é dinâmico.<br/>Novas opções são adicionadas com base no seu feedback direto.
           </p>
           <div className="pt-4 border-t border-zinc-800">
              <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">
                Versão do Firmware Visual: v4.1.2
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

// Fix: Make children optional to resolve Property 'children' is missing in type errors.
const SettingsCategory = ({ title, icon, children }: { title: string, icon: string, children?: React.ReactNode }) => (
  <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl">
    <div className="px-8 py-5 border-b border-zinc-800 flex items-center gap-3">
       <span className="text-xl">{icon}</span>
       <h3 className="text-xs font-black uppercase tracking-widest text-white">{title}</h3>
    </div>
    <div className="p-2 space-y-1">
       {children}
    </div>
  </div>
);

const ToggleOption = ({ label, desc, active, onToggle, disabled = false }: { label: string, desc: string, active: boolean, onToggle: () => void, disabled?: boolean }) => (
  <div className={`flex items-center justify-between p-6 rounded-3xl hover:bg-zinc-800/50 transition-colors ${disabled ? 'opacity-40' : ''}`}>
    <div className="flex-1 pr-6 space-y-1">
       <h4 className="text-xs font-black uppercase text-white tracking-widest">{label}</h4>
       <p className="text-[10px] text-zinc-500 leading-tight">{desc}</p>
    </div>
    <button 
      onClick={onToggle}
      disabled={disabled}
      className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-blue-600' : 'bg-zinc-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

const ActionButton = ({ label, desc, onClick }: { label: string, desc: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 rounded-3xl hover:bg-zinc-800 transition-colors text-left"
  >
    <div className="flex-1 pr-6 space-y-1">
       <h4 className="text-xs font-black uppercase text-white tracking-widest">{label}</h4>
       <p className="text-[10px] text-zinc-500 leading-tight">{desc}</p>
    </div>
    <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export default AdvancedSettings;
