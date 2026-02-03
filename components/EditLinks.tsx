
import React, { useState } from 'react';
import { ProfileLink, LinkType, LinkStatus } from '../types';

interface EditLinksProps {
  currentLinks: ProfileLink[];
  onUpdate: (newLinks: ProfileLink[]) => void;
  onCancel: () => void;
}

const EditLinks: React.FC<EditLinksProps> = ({ currentLinks, onUpdate, onCancel }) => {
  const [links, setLinks] = useState<ProfileLink[]>([...(currentLinks || [])]);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const addLink = () => {
    if (links.length >= 5) return;
    setLinks([...links, { 
      id: `lnk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, 
      title: '', 
      url: '', 
      clicks: 0,
      views: 0,
      type: 'normal',
      status: 'active'
    }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof ProfileLink, value: any) => {
    let newLinks = [...links];
    
    if (field === 'title' && typeof value === 'string' && value.length > 100) return;

    if (field === 'type' && value === 'pinned') {
      newLinks = newLinks.map((l, i) => ({
        ...l,
        type: i === index ? 'pinned' : (l.type === 'pinned' ? 'normal' : l.type)
      }));
    } else {
      newLinks[index] = { ...newLinks[index], [field]: value };
    }
    
    setLinks(newLinks);
  };

  const handleSave = () => {
    const validLinks = links.filter(l => l.title.trim() && l.url.trim());
    onUpdate(validLinks);
  };

  const activeLinks = links.filter(l => l.status === 'active' && l.title.trim());
  const pinnedLink = activeLinks.find(l => l.type === 'pinned');
  const otherLinks = activeLinks.filter(l => l.type !== 'pinned');

  return (
    <div className="fixed inset-0 bg-black/95 z-[3500] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300 backdrop-blur-md">
      <div className="bg-zinc-900 w-full max-w-lg rounded-[3rem] border border-zinc-800 p-6 md:p-10 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="text-center space-y-4 shrink-0">
          <div className="flex justify-center gap-2">
            <TabButton 
              active={activeTab === 'edit'} 
              onClick={() => setActiveTab('edit')} 
              label="Configurar" 
              icon="📝" 
            />
            <TabButton 
              active={activeTab === 'preview'} 
              onClick={() => setActiveTab('preview')} 
              label="Prévia Real" 
              icon="👁️" 
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">Vínculos de Impacto</h2>
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Sincronização em tempo real</p>
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar pr-1">
          {activeTab === 'edit' ? (
            <div className="space-y-6">
              {links.length === 0 && (
                <div className="py-12 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">Nenhum link configurado</p>
                </div>
              )}
              
              {links.map((link, idx) => (
                <div key={link.id} className="bg-black/40 p-6 rounded-[2.5rem] border border-zinc-800/50 space-y-5 relative animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                     <div className="flex gap-2">
                        <StatusChip 
                          active={link.status === 'active'} 
                          onClick={() => updateLink(idx, 'status', link.status === 'active' ? 'inactive' : 'active')} 
                        />
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest flex items-center">Vínculo #{idx + 1}</span>
                     </div>
                     <button 
                      onClick={() => removeLink(idx)}
                      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all active:scale-90"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Título</label>
                        <span className={`text-[8px] font-bold ${link.title.length >= 90 ? 'text-orange-500' : 'text-zinc-700'}`}>
                          {link.title.length}/100
                        </span>
                      </div>
                      <input 
                        value={link.title}
                        maxLength={100}
                        onChange={(e) => updateLink(idx, 'title', e.target.value)}
                        placeholder="Ex: Meu Curso Premium"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-zinc-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest px-1">URL</label>
                      <input 
                        value={link.url}
                        onChange={(e) => updateLink(idx, 'url', e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-xs text-blue-500 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-medium placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                     <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest px-1 block mb-3">Estilo de Vínculo</label>
                     <div className="grid grid-cols-2 gap-2">
                        <TypeButton label="Normal" icon="🔗" active={link.type === 'normal'} onClick={() => updateLink(idx, 'type', 'normal')} />
                        <TypeButton label="Fixado" icon="📌" active={link.type === 'pinned'} onClick={() => updateLink(idx, 'type', 'pinned')} />
                        <TypeButton label="Monetizado" icon="💰" active={link.type === 'monetized'} onClick={() => updateLink(idx, 'type', 'monetized')} />
                        <TypeButton label="Exclusivo" icon="🧪" active={link.type === 'exclusive'} onClick={() => updateLink(idx, 'type', 'exclusive')} />
                     </div>
                  </div>
                </div>
              ))}

              {links.length < 5 && (
                <button 
                  onClick={addLink}
                  className="w-full py-8 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">+</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Adicionar ({links.length}/5)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6 pb-10 animate-in fade-in zoom-in-95 duration-300">
              <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl text-center mb-4">
                 <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Visualização do Visitante</p>
              </div>

              {activeLinks.length === 0 ? (
                <div className="text-center py-20 opacity-20">
                   <span className="text-4xl block mb-4">🏜️</span>
                   <p className="text-[10px] font-black uppercase tracking-widest">Nada para mostrar ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                   {pinnedLink && (
                     <div className="space-y-2">
                        <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest ml-4">Link em Destaque</span>
                        <PreviewCard link={pinnedLink} />
                     </div>
                   )}
                   {otherLinks.length > 0 && (
                     <div className="space-y-3">
                        {pinnedLink && <div className="h-px bg-zinc-800 mx-4"></div>}
                        {otherLinks.map(link => (
                          <PreviewCard key={link.id} link={link} />
                        ))}
                     </div>
                   )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-800 space-y-4 shrink-0">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
          >
            Confirmar e Sincronizar
          </button>
          <button
            onClick={onCancel}
            className="w-full text-zinc-500 hover:text-white py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
          >
            Descartar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

// Use React.FC to handle standard React props like key correctly
const PreviewCard: React.FC<{ link: ProfileLink }> = ({ link }) => {
  const isPinned = link.type === 'pinned';
  const isMonetized = link.type === 'monetized';
  const isExclusive = link.type === 'exclusive';

  const typeStyles = 
    isPinned ? "border-blue-500/50 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]" :
    isMonetized ? "border-green-500/50 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]" :
    isExclusive ? "border-purple-500/50 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]" :
    "border-zinc-800 bg-zinc-900/50";

  return (
    <div className={`p-5 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${typeStyles}`}>
      <div className="absolute top-0 right-0 p-3 opacity-60">
        <span className="text-xs">
          {isPinned && '📌'}
          {isMonetized && '💰'}
          {isExclusive && '🧪'}
        </span>
      </div>
      <div className="space-y-1">
        <h4 className={`text-sm font-black uppercase tracking-tight ${isExclusive ? 'text-purple-400' : isMonetized ? 'text-green-400' : isPinned ? 'text-blue-400' : 'text-white'}`}>
          {link.title || 'Título Indefinido'}
        </h4>
        <p className="text-[10px] text-zinc-500 truncate font-medium">{link.url || 'URL não configurada'}</p>
        
        <div className="flex gap-2 pt-2">
           {isMonetized && (
             <span className="text-[7px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Link Monetizado</span>
           )}
           {isExclusive && (
             <span className="text-[7px] font-black uppercase text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Exclusivo Lab</span>
           )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
    }`}
  >
    <span className="text-sm">{icon}</span>
    {label}
  </button>
);

const StatusChip = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-2 py-0.5 rounded-lg border text-[7px] font-black uppercase tracking-tighter transition-all ${
      active ? 'bg-green-600/10 border-green-500/30 text-green-500' : 'bg-zinc-800 border-zinc-700 text-zinc-500'
    }`}
  >
    {active ? '● Ativo' : '○ Inativo'}
  </button>
);

const TypeButton = ({ label, icon, active, onClick }: { label: string, icon: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 p-3 rounded-xl border text-[9px] font-black uppercase tracking-tighter transition-all text-left ${
      active ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
    }`}
  >
    <span className="text-sm">{icon}</span>
    {label}
  </button>
);

export default EditLinks;
