
import React from 'react';
import { User, NotificationPrefs } from '../types';

interface NotificationSettingsProps {
  user: User;
  onUpdate: (updatedPrefs: NotificationPrefs) => void;
  onBack: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ user, onUpdate, onBack }) => {
  const prefs = user.notificationPrefs || {
    performance: true,
    educational: true,
    security: true,
    community: true
  };

  const toggle = (key: keyof NotificationPrefs) => {
    onUpdate({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-xl mx-auto space-y-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Gestão de Atenção</h1>
        </div>

        <div className="space-y-4">
           <h2 className="text-2xl font-black italic uppercase leading-none">Notificações Humanas</h2>
           <p className="text-zinc-500 text-xs font-medium leading-relaxed">
             No Carlin, não usamos notificações para prender você. Escolha o que realmente agrega valor ao seu dia.
           </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-8 shadow-xl">
          <SettingToggle 
            label="Evolução & Performance"
            desc="Avisos sobre impacto real dos seus posts e sequência de dias ativos."
            active={prefs.performance}
            onToggle={() => toggle('performance')}
          />
          <SettingToggle 
            label="Educação Algorítmica"
            desc="Aprenda como seu conteúdo foi distribuído com total transparência."
            active={prefs.educational}
            onToggle={() => toggle('educational')}
          />
          <SettingToggle 
            label="Segurança & Proteção"
            desc="Status da sua verificação facial e alertas contra clonagem."
            active={prefs.security}
            onToggle={() => toggle('security')}
          />
          <SettingToggle 
            label="Voz da Comunidade"
            desc="Respostas genuínas e menções de criadores que você segue."
            active={prefs.community}
            onToggle={() => toggle('community')}
          />
        </div>

        <div className="p-10 bg-blue-600/5 border border-blue-600/10 rounded-[3rem] text-center space-y-4">
           <span className="text-2xl">🕊️</span>
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed">
             Nosso sistema de push respeita horários de descanso e limita a frequência automática.
           </p>
        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({ label, desc, active, onToggle }: { label: string, desc: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between gap-6 py-2">
    <div className="flex-1 space-y-1">
       <h4 className="text-xs font-black uppercase text-white tracking-widest">{label}</h4>
       <p className="text-[10px] text-zinc-500 leading-tight">{desc}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-blue-600' : 'bg-zinc-800'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

export default NotificationSettings;
