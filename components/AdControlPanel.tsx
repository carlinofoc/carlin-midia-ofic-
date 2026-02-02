
import React from 'react';
import { AdCategoryConfig } from '../types';

interface AdControlPanelProps {
  config: AdCategoryConfig;
  onUpdate: (newConfig: AdCategoryConfig) => void;
  onBack: () => void;
}

const AdControlPanel: React.FC<AdControlPanelProps> = ({ config, onUpdate, onBack }) => {
  const toggleCategory = (key: keyof AdCategoryConfig) => {
    if (key === 'casino') return; // Bloqueio permanente
    onUpdate({ ...config, [key]: !config[key] });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-xl mx-auto space-y-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Filtro de Conteúdo Ads</h1>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
           <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest">Personalize sua experiência</h3>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                Você tem o controle total sobre quais tipos de anúncios deseja ver. Desative categorias que não agregam valor ao seu dia a dia.
              </p>
           </div>

           <div className="space-y-4 pt-4">
              <ToggleItem 
                label="Educação & Aprendizado" 
                description="Cursos, mentorias e conteúdos educativos." 
                active={config.education} 
                onToggle={() => toggleCategory('education')} 
              />
              <ToggleItem 
                label="Tecnologia & Inovação" 
                description="Gadgets, softwares e avanços tech." 
                active={config.tech} 
                onToggle={() => toggleCategory('tech')} 
              />
              <ToggleItem 
                label="Ferramentas Digitais" 
                description="SaaS, apps de produtividade e utilitários." 
                active={config.tools} 
                onToggle={() => toggleCategory('tools')} 
              />
              <ToggleItem 
                label="Investimentos Regulados" 
                description="Bancos, corretoras e educação financeira." 
                active={config.investments} 
                onToggle={() => toggleCategory('investments')} 
              />
              <ToggleItem 
                label="Marcas & Criadores" 
                description="Produtos físicos e colaborações de criadores." 
                active={config.brands} 
                onToggle={() => toggleCategory('brands')} 
              />

              <div className="border-t border-zinc-800 pt-6 mt-6">
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex-1">
                    <h4 className="text-xs font-black uppercase text-red-500 flex items-center gap-2">
                      Cassino & Apostas 🔒
                    </h4>
                    <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-tighter font-bold">Bloqueado Permanentemente por Diretriz Ética</p>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-zinc-800 relative cursor-not-allowed">
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-zinc-600"></div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        <div className="p-8 bg-blue-600/5 border border-blue-600/10 rounded-3xl">
           <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2">Transparência Carlin</h4>
           <p className="text-[10px] text-zinc-500 leading-relaxed italic">
             "Diferente de outras plataformas, não forçamos anúncios que exploram gatilhos emocionais ou financeiros. Sua saúde mental e financeira é nossa prioridade."
           </p>
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, description, active, onToggle }: { label: string, description: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex-1 pr-4">
      <h4 className="text-xs font-black uppercase tracking-widest">{label}</h4>
      <p className="text-[10px] text-zinc-500 mt-0.5">{description}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-blue-600' : 'bg-zinc-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

export default AdControlPanel;
