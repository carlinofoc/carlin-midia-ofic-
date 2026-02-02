
import React from 'react';
import { Ad } from '../types';

interface AdItemProps {
  ad: Ad;
}

const AdItem: React.FC<AdItemProps> = ({ ad }) => {
  return (
    <div className="bg-transparent mb-10 border-b border-zinc-900/50 pb-8 animate-in fade-in duration-700">
      {/* Ad Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl p-[2px] bg-zinc-800 shadow-lg border border-zinc-700">
            <div className="w-full h-full rounded-lg overflow-hidden bg-black">
               <img src={ad.brandAvatar} className="w-full h-full object-cover" alt={ad.brandName} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight">{ad.brandName}</span>
              <span className="bg-blue-600/10 text-blue-500 text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-blue-500/20">Patrocinado</span>
            </div>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{ad.category}</p>
          </div>
        </div>
        <button className="text-zinc-600 p-2">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
        </button>
      </div>

      {/* Ad Media */}
      <div className="relative aspect-square bg-zinc-900 overflow-hidden shadow-2xl">
        <img src={ad.media} className="w-full h-full object-cover" alt="Anúncio" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 pointer-events-none"></div>
      </div>

      {/* Ad Content & CTA */}
      <div className="px-5 pt-5 space-y-4">
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed">
            <span className="font-black mr-2 tracking-tight">{ad.brandName}</span>
            <span className="text-zinc-300 font-medium">{ad.content}</span>
          </p>
          
          <button 
            onClick={() => window.open(ad.ctaUrl, '_blank')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {ad.ctaLabel}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7M3 12h18" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="px-5 mt-4">
        <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-tight">
          Anúncio ético • Verificado por Carlin Mídia Ofic Ads Policy.<br/>
          Proibimos jogos de azar e conteúdo invasivo.
        </p>
      </div>
    </div>
  );
};

export default AdItem;
