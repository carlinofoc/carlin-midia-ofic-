
import React, { useState, useEffect, useRef } from 'react';
import { MusicTrack } from '../types';
import { liteModeManager } from '../services/liteModeService';

interface MusicPickerProps {
  onSelect: (music: MusicTrack) => void;
  onCancel: () => void;
}

// Mapeamento da nova lista de 50 músicas para o formato MusicTrack do Carlin Engine
const rawMusicData = [
  {"id":"1","title":"Morning Light","genre":"Chill","duration":120,"url":""},
  {"id":"2","title":"Urban Vibes","genre":"Pop","duration":150,"url":""},
  {"id":"3","title":"Epic Horizon","genre":"Epic","duration":180,"url":""},
  {"id":"4","title":"Soft Breeze","genre":"Acoustic","duration":140,"url":""},
  {"id":"5","title":"Neon Nights","genre":"Electronic","duration":160,"url":""},
  {"id":"6","title":"Jazz Lounge","genre":"Jazz","duration":130,"url":""},
  {"id":"7","title":"Summer Drive","genre":"Pop","duration":150,"url":""},
  {"id":"8","title":"Rainy Day","genre":"Chill","duration":120,"url":""},
  {"id":"9","title":"Future Pulse","genre":"Electronic","duration":180,"url":""},
  {"id":"10","title":"Epic Adventure","genre":"Epic","duration":200,"url":""},
  {"id":"11","title":"Golden Hour","genre":"Acoustic","duration":150,"url":""},
  {"id":"12","title":"City Lights","genre":"Pop","duration":140,"url":""},
  {"id":"13","title":"Calm Waves","genre":"Chill","duration":160,"url":""},
  {"id":"14","title":"Retro Drive","genre":"Electronic","duration":170,"url":""},
  {"id":"15","title":"Epic Rise","genre":"Epic","duration":190,"url":""},
  {"id":"16","title":"Soft Strings","genre":"Acoustic","duration":130,"url":""},
  {"id":"17","title":"Midnight Jazz","genre":"Jazz","duration":140,"url":""},
  {"id":"18","title":"Pop Pulse","genre":"Pop","duration":150,"url":""},
  {"id":"19","title":"Chill Nights","genre":"Chill","duration":120,"url":""},
  {"id":"20","title":"Electronic Dreams","genre":"Electronic","duration":180,"url":""},
  {"id":"21","title":"Epic Voyage","genre":"Epic","duration":200,"url":""},
  {"id":"22","title":"Acoustic Dawn","genre":"Acoustic","duration":150,"url":""},
  {"id":"23","title":"City Groove","genre":"Pop","duration":140,"url":""},
  {"id":"24","title":"Ocean Chill","genre":"Chill","duration":160,"url":""},
  {"id":"25","title":"Synth Wave","genre":"Electronic","duration":170,"url":""},
  {"id":"26","title":"Epic Legends","genre":"Epic","duration":190,"url":""},
  {"id":"27","title":"Acoustic Memories","genre":"Acoustic","duration":130,"url":""},
  {"id":"28","title":"Jazz Café","genre":"Jazz","duration":140,"url":""},
  {"id":"29","title":"Pop Sunrise","genre":"Pop","duration":150,"url":""},
  {"id":"30","title":"Chill Horizon","genre":"Chill","duration":120,"url":""},
  {"id":"31","title":"Electronic Sky","genre":"Electronic","duration":180,"url":""},
  {"id":"32","title":"Epic Dawn","genre":"Epic","duration":200,"url":""},
  {"id":"33","title":"Soft Piano","genre":"Acoustic","duration":150,"url":""},
  {"id":"34","title":"Urban Jazz","genre":"Jazz","duration":140,"url":""},
  {"id":"35","title":"Pop Motion","genre":"Pop","duration":150,"url":""},
  {"id":"36","title":"Chill Waves","genre":"Chill","duration":120,"url":""},
  {"id":"37","title":"Future Lights","genre":"Electronic","duration":180,"url":""},
  {"id":"38","title":"Epic Horizon 2","genre":"Epic","duration":200,"url":""},
  {"id":"39","title":"Acoustic Sunset","genre":"Acoustic","duration":150,"url":""},
  {"id":"40","title":"Jazz Vibes","genre":"Jazz","duration":140,"url":""},
  {"id":"41","title":"Pop Nights","genre":"Pop","duration":150,"url":""},
  {"id":"42","title":"Chill Breeze","genre":"Chill","duration":120,"url":""},
  {"id":"43","title":"Electronic Dreams 2","genre":"Electronic","duration":180,"url":""},
  {"id":"44","title":"Epic Journey","genre":"Epic","duration":200,"url":""},
  {"id":"45","title":"Acoustic Morning","genre":"Acoustic","duration":150,"url":""},
  {"id":"46","title":"Jazz Evening","genre":"Jazz","duration":140,"url":""},
  {"id":"47","title":"Pop Flow","genre":"Pop","duration":150,"url":""},
  {"id":"48","title":"Chill Sky","genre":"Chill","duration":120,"url":""},
  {"id":"49","title":"Electronic Waves","genre":"Electronic","duration":180,"url":""},
  {"id":"50","title":"Epic Summit","genre":"Epic","duration":200,"url":""}
];

