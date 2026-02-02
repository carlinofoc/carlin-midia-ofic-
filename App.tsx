
import React, { useState, useEffect } from 'react';
import { View, User, Post, Story, Chat } from './types';
import { Icons } from './constants';
import Feed from './components/Feed';
import Explore from './components/Explore';
import Reels from './components/Reels';
import Messages from './components/Messages';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import Stories from './components/Stories';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import DownloadPage from './components/DownloadPage';

const MOCK_USER: User = {
  id: 'me',
  username: 'carlin_oficial',
  displayName: 'Carlin Mídia',
  avatar: 'https://picsum.photos/seed/carlin/200/200',
  bio: 'Criando conexões reais no mundo digital. 🚀\n👇 Baixe o APK Nativo Oficial abaixo!',
  followers: 48200,
  following: 124,
  isVerified: true
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    return localStorage.getItem('carlin_terms_accepted') === 'true';
  });
  
  useEffect(() => {
    // Mock Data initialization
    const initialPosts: Post[] = Array.from({ length: 15 }).map((_, i) => ({
      id: `post-${i}`,
      userId: `user-${i}`,
      username: `criador_${i + 1}`,
      userAvatar: `https://picsum.photos/seed/avatar-${i}/100/100`,
      content: i % 3 === 0 
        ? "Acabei de atualizar o app! O novo APK está incrível e muito mais rápido. Recomendo baixar! ⚡️ #Update #Android" 
        : "Capturando a essência do momento. Carlin Mídia Ofic. ✨ #Vibe #Social",
      media: [`https://picsum.photos/seed/post-img-${i}/1080/1350`],
      type: 'image',
      likes: Math.floor(Math.random() * 85000),
      comments: Math.floor(Math.random() * 1200),
      timestamp: `${i + 1}h atrás`,
      location: i % 4 === 0 ? "São Paulo, Brasil" : undefined
    }));
    setPosts(initialPosts);

    const initialStories: Story[] = Array.from({ length: 15 }).map((_, i) => ({
      id: `story-${i}`,
      userId: `user-${i}`,
      username: `user_${i + 1}`,
      userAvatar: `https://picsum.photos/seed/story-av-${i}/100/100`,
      media: `https://picsum.photos/seed/story-img-${i}/1080/1920`,
      viewed: i > 6
    }));
    setStories(initialStories);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('carlin_terms_accepted', 'true');
    setHasAcceptedTerms(true);
    setCurrentView('feed');
  };

  const handleDownloadStart = () => {
    console.log("Download de APK solicitado.");
    // Aqui poderíamos disparar algum evento de analytics
  };

  const renderView = () => {
    if (!hasAcceptedTerms) {
      return (
        <div className="fixed inset-0 z-[2000] bg-black">
          <TermsOfUse onAccept={handleAcceptTerms} showAcceptButton={true} />
        </div>
      );
    }

    switch (currentView) {
      case 'feed':
        return (
          <div className="flex flex-col w-full max-w-xl mx-auto pt-14 lg:pt-4">
            <Stories stories={stories} />
            <Feed posts={posts} />
          </div>
        );
      case 'explore': return <Explore />;
      case 'reels': return <Reels />;
      case 'messages': return <Messages />;
      case 'profile': return <Profile user={MOCK_USER} onOpenTerms={() => setCurrentView('terms')} onOpenPrivacy={() => setCurrentView('privacy')} />;
      case 'create': return <CreatePost onPostCreated={(p) => setPosts([p, ...posts])} onCancel={() => setCurrentView('feed')} />;
      case 'download': return <DownloadPage onInstall={handleDownloadStart} canInstall={true} />;
      case 'terms': return <TermsOfUse />;
      case 'privacy': return <PrivacyPolicy />;
      default: return <Feed posts={posts} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row font-sans selection:bg-blue-500/40">
      {/* Sidebar Desktop */}
      {hasAcceptedTerms && (
        <nav className="hidden lg:flex flex-col w-72 border-r border-zinc-900 p-8 sticky top-0 h-screen gap-4">
          <div className="py-6 px-4 mb-8">
            <h1 className="text-3xl font-black italic tracking-tighter text-blue-500 select-none">CARLIN</h1>
          </div>
          <NavButton icon={<Icons.Home className="w-6 h-6" />} label="Página Inicial" active={currentView === 'feed'} onClick={() => setCurrentView('feed')} />
          <NavButton icon={<Icons.Search className="w-6 h-6" />} label="Explorar" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
          <NavButton icon={<Icons.Play className="w-6 h-6" />} label="Reels" active={currentView === 'reels'} onClick={() => setCurrentView('reels')} />
          <NavButton icon={<Icons.Message className="w-6 h-6" />} label="Mensagens" active={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
          <NavButton icon={<Icons.Plus className="w-6 h-6" />} label="Criar" active={currentView === 'create'} onClick={() => setCurrentView('create')} />
          <NavButton icon={<Icons.User className="w-6 h-6" />} label="Perfil" active={['profile', 'terms', 'privacy'].includes(currentView)} onClick={() => setCurrentView('profile')} />
          
          <div className="mt-auto pt-8 border-t border-zinc-900">
            <button 
              onClick={() => setCurrentView('download')}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 group ${currentView === 'download' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'hover:bg-zinc-900 text-zinc-500 hover:text-white'}`}
            >
              <div className="text-xl group-hover:scale-125 transition-transform">📲</div>
              <span className="font-black italic text-xs tracking-[0.1em]">BAIXAR APK</span>
            </button>
          </div>
        </nav>
      )}

      {/* Header Mobile */}
      {hasAcceptedTerms && currentView !== 'reels' && !['terms', 'privacy', 'download', 'create'].includes(currentView) && (
        <header className="lg:hidden fixed top-0 w-full bg-black/80 backdrop-blur-2xl border-b border-zinc-900 z-[100] flex items-center justify-between px-4 h-14">
          <h1 className="text-2xl font-black italic tracking-tighter text-blue-500">CARLIN</h1>
          <div className="flex items-center gap-5">
            <button onClick={() => setCurrentView('download')} className={`transition-transform active:scale-90 ${currentView === 'download' ? 'text-blue-500' : 'text-zinc-400'}`}>
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
            <button onClick={() => setCurrentView('messages')} className="active:scale-90 transition-transform"><Icons.Message className="w-6 h-6" /></button>
          </div>
        </header>
      )}

      {/* View Content */}
      <main className="flex-1 bg-black overflow-y-auto overflow-x-hidden relative">
        {renderView()}
      </main>

      {/* Navbar Mobile */}
      {hasAcceptedTerms && (
        <nav className="lg:hidden fixed bottom-0 w-full bg-black/95 backdrop-blur-xl border-t border-zinc-900 flex justify-around items-center h-16 z-[100] pb-safe shadow-2xl">
          <button onClick={() => setCurrentView('feed')} className={`p-2 transition-transform active:scale-75 ${currentView === 'feed' ? 'text-white' : 'text-zinc-600'}`}><Icons.Home className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('explore')} className={`p-2 transition-transform active:scale-75 ${currentView === 'explore' ? 'text-white' : 'text-zinc-600'}`}><Icons.Search className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('create')} className={`p-2 transition-transform active:scale-75 ${currentView === 'create' ? 'text-white' : 'text-zinc-600'}`}><Icons.Plus className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('reels')} className={`p-2 transition-transform active:scale-75 ${currentView === 'reels' ? 'text-white' : 'text-zinc-600'}`}><Icons.Play className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('profile')} className={`p-2 transition-transform active:scale-75 ${['profile', 'terms', 'privacy', 'download'].includes(currentView) ? 'text-white' : 'text-zinc-600'}`}><Icons.User className="w-7 h-7" /></button>
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 group ${active ? 'bg-zinc-900 shadow-xl' : 'hover:bg-zinc-900'}`}
  >
    <div className={`${active ? 'scale-110 text-blue-500' : 'group-hover:scale-110 text-zinc-600'} transition-transform`}>
      {icon}
    </div>
    <span className={`text-base tracking-tight ${active ? 'font-black text-white' : 'font-medium text-zinc-500'}`}>{label}</span>
  </button>
);

export default App;
