import React, { useState, useEffect } from 'react';
import { View, User, Post, Story, FeedMode, FeedItem, LiteConfig, LiteMode } from './types';
import { Icons, BrandLogo } from './constants';
import Feed from './components/Feed';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import Stories from './components/Stories';
import StoryViewer from './components/StoryViewer';
import TermsOfUse from './components/TermsOfUse';
import Registration from './components/Registration';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import Reels from './components/Reels';
import ImpactSocialScreen from './components/ImpactSocialScreen';
import MonetizationStatus from './components/MonetizationStatus';
import AdminPanel from './components/AdminPanel';
import LiveSession from './components/LiveSession';
import AdvancedSettings from './components/AdvancedSettings';
import { rankFeed } from './services/algorithmService';
import { dbService } from './services/dbService';
import { liteModeManager } from './services/liteModeService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [feedMode, setFeedMode] = useState<FeedMode>('relevance');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeLivePost, setActiveLivePost] = useState<Post | null>(null);
  const [liteMode, setLiteMode] = useState<LiteMode>(() => liteModeManager.getLiteMode());
  const [liteConfig, setLiteConfig] = useState<LiteConfig>(() => liteModeManager.getConfig());
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => localStorage.getItem('carlin_terms_accepted') === 'true');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const identity = dbService.verificarIdentidadeLocal();
    const sessionActive = sessionStorage.getItem('carlin_session') === 'true';

    if (!identity) {
      setCurrentView('register');
    } else if (sessionActive) {
      setCurrentUser({ ...identity, profileType: identity.profileType || "common" });
      setIsAuthenticated(true);
    } else {
      setCurrentView('login');
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    const loadLimit = liteMode === LiteMode.NORMAL ? 40 : 15;
    
    const generatedPosts: Post[] = Array.from({ length: loadLimit }).map((_, i) => ({
      id: `post-${i}`,
      autor_id: `u-${i}`,
      username: `criador_${i}`,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=post-${i}`,
      content: `Explorando o ecossistema Carlin Mídia. Onde tecnologia e propósito se encontram. #CarlinMidia #SocialWeb3`,
      category: ["Tech", "Life", "Design", "Code"][i % 4],
      media: [i % 4 === 0 ? 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-2322-large.mp4' : `https://picsum.photos/seed/post-${i}/1080/1080`],
      type: i % 4 === 0 ? 'video' : 'image',
      likes: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 200),
      views: Math.floor(Math.random() * 120000),
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      trendingScore: Math.floor(Math.random() * 100),
      timestamp: `${i + 1}h atrás`,
      isVerified: i % 5 === 0,
    }));

    setFeedItems(rankFeed(generatedPosts, currentUser));

    if (stories.length === 0) {
      setStories(Array.from({ length: 15 }).map((_, i) => ({
        id: `story-${i}`,
        userId: `s-${i}`,
        username: `user_${i}`,
        userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=story-${i}`,
        media: `https://picsum.photos/seed/story-${i}/1080/1920`,
        viewed: i > 7
      })));
    }
  }, [isAuthenticated, currentUser, liteMode]);

  const renderView = () => {
    if (!hasAcceptedTerms) return <TermsOfUse onAccept={() => { setHasAcceptedTerms(true); localStorage.setItem('carlin_terms_accepted', 'true'); }} showAcceptButton={true} />;
    if (!isAuthenticated) {
      if (currentView === 'register') return <Registration onComplete={(u) => { setCurrentUser(u); setIsAuthenticated(true); sessionStorage.setItem('carlin_session', 'true'); setCurrentView('feed'); }} onNavigateToLogin={() => setCurrentView('login')} />;
      return <Login onLogin={(u) => { setCurrentUser(u); setIsAuthenticated(true); sessionStorage.setItem('carlin_session', 'true'); setCurrentView('feed'); }} onNavigateToRegister={() => setCurrentView('register')} />;
    }

    switch (currentView) {
      case 'feed':
        return (
          <div className="flex flex-col w-full max-w-xl mx-auto pb-24 animate-slide-up">
            <div className="sticky top-0 z-[200] glass border-b border-white/5 px-6 pt-14 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <BrandLogo size="sm" />
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full border border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-[7px] font-black uppercase text-zinc-500 tracking-widest">{isOnline ? 'Live Sync' : 'Offline'}</span>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setCurrentView('create')} className="p-2.5 bg-zinc-900/50 hover:bg-zinc-800 rounded-2xl border border-white/5 transition-all active:scale-90"><Icons.Plus className="w-5 h-5" /></button>
                 <button className="p-2.5 bg-zinc-900/50 hover:bg-zinc-800 rounded-2xl border border-white/5 transition-all active:scale-90"><Icons.Message className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="flex bg-black/60 backdrop-blur-xl border-b border-white/5 sticky top-[108px] z-[150]">
              <TabItem active={feedMode === 'followers'} onClick={() => setFeedMode('followers')} label="Seguindo" />
              <TabItem active={feedMode === 'relevance'} onClick={() => setFeedMode('relevance')} label="Para Você" />
            </div>
            <Stories stories={stories} onOpenStory={(idx) => setActiveStoryIndex(idx)} />
            <Feed posts={feedItems} currentUser={currentUser!} liteConfig={liteConfig} onOpenLive={(p) => { setActiveLivePost(p); setCurrentView('live_session'); }} />
          </div>
        );
      case 'explore': return <Explore posts={feedItems as Post[]} />;
      case 'reels': return <Reels liteConfig={liteConfig} />;
      case 'profile': return (
        <Profile 
          user={currentUser!} onOpenTerms={() => setCurrentView('terms')} onOpenPrivacy={() => setCurrentView('privacy')} 
          isLite={liteMode !== LiteMode.NORMAL} onToggleLite={() => setLiteMode(prev => prev === LiteMode.NORMAL ? LiteMode.LITE_ANTIGO : LiteMode.NORMAL)} 
          isDark={darkMode} onToggleDark={() => setDarkMode(!darkMode)}
          onOpenDashboard={() => setCurrentView('dashboard')} onOpenVerification={() => setCurrentView('verification')} onUpdateUser={setCurrentUser}
          onOpenAdControls={() => setCurrentView('ad_controls')} onOpenManifesto={() => setCurrentView('monetization_manifesto')} onOpenBetaCenter={() => setCurrentView('beta_center')}
          onOpenCreatorPlus={() => setCurrentView('creator_plus')} onOpenRoadmap={() => setCurrentView('roadmap')} onOpenMonetizationInfo={() => setCurrentView('monetization_info')}
          onOpenNotificationSettings={() => setCurrentView('notification_settings')}
          onOpenDeveloperInfo={() => setCurrentView('developer_info')}
          onOpenDeveloperManifesto={() => setCurrentView('developer_manifesto')}
          onOpenAdvancedSettings={() => setCurrentView('advanced_settings')}
          onOpenImpactSocial={() => setCurrentView('impact_social')}
          onOpenMonetizationStatus={() => setCurrentView('monetization_status')}
          onOpenAdmin={() => setCurrentView('admin')}
        />
      );
      case 'create': return <CreatePost onCancel={() => setCurrentView('feed')} onPostCreated={(p) => { setFeedItems([p, ...feedItems]); setCurrentView('feed'); }} onStoryCreated={(s) => { setStories([s, ...stories]); setCurrentView('feed'); }} currentUser={currentUser!} />;
      case 'dashboard': return <Dashboard user={currentUser!} posts={feedItems as Post[]} onBack={() => setCurrentView('profile')} onOpenRoadmap={() => setCurrentView('roadmap')} onUpdateUser={setCurrentUser} />;
      case 'impact_social': return <ImpactSocialScreen user={currentUser!} onBack={() => setCurrentView('profile')} />;
      case 'monetization_status': return <MonetizationStatus user={currentUser!} onBack={() => setCurrentView('profile')} />;
      case 'advanced_settings': return <AdvancedSettings user={currentUser!} onBack={() => setCurrentView('profile')} isDark={darkMode} onToggleDark={() => setDarkMode(!darkMode)} currentMode={liteMode} onSetMode={setLiteMode} liteConfig={liteConfig} onUpdateLiteConfig={setLiteConfig} onOpenSecurityCenter={() => {}} />;
      case 'live_session': return <LiveSession post={activeLivePost!} user={currentUser!} onUpdateUser={setCurrentUser} onBack={() => setCurrentView('feed')} />;
      default: return <div className="p-20 text-center opacity-50 uppercase font-black text-xs">Em desenvolvimento</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-blue-600 antialiased overflow-hidden">
      {!isOnline && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-[9px] font-black uppercase tracking-widest py-1 text-center z-[10000] animate-in fade-in">
           Conexão Perdida • Modo Offline Ativo
        </div>
      )}

      {activeStoryIndex !== null && <StoryViewer stories={stories} initialIndex={activeStoryIndex} onClose={() => setActiveStoryIndex(null)} />}
      
      <main className="flex-1 overflow-y-auto hide-scrollbar scroll-smooth">
        {renderView()}
      </main>

      {isAuthenticated && (
        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 flex justify-around items-center h-24 px-6 pb-8 z-[500]">
          <NavButton icon={<Icons.Home className="w-6 h-6" />} active={currentView === 'feed'} onClick={() => setCurrentView('feed')} />
          <NavButton icon={<Icons.Search className="w-6 h-6" />} active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
          <NavButton icon={<Icons.Plus className="w-7 h-7" />} active={currentView === 'create'} onClick={() => setCurrentView('create')} center />
          <NavButton icon={<Icons.Play className="w-6 h-6" />} active={currentView === 'reels'} onClick={() => setCurrentView('reels')} />
          <NavButton icon={
            <div className={`w-7 h-7 rounded-full border-2 transition-all duration-300 ${currentView === 'profile' ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/20' : 'border-zinc-800'}`}>
               <img src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} className="w-full h-full rounded-full object-cover" />
            </div>
          } active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
        </nav>
      )}
    </div>
  );
};

const TabItem = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[0.25em] transition-all relative ${active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
    {label}
    {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
  </button>
);

const NavButton = ({ icon, active, onClick, center }: any) => (
  <button onClick={onClick} className={`flex items-center justify-center transition-all duration-300 active:scale-75 ${center ? 'bg-gradient-to-tr from-blue-600 to-indigo-700 p-3.5 rounded-2xl shadow-2xl shadow-blue-900/40 mb-12 transform -rotate-3 hover:rotate-0' : ''} ${active && !center ? 'text-blue-500 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'text-zinc-600 hover:text-zinc-400'}`}>
    {icon}
  </button>
);

export default App;
