
import React from 'react';
import { Story } from '../types';

interface StoriesProps {
  stories: Story[];
}

const Stories: React.FC<StoriesProps> = ({ stories }) => {
  return (
    <div className="flex items-center gap-4 p-4 overflow-x-auto hide-scrollbar border-b border-zinc-900 bg-black/50">
      {/* User's Own Story */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="relative group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-zinc-800 p-[2px]">
            <div className="w-full h-full rounded-full bg-black overflow-hidden">
               <img src="https://picsum.photos/seed/me/100/100" className="w-full h-full object-cover opacity-60" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black text-white font-bold text-lg leading-none">
            +
          </div>
        </div>
        <span className="text-[10px] text-zinc-400">Your Story</span>
      </div>

      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer">
          <div className={`w-16 h-16 rounded-full p-[2px] ${story.viewed ? 'bg-zinc-800' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
            <div className="w-full h-full rounded-full bg-black overflow-hidden border-2 border-black">
              <img 
                src={story.userAvatar} 
                alt={story.username} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <span className="text-[10px] text-zinc-300 truncate w-16 text-center">{story.username}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
