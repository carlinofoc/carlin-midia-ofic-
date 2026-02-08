import React from 'react';
import { Story } from '../types';
import { liteModeManager } from '../services/liteModeService';

interface StoriesProps {
  stories: Story[];
  onOpenStory: (index: number) => void;
}

const Stories: React.FC<StoriesProps> = ({ stories, onOpenStory }) => {
  return (
    <div className="flex items-center gap-5 p-6 overflow-x-auto hide-scrollbar bg-black/40 backdrop-blur-md border-b border-white/5">
      <div className="flex flex-col items-center gap-2.5 shrink-0 cursor-pointer group">
        <div className="relative">
          <div className="w-[76px] h-[76px] rounded-[1.8rem] p-[2.5px] bg-zinc-800 transition-all group-active:scale-95 shadow-lg">
            <div className="w-full h-full rounded-[1.6rem] bg-black overflow-hidden border-[3px] border-black flex items-center justify-center">
               <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">👤</span>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-xl flex items-center justify-center border-[3px] border-black text-white shadow-xl shadow-blue-600/30">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </div>
        </div>
        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Você</span>
      </div>

      {stories.map((story, index) => (
        <div key={story.id} className="flex flex-col items-center gap-2.5 shrink-0 cursor-pointer group" onClick={() => onOpenStory(index)}>
          <div className="relative">
            <div className={`w-[76px] h-[76px] rounded-[1.8rem] p-[2.5px] transition-all group-active:scale-95 shadow-lg ${
              story.viewed ? 'bg-zinc-900 border border-white/10' : 'bg-gradient-to-tr from-blue-400 via-indigo-600 to-purple-600'
            }`}>
              <div className="w-full h-full rounded-[1.6rem] bg-black overflow-hidden border-[3px] border-black">
                <img src={liteModeManager.getOptimizedImageUrl(story.userAvatar)} className="w-full h-full object-cover" alt={story.username} />
              </div>
            </div>
          </div>
          <span className={`text-[10px] truncate w-20 text-center font-black tracking-tight uppercase ${story.viewed ? 'text-zinc-600' : 'text-zinc-200'}`}>
            {story.username.replace('user_', '')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stories;