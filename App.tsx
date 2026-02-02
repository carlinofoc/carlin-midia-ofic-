
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    return localStorage.getItem('carlin_terms_accepted') === 'true';
  });
  
  useEffect(() => {
    // Configura detecção de instalação PWA (Ponte Nativa Android)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('App pronto para ser envelopado nativamente.');
    });

    // Mock Data initialization
    const initialPosts: Post[] = Array.from({ length: 15 }).map((_, i) => ({
      id: `post-${i}`,
      userId: `user-${i}`,
      username: `criador_${i + 1}`,
      userAvatar: `https://picsum.photos/seed/avatar-${i}/100/100`,
      content: i % 3 === 0 
        ? "Acabei de atualizar o app nativo! O novo APK está incrível e muito mais rápido. Recomendo baixar! ⚡️ #Update #Android #Native" 
        : "Vivendo o melhor da tecnologia mobile. Carlin Mídia Ofic. ✨ #Vibe #SocialApp",
      media: [`https://picsum.photos/seed/post-img-${i}/1080/1350`],
      type: 'image',
      likes: Math.floor(Math.random() * 85000),
      comments: Math.floor(Math.random() * 1200),
      timestamp: `${i + 1}h atrás`,
      location: i % 4 === 0 ? "Brasil" : undefined
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

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      // Instruções para download manual de APK no Android
      console.log("Iniciando download binário direto...");
    }
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
      case 'download': return <DownloadPage onInstall={handleNativeInstall} canInstall={!!deferredPrompt} />;
      case 'terms': return <TermsOfUse />;
      case 'privacy': return <PrivacyPolicy />;
      default: return <Feed posts={posts} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row font-sans selection:bg-blue-600/30 overflow-hidden">
      {/* Sidebar Desktop (IG Native Style) */}
      {hasAcceptedTerms && (
        <nav className="hidden lg:flex flex-col w-72 border-r border-zinc-900 p-8 sticky top-0 h-screen gap-4 bg-black shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="py-6 px-4 mb-8">
            <h1 className="text-3xl font-black italic tracking-tighter text-blue-600 select-none animate-pulse">CARLIN</h1>
          </div>
          <NavButton icon={<Icons.Home className="w-6 h-6" />} label="Início" active={currentView === 'feed'} onClick={() => setCurrentView('feed')} />
          <NavButton icon={<Icons.Search className="w-6 h-6" />} label="Explorar" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
          <NavButton icon={<Icons.Play className="w-6 h-6" />} label="Reels" active={currentView === 'reels'} onClick={() => setCurrentView('reels')} />
          <NavButton icon={<Icons.Message className="w-6 h-6" />} label="Mensagens" active={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
          <NavButton icon={<Icons.Plus className="w-6 h-6" />} label="Publicar" active={currentView === 'create'} onClick={() => setCurrentView('create')} />
          <NavButton icon={<Icons.User className="w-6 h-6" />} label="Meu Perfil" active={['profile', 'terms', 'privacy'].includes(currentView)} onClick={() => setCurrentView('profile')} />
          
          <div className="mt-auto pt-8 border-t border-zinc-900/50">
            <button 
              onClick={() => setCurrentView('download')}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 group ${currentView === 'download' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' : 'hover:bg-zinc-900 text-zinc-500 hover:text-white'}`}
            >
              <div className="text-xl group-hover:scale-125 transition-transform">🤖</div>
              <span className="font-black italic text-xs tracking-widest">BUILD APK</span>
            </button>
          </div>
        </nav>
      )}

      {/* Header Mobile (Fixed Native) */}
      {hasAcceptedTerms && currentView !== 'reels' && !['terms', 'privacy', 'download', 'create'].includes(currentView) && (
        <header className="lg:hidden fixed top-0 w-full bg-black border-b border-zinc-900/50 z-[100] flex items-center justify-between px-6 h-14 shadow-lg">
          <h1 className="text-2xl font-black italic tracking-tighter text-blue-600">CARLIN</h1>
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView('download')} className={`transition-transform active:scale-90 ${currentView === 'download' ? 'text-blue-600' : 'text-zinc-500'}`}>
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
            <button onClick={() => setCurrentView('messages')} className="active:scale-90 transition-transform"><Icons.Message className="w-6 h-6 text-zinc-300" /></button>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="flex-1 bg-black overflow-y-auto overflow-x-hidden h-screen scroll-smooth hide-scrollbar">
        {renderView()}
      </main>

      {/* Bottom Nav Mobile (Glassmorphism Native Style) */}
      {hasAcceptedTerms && (
        <nav className="lg:hidden fixed bottom-0 w-full bg-black/80 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center h-16 z-[100] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <button onClick={() => setCurrentView('feed')} className={`p-3 transition-all active:scale-75 ${currentView === 'feed' ? 'text-white' : 'text-zinc-600'}`}><Icons.Home className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('explore')} className={`p-3 transition-all active:scale-75 ${currentView === 'explore' ? 'text-white' : 'text-zinc-600'}`}><Icons.Search className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('create')} className={`p-3 transition-all active:scale-75 ${currentView === 'create' ? 'text-white' : 'text-zinc-600'}`}><Icons.Plus className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('reels')} className={`p-3 transition-all active:scale-75 ${currentView === 'reels' ? 'text-white' : 'text-zinc-600'}`}><Icons.Play className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('profile')} className={`p-3 transition-all active:scale-75 ${['profile', 'terms', 'privacy', 'download'].includes(currentView) ? 'text-white' : 'text-zinc-600'}`}><Icons.User className="w-7 h-7" /></button>
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-5 p-4 rounded-[1.5rem] transition-all duration-300 group ${active ? 'bg-zinc-900/80 shadow-inner' : 'hover:bg-zinc-900/40'}`}
  >
    <div className={`${active ? 'scale-110 text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'group-hover:scale-110 text-zinc-600'} transition-transform duration-300`}>
      {icon}
    </div>
    <span className={`text-sm tracking-tight ${active ? 'font-black text-white' : 'font-semibold text-zinc-500'}`}>{label}</span>
  </button>
);

export default App;
