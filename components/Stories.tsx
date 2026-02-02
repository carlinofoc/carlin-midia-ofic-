
import React from 'react';
import { Story } from '../types';

interface StoriesProps {
  stories: Story[];
}

const Stories: React.FC<StoriesProps> = ({ stories }) => {
  return (
    <div className="flex items-center gap-4 p-4 overflow-x-auto hide-scrollbar bg-black border-b border-zinc-900">
      {/* Meu Story */}
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <div className="relative">
          <div className="w-[72px] h-[72px] rounded-full p-[2.5px] bg-zinc-800">
            <div className="w-full h-full rounded-full bg-black overflow-hidden border-2 border-black">
              <img src="https://picsum.photos/seed/me/100/100" className="w-full h-full object-cover opacity-60" />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black text-white font-black text-xs">
            +
          </div>
        </div>
        <span className="text-[10px] text-zinc-500 font-medium">Seu story</span>
      </div>

      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className={`w-[72px] h-[72px] rounded-full p-[2.5px] ${story.viewed ? 'bg-zinc-800' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
            <div className="w-full h-full rounded-full bg-black overflow-hidden border-2 border-black">
              <img 
                src={story.userAvatar} 
                className="w-full h-full object-cover group-active:scale-90 transition-transform" 
              />
            </div>
          </div>
          <span className={`text-[10px] truncate w-16 text-center ${story.viewed ? 'text-zinc-500' : 'text-zinc-200'} font-medium`}>
            {story.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
