
import React, { useState, useEffect, useCallback } from 'react';
import { Story, LiteMode } from '../types';
import { Icons } from '../constants';
import { liteModeManager } from '../services/liteModeService';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const STORY_DURATION = 5000;

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isHighQuality, setIsHighQuality] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const isLiteMode = liteModeManager.getLiteMode() !== LiteMode.NORMAL;

  useEffect(() => {
    const quality = liteModeManager.network.getQuality();
    if (liteModeManager.network.isConnectionWeak() || isLiteMode) {
      setIsHighQuality(false);
    }

    const interval = setInterval(() => {
      const shouldBeHigh = !liteModeManager.network.isConnectionWeak() && !isLiteMode;
      if (shouldBeHigh !== isHighQuality) {
        setIsHighQuality(shouldBeHigh);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHighQuality, isLiteMode]);

  const next = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = 50;
    const increment = (interval / STORY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [next, isPaused]);

  const currentStory = stories[currentIndex];
  const imageUrl = liteModeManager.getOptimizedImageUrl(currentStory.media);
  const displayUrl = isHighQuality 
    ? imageUrl 
    : `${currentStory.media}${currentStory.media.includes('?') ? '&' : '?'}w=300&q=20&blur=2`;

  return (
    <div className="fixed inset-0 z-[3000] bg-black flex items-center justify-center animate-in fade-in duration-300">
      <div className="relative w-full h-full max-w-lg bg-zinc-900 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        <div className="absolute top-20 left-4 z-[60] flex flex-col gap-2">
           <div className={`px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest w-fit ${
             isHighQuality ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-orange-600/10 border-orange-500/30 text-orange-400'
           }`}>
             {isHighQuality ? 'HD Stream' : 'Low Data Mode'}
           </div>
           
           {currentStory.musicAttribution && (
             <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 animate-in slide-in-from-left-2 duration-500">
                <p className="text-[9px] font-black text-white uppercase tracking-tighter italic">
                  🎵 Música: {currentStory.musicAttribution} <span className="text-zinc-500 text-[7px] tracking-widest">(YouTube Audio Library)</span>
                </p>
             </div>
           )}
        </div>

        <div className="absolute top-4 left-4 right-4 z-50 flex gap-1.5">
          {stories.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-75 ${isLiteMode ? 'transition-none' : ''}`}
                style={{ 
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-8 left-4 right-4 z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-purple-600">
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-black">
                <img src={currentStory.userAvatar} className="w-full h-full object-cover" alt={currentStory.username} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white drop-shadow-md">{currentStory.username.replace('@', '')}</span>
              <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest drop-shadow-md">
                {isHighQuality ? 'Alta Fidelidade' : 'Conexão Instável'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div 
          className="flex-1 bg-black flex items-center justify-center relative select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <img 
            key={currentIndex} 
            src={displayUrl} 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isHighQuality ? 'opacity-100' : 'opacity-90 grayscale-[0.2]'}`}
            alt="Story content" 
            onLoad={() => setIsPaused(false)}
          />
          {!isHighQuality && (
            <div className="absolute bottom-32 left-0 w-full text-center px-6">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 bg-black/20 backdrop-blur-sm py-2 rounded-full border border-white/5">
                Reduzindo bits para economizar sua franquia
              </p>
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex z-40">
          <div className="w-1/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); prev(); }} />
          <div className="flex-1 h-full" />
          <div className="w-1/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); next(); }} />
        </div>

        <div className="absolute bottom-8 left-4 right-4 z-50 flex items-center gap-4">
           <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
              <span className="text-white/50 text-sm font-medium">Responder...</span>
           </div>
           <button className="p-3 text-white"><Icons.Heart className="w-7 h-7" /></button>
           <button className="p-3 text-white"><Icons.Share className="w-7 h-7" /></button>
        </div>

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 pointer-events-none">
           <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
              {currentIndex + 1} / {stories.length}
           </span>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
