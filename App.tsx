import React, { useState, useEffect, useCallback } from 'react';
import { View, User, Post, Story, FeedMode, FeedFormatPreference, FeedItem, Ad, AdCategoryConfig, NotificationPrefs } from './types';
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
import Registration from './components/Registration';
import Login from './components/Login';
import ReachInfo from './components/ReachInfo';
import NotificationSystem from './components/NotificationSystem';
import Dashboard from './components/Dashboard';
import VerificationProcess from './components/VerificationProcess';
import BiometricPolicy from './components/BiometricPolicy';
import AdControlPanel from './components/AdControlPanel';
import MonetizationManifesto from './components/MonetizationManifesto';
import BetaCenter from './components/BetaCenter';
import CreatorPlus from './components/CreatorPlus';
import BetaTerms from './components/BetaTerms';
import Roadmap from './components/Roadmap';
import CreatorPlusFAQ from './components/CreatorPlusFAQ';
import MonetizationInfo from './components/MonetizationInfo';
import CancelSubscription from './components/CancelSubscription';
import NotificationSettings from './components/NotificationSettings';
import DeveloperInfo from './components/DeveloperInfo';
import DeveloperManifesto from './components/DeveloperManifesto';
import AdvancedSettings from './components/AdvancedSettings';
import SecurityCenter from './components/SecurityCenter';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [feedMode, setFeedMode] = useState<FeedMode>('relevance');
  const [formatPreference, setFormatPreference] = useState<FeedFormatPreference>('balanced');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showReachInfo, setShowReachInfo] = useState(false);
  
  const [showInstaBanner, setShowInstaBanner] = useState<boolean>(() => {
    return localStorage.getItem('carlin_insta_banner_closed') !== 'true';
  });

  const [liteMode, setLiteMode] = useState<boolean>(() => localStorage.getItem('carlin_lite_mode') === 'true');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('carlin_dark_mode');
    return saved === null ? true : saved === 'true';
  });
  
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    return localStorage.getItem('carlin_terms_accepted') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Efeito para carregar sessão existente
  useEffect(() => {
    const saved = localStorage.getItem('carlin_user');
    const sessionActive = sessionStorage.getItem('carlin_session') === 'true';
    if (saved && sessionActive) {
      setCurrentUser(JSON.parse(saved));
      setIsAuthenticated(true);
    }
  }, []);

  // Configuração inicial de anúncios
  const [adConfig, setAdConfig] = useState<AdCategoryConfig>(() => {
    const saved = localStorage.getItem('carlin_ad_config');
    return saved ? JSON.parse(saved) : {
      education: true,
      tech: true,
      tools: true,
      investments: true,
      brands: true,
      casino: false 
    };
  });
  
  useEffect(() => {
    localStorage.setItem('carlin_lite_mode', liteMode.toString());
    localStorage.setItem('carlin_dark_mode', darkMode.toString());
    localStorage.setItem('carlin_ad_config', JSON.stringify(adConfig));
    
    const loadLimit = liteMode ? 15 : 40;
    
    const generatedPosts: Post[] = Array.from({ length: loadLimit }).map((_, i) => {
      const isFollower = i < (loadLimit * 0.3); 
      const category = ['Estratégia', 'Growth', 'Design', 'Monetização', 'Storytelling'][i % 5];
      const type: 'image' | 'video' | 'carousel' = i % 3 === 0 ? 'video' : (i % 3 === 1 ? 'carousel' : 'image');
      const relevanceScore = Math.floor(Math.random() * 35) + 65; 
      const isSuspicious = i % 10 === 0 && i !== 0; 
      const isVerified = i % 4 === 0 && !isSuspicious;

      // Corrected 'userId' to 'autor_id' and ensured all required Post properties are present
      return {
        id: `unified-${i}`,
        autor_id: `u-${i}`,
        username: isSuspicious ? `carlin_copia_${i}` : (isFollower ? `criador_parceiro_${i}` : `expert_relevante_${i}`),
        userAvatar: `https://picsum.photos/seed/unified-${i}/150/150`,
        content: isSuspicious ? "GANHE SEGUIDORES GRÁTIS!" : `Masterclass em ${category}. Valor real para seu perfil.`,
        media: type === 'video' 
          ? ['https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-2322-large.mp4'] 
          : [`https://picsum.photos/seed/unified-media-${i}/1080/1080`],
        type,
        likes: isSuspicious ? 12 : Math.floor(Math.random() * 12000),
        comments: isSuspicious ? 2 : Math.floor(Math.random() * 450),
        timestamp: `${i + 1}h atrás`,
        category: category,
        isFromFollower: isFollower,
        stats: {
          followerReach: isSuspicious ? 0 : Math.floor(Math.random() * 1000),
          nonFollowerReach: isSuspicious ? 0 : Math.floor(Math.random() * 5000),
          relevanceScore: isSuspicious ? 15 : relevanceScore,
          engagementRate: isSuspicious ? 0.1 : parseFloat((Math.random() * 18 + 7).toFixed(1)),
          saves: isSuspicious ? 0 : Math.floor(Math.random() * 1200),
          shares: isSuspicious ? 0 : Math.floor(Math.random() * 400),
          isContinuousCirculation: !isSuspicious && relevanceScore > 80
        },
        userRiskLevel: isSuspicious ? 'medium' : undefined,
        isSuspicious: isSuspicious,
        isVerified: isVerified
      } as Post;
    });

    setFeedItems(generatedPosts);

    const initialStories: Story[] = Array.from({ length: 12 }).map((_, i) => ({
      id: `story-${i}`,
      userId: `s-${i}`,
      username: `criador_${i}`,
      userAvatar: `https://picsum.photos/seed/story-${i}/100/100`,
      media: `https://picsum.photos/seed/sm-${i}/1080/1920`,
      viewed: i > 8
    }));
    setStories(initialStories);
  }, [liteMode, darkMode, adConfig]);

  const handleRegistrationComplete = (user: User, startLite: boolean) => {
    localStorage.setItem('carlin_user', JSON.stringify(user));
    localStorage.setItem('carlin_lite_mode', startLite.toString());
    sessionStorage.setItem('carlin_session', 'true');
    setLiteMode(startLite);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('feed');
  };

  const handleLoginComplete = (user: User) => {
    sessionStorage.setItem('carlin_session', 'true');
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('feed');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('carlin_session');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('carlin_user', JSON.stringify(updatedUser));
  };

  const renderView = () => {
    if (!hasAcceptedTerms) return <TermsOfUse onAccept={() => setHasAcceptedTerms(true)} showAcceptButton={true} />;
    if (!isAuthenticated) {
        if (currentView === 'register') return <Registration onComplete={handleRegistrationComplete} onNavigateToLogin={() => setCurrentView('login')} />;
        return <Login onLogin={handleLoginComplete} onNavigateToRegister={() => setCurrentView('register')} />;
    }

    switch (currentView) {
      case 'feed':
        return (
          <div className="flex flex-col w-full max-w-xl mx-auto pt-14 lg:pt-4">
            <div className={`sticky top-14 lg:top-0 z-[80] flex border-b ${darkMode ? 'bg-black/95 border-zinc-900' : 'bg-white/95 border-zinc-200'} backdrop-blur-md`}>
              <button onClick={() => setFeedMode('followers')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${feedMode === 'followers' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}>Seguindo</button>
              <button onClick={() => setFeedMode('relevance')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${feedMode === 'relevance' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}>Entrega Total</button>
              <button onClick={() => setFeedMode('discovery')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${feedMode === 'discovery' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}>Descoberta</button>
            </div>
            <Stories stories={stories} />
            <Feed posts={feedItems} currentUser={currentUser!} showInstaBanner={showInstaBanner} onCloseBanner={() => setShowInstaBanner(false)} onOpenInfo={() => setShowReachInfo(true)} onOpenCreate={() => setCurrentView('create')} />
          </div>
        );
      case 'profile': return (
        <Profile 
          user={currentUser!} onOpenTerms={() => setCurrentView('terms')} onOpenPrivacy={() => setCurrentView('privacy')} 
          isLite={liteMode} onToggleLite={() => setLiteMode(!liteMode)} isDark={darkMode} onToggleDark={() => setDarkMode(!darkMode)}
          onOpenDashboard={() => setCurrentView('dashboard')} onOpenVerification={() => setCurrentView('verification')} onUpdateUser={handleUpdateUser}
          onOpenAdControls={() => setCurrentView('ad_controls')} onOpenManifesto={() => setCurrentView('monetization_manifesto')} onOpenBetaCenter={() => setCurrentView('beta_center')}
          onOpenCreatorPlus={() => setCurrentView('creator_plus')} onOpenRoadmap={() => setCurrentView('roadmap')} onOpenMonetizationInfo={() => setCurrentView('monetization_info')}
          onOpenNotificationSettings={() => setCurrentView('notification_settings')}
          onOpenDeveloperInfo={() => setCurrentView('developer_info')}
          onOpenDeveloperManifesto={() => setCurrentView('developer_manifesto')}
          onOpenAdvancedSettings={() => setCurrentView('advanced_settings')}
        />
      );
      case 'advanced_settings': return (
        <AdvancedSettings 
          user={currentUser!} onBack={() => setCurrentView('profile')} 
          isDark={darkMode} onToggleDark={() => setDarkMode(!darkMode)}
          isLite={liteMode} onToggleLite={() => setLiteMode(!liteMode)}
          onOpenSecurityCenter={() => setCurrentView('security_center')}
        />
      );
      case 'security_center': return <SecurityCenter user={currentUser!} onBack={() => setCurrentView('advanced_settings')} />;
      case 'dashboard': return <Dashboard user={currentUser!} posts={[]} onBack={() => setCurrentView('profile')} onOpenRoadmap={() => setCurrentView('roadmap')} />;
      case 'create': return <CreatePost onPostCreated={(p) => { setFeedItems([p, ...feedItems]); setCurrentView('feed'); }} onCancel={() => setCurrentView('feed')} />;
      default: return <Feed posts={feedItems} currentUser={currentUser!} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'} flex flex-col lg:flex-row font-sans overflow-hidden transition-colors`}>
      {isAuthenticated && (
        <nav className={`hidden lg:flex flex-col w-72 border-r ${darkMode ? 'border-zinc-900 bg-black' : 'border-zinc-200 bg-white'} p-8 sticky top-0 h-screen gap-4`}>
          <div className="py-4 px-4 mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center overflow-hidden shadow-lg"><img src="assets/profile.png" className="w-full h-full object-cover" /></div>
             <h1 className="text-xl font-black italic tracking-tighter text-blue-500 uppercase">CARLIN</h1>
          </div>
          <NavButton icon={<Icons.Home className="w-6 h-6" />} label="Feed" active={currentView === 'feed'} onClick={() => setCurrentView('feed')} darkMode={darkMode} />
          <NavButton icon={<Icons.User className="w-6 h-6" />} label="Perfil" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} darkMode={darkMode} />
          <div className="mt-auto">
             <button onClick={handleLogout} className="flex items-center gap-4 p-4 text-zinc-500 hover:text-red-500 transition-colors">
                <span className="text-xl">🚪</span>
                <span className="text-[10px] tracking-widest font-black uppercase">Sair com Segurança</span>
             </button>
          </div>
        </nav>
      )}

      <main className="flex-1 overflow-y-auto h-screen scroll-smooth transition-colors">
        {renderView()}
      </main>

      {isAuthenticated && (
        <nav className={`lg:hidden fixed bottom-0 w-full ${darkMode ? 'bg-black/95 border-zinc-900' : 'bg-white/95 border-zinc-200'} border-t flex justify-around items-center h-16 z-[100] backdrop-blur-md`}>
          <button onClick={() => setCurrentView('feed')} className={`p-2 ${currentView === 'feed' ? 'text-blue-500' : 'text-zinc-500'}`}><Icons.Home className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('create')} className={`p-2 ${currentView === 'create' ? 'text-blue-500' : 'text-zinc-500'}`}><Icons.Plus className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('profile')} className={`p-2 ${currentView === 'profile' ? 'text-blue-500' : 'text-zinc-500'}`}>
            <div className={`w-7 h-7 rounded-full overflow-hidden border ${currentView === 'profile' ? 'border-blue-500' : 'border-zinc-300'}`}><img src={currentUser?.avatar || 'assets/profile.png'} className="w-full h-full object-cover" /></div>
          </button>
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick, darkMode }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, darkMode: boolean }) => (
  <button onClick={onClick} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? (darkMode ? 'bg-blue-600/10 text-blue-500' : 'bg-blue-50 text-blue-600') : 'text-zinc-50'}`}>
    <div className={active ? 'scale-110' : ''}>{icon}</div>
    <span className={`text-[10px] tracking-widest font-black uppercase`}>{label}</span>
  </button>
);

export default App;