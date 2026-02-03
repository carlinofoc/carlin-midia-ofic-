
import React, { useState, useEffect } from 'react';
import { ProfileLink } from '../types';

interface EditLinksProps {
  currentLinks: ProfileLink[];
  onUpdate: (newLinks: ProfileLink[]) => void;
  onCancel: () => void;
}

const EditLinks: React.FC<EditLinksProps> = ({ currentLinks, onUpdate, onCancel }) => {
  const [links, setLinks] = useState<ProfileLink[]>([...(currentLinks || [])]);

  const addLink = () => {
    if (links.length >= 5) return;
    setLinks([...links, { id: `lnk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, title: '', url: '', clicks: 0 }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof ProfileLink, value: string) => {
    const newLinks = [...links];
    // Enforce 100 character limit for title as per Mongoose schema
    if (field === 'title' && value.length > 100) return;
    
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const handleSave = () => {
    // Filter out completely empty rows before saving
    const validLinks = links.filter(l => l.title.trim() && l.url.trim());
    onUpdate(validLinks);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[3500] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300 backdrop-blur-md">
      <div className="bg-zinc-900 w-full max-w-lg rounded-[3rem] border border-zinc-800 p-6 md:p-10 space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="text-center space-y-3 shrink-0">
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
            <span className="text-2xl">🔗</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">Gerenciar Links</h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Padrão Mongoose • Máx. 5 Itens</p>
          </div>
        </div>

        {/* Scrollable Links List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pr-1">
          {links.length === 0 && (
            <div className="py-12 text-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-widest">Nenhum link configurado</p>
            </div>
          )}
          
          {links.map((link, idx) => (
            <div key={idx} className="bg-black/40 p-5 rounded-[2rem] border border-zinc-800/50 space-y-4 relative group animate-in slide-in-from-bottom-2 duration-300">
              <button 
                onClick={() => removeLink(idx)}
                className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all active:scale-90"
                title="Remover Link"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Título do Link</label>
                  <span className={`text-[8px] font-bold ${link.title.length >= 90 ? 'text-orange-500' : 'text-zinc-700'}`}>
                    {link.title.length}/100
                  </span>
                </div>
                <input 
                  value={link.title}
                  maxLength={100}
                  onChange={(e) => updateLink(idx, 'title', e.target.value)}
                  placeholder="Ex: Meu Instagram Oficial"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest px-1">URL de Destino</label>
                <input 
                  value={link.url}
                  onChange={(e) => updateLink(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-xs text-blue-500 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-medium placeholder:text-zinc-700"
                />
              </div>
            </div>
          ))}

          {links.length < 5 && (
            <button 
              onClick={addLink}
              className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">+</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Adicionar Novo Link ({links.length}/5)</span>
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-800 space-y-4 shrink-0">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
          >
            Sincronizar com Perfil
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

export default EditLinks;