const musicLibrary: MusicTrack[] = rawMusicData.map((item) => {
  // Gera uma URL funcional para o preview (SoundHelix como mock estável)
  const soundId = (parseInt(item.id) % 15) + 1;
  const mockUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${soundId}.mp3`;
  
  return {
    id: item.id,
    title: item.title,
    artist: `${item.genre} Artist`,
    url: mockUrl,
    urlLow: mockUrl,
    urlHigh: mockUrl,
    attribution: parseInt(item.id) % 5 === 0, // 20% das músicas precisam de atribuição
    cover: `https://picsum.photos/seed/${item.title}/100/100`
  };
});

const MusicPicker: React.FC<MusicPickerProps> = ({ onSelect, onCancel }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playPreview = (music: MusicTrack) => {
    if (playingId === music.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const isWeak = liteModeManager.network.isConnectionWeak() || liteModeManager.isLiteEnabled;
    const finalUrl = isWeak ? music.urlLow : music.urlHigh;

    audioRef.current = new Audio(finalUrl);
    audioRef.current.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    setPlayingId(music.id);

    audioRef.current.onended = () => setPlayingId(null);
  };

  const handleSelect = (music: MusicTrack) => {
    if (music.attribution) {
      alert(`Atenção: Essa música precisa de atribuição: ${music.artist}`);
    }
    if (audioRef.current) audioRef.current.pause();
    onSelect(music);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[6000] flex flex-col animate-in slide-in-from-bottom duration-500 backdrop-blur-xl">
      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col p-6 lg:p-10">
        <div className="flex items-center justify-between mb-10 shrink-0">
          <button onClick={onCancel} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="text-right">
             <h2 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">Escolha uma música</h2>
             <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em]">50 Faixas Disponíveis</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 hide-scrollbar">
          {musicLibrary.map((music) => (
            <div 
              key={music.id} 
              className={`bg-zinc-900/40 border border-zinc-800 p-5 rounded-[2.5rem] flex items-center justify-between hover:border-zinc-700 transition-all group`}
            >
              <div className="flex items-center gap-5 min-w-0">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-zinc-800">
                  <img src={music.cover} className="w-full h-full object-cover" alt="" />
                  <button 
                    onClick={() => playPreview(music)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-xl">{playingId === music.id ? '⏸️' : '▶️'}</span>
                  </button>
                  {playingId === music.id && (
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black uppercase text-white tracking-tight truncate">{music.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{music.artist}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => playPreview(music)}
                  className={`px-4 py-2 rounded-xl border transition-all ${playingId === music.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black border-zinc-800 text-zinc-400'}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{playingId === music.id ? 'Ouvindo' : 'Ouvir'}</span>
                </button>
                <button 
                  onClick={() => handleSelect(music)}
                  className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl"
                >
                  Selecionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPicker;
