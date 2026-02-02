
import React, { useState } from 'react';
import { Icons } from '../constants';

const EXPLORE_CATEGORIES = ['For You', 'Trending', 'Art', 'Music', 'Tech', 'Travel', 'Food'];

const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState('For You');

  return (
    <div className="w-full max-w-4xl mx-auto pt-16 lg:pt-8 p-4">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search creators, hashtags, locations..."
          className="w-full bg-zinc-900 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-zinc-700 transition-all outline-none"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-6">
        {EXPLORE_CATEGORIES.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === cat ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discovery Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className={`relative aspect-square bg-zinc-900 overflow-hidden cursor-pointer group ${i % 7 === 0 ? 'col-span-2 row-span-2' : ''}`}>
            <img 
              src={`https://picsum.photos/seed/explore${i}/600/600`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
               <div className="flex items-center gap-1 font-bold"><Icons.Heart filled className="w-5 h-5" /> {Math.floor(Math.random() * 500)}</div>
               <div className="flex items-center gap-1 font-bold"><Icons.Comment className="w-5 h-5" /> {Math.floor(Math.random() * 50)}</div>
            </div>
            {i % 4 === 0 && <Icons.Play className="absolute top-2 right-2 w-5 h-5 drop-shadow-lg" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
