
import React, { useState } from 'react';
import { Icons } from '../constants';
import { LiteConfig } from '../types';
import { liteModeManager } from '../services/liteModeService';

interface ReelsProps {
  liteConfig: LiteConfig;
}

const REELS_DATA = [
  { id: 1, video: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-2322-large.mp4', user: '@neon_pulse', likes: '2.4M', comments: '12K', caption: 'Living in the future 🌌 #Cyberpunk #Vibes' },
  { id: 2, video: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-leaves-low-angle-shot-4720-large.mp4', user: '@nature_daily', likes: '850K', comments: '5K', caption: 'Autumn colors are just built different 🍂' },
  { id: 3, video: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-a-cliff-4293-large.mp4', user: '@wanderlust', likes: '1.2M', comments: '8K', caption: 'Peace found here. 🌊 #Ocean #Travel' },
];

const Reels: React.FC<ReelsProps> = ({ liteConfig }) => {
  return (
    <div className="h-screen w-full lg:max-w-[400px] lg:mx-auto bg-black overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
      {REELS_DATA.map((reel) => (
        <ReelItem key={reel.id} reel={reel} liteConfig={liteConfig} />
      ))}
    </div>
  );
};

const ReelItem: React.FC<{ reel: any; liteConfig: LiteConfig }> = ({ reel, liteConfig }) => {
  // Carlin Engine logic for Reels
  // if (LiteModeManager.isLiteEnabled()) { setAutoPlay(false) } 
  // else { setAutoPlay(true) }
  // Corrected getter access: isLiteEnabled is a getter, not a method
  const isLite = liteModeManager.isLiteEnabled;
  const autoPlayEnabled = !isLite || !liteConfig.disableAutoPlayVideos;
  
  const [isPlaying, setIsPlaying] = useState(autoPlayEnabled);

  return (
    <div className="relative h-screen w-full snap-start flex items-center justify-center group">
      <video 
        src={reel.video} 
        className="h-full w-full object-cover" 
        autoPlay={autoPlayEnabled}
        loop 
        muted 
        playsInline
        onClick={() => setIsPlaying(!isPlaying)}
      />

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none"></div>

      {/* Right side buttons */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-10">
        <div className="flex flex-col items-center gap-1 group/btn cursor-pointer">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-md group-active/btn:scale-125 transition-transform"><Icons.Heart className="w-8 h-8 text-white" /></div>
          <span className="text-xs font-semibold">{reel.likes}</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-md"><Icons.Comment className="w-8 h-8 text-white" /></div>
          <span className="text-xs font-semibold">{reel.comments}</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-md"><Icons.Share className="w-8 h-8 text-white" /></div>
        </div>
        <div className="p-1 border-2 border-white rounded-lg overflow-hidden w-8 h-8 cursor-pointer animate-spin-slow">
           <img src="https://picsum.photos/seed/music/50/50" className="w-full h-full rounded" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-10 left-4 right-20 z-10 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
            <img src={`https://picsum.photos/seed/${reel.user}/100/100`} alt="user" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-sm">{reel.user}</span>
          <button className="px-3 py-1 border border-white rounded-lg text-xs font-bold hover:bg-white hover:text-black transition-colors">Follow</button>
        </div>
        <p className="text-sm line-clamp-2">{reel.caption}</p>
        <div className="flex items-center gap-2 text-sm bg-black/30 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
           <Icons.Play className="w-3 h-3" />
           <span className="text-xs">Original Audio - {reel.user}</span>
        </div>
      </div>

      {(!isPlaying || (!autoPlayEnabled && !isPlaying)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <Icons.Play className="w-20 h-20 opacity-50" />
          {isLite && liteConfig.disableAutoPlayVideos && (
             <span className="absolute bottom-32 text-[8px] font-black uppercase text-white/40 tracking-widest">Autoplay Inativo (Lite Mode)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Reels;
