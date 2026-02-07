
import React from 'react';
import { Story, LiteMode } from '../types';
import { liteModeManager } from '../services/liteModeService';

interface StoriesProps {
  stories: Story[];
  onOpenStory: (index: number) => void;
}

/**
 * Carlin Stories v5.2 - Replicates the "Premium" look from the official brand identity.
 */
const Stories: React.FC<StoriesProps> = ({ stories, onOpenStory }) => {
  const isLite = liteModeManager.getLiteMode() !== LiteMode.NORMAL;

  return (
    <div className="flex items-center gap-4 p-5 overflow-x-auto hide-scrollbar bg-black border-b border-zinc-900/50 backdrop-blur-md sticky top-14 lg:top-0 z-[75]">
      {/* Meu Story (Trigger de Criação) */}
      <div className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
        <div className="relative">
          <div className="w-[74px] h-[74px] rounded-full p-[2px] bg-zinc-800 transition-all group-active:scale-95">
            <div className="w-full h-full rounded-full bg-black overflow-hidden border-[3px] border-black relative">
              <img 
                src={liteModeManager.getOptimizedImageUrl("https://picsum.photos/seed/carlin_me/200/200")} 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
                alt="Meu Perfil"
              />
            </div>
          </div>
          {/* Add Icon with Brand Blue */}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-[3px] border-black text-white shadow-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none">Você</span>
      </div>

      {/* Listagem de Stories Dinâmica */}
      {stories.map((story, index) => (
        <div 
          key={story.id} 
          className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
          onClick={() => onOpenStory(index)}
        >
          <div className="relative">
            {/* Brand Gradient Ring: Cyan -> Purple -> Orange */}
            <div className={`w-[74px] h-[74px] rounded-full p-[2.5px] transition-all group-active:scale-95 ${
              story.viewed 
                ? 'bg-zinc-800' 
                : 'bg-gradient-to-tr from-cyan-400 via-purple-600 to-orange-500'
            }`}>
              {/* Pulse animation for new stories (Disabled in Lite Mode) */}
              {!story.viewed && !isLite && (
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping"></div>
              )}
              
              <div className="w-full h-full rounded-full bg-black overflow-hidden border-[3px] border-black relative z-10">
                <img 
                  src={liteModeManager.getOptimizedImageUrl(story.userAvatar)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={story.username}
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Small status indicator (optional functionality placeholder) */}
            {!story.viewed && (
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-black"></div>
            )}
          </div>
          
          <span className={`text-[10px] truncate w-16 text-center font-bold uppercase tracking-tighter ${
            story.viewed ? 'text-zinc-600' : 'text-zinc-200'
          }`}>
            {story.username.replace('@', '')}
          </span>
        </div>
      ))}

      {/* Decorative Spacer for end of scroll */}
      <div className="w-4 shrink-0"></div>
    </div>
  );
};

export default Stories;
