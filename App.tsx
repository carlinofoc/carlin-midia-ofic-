
import React, { useState, useEffect, Suspense } from 'react';
import { View, User, Post, Story, FeedMode, FeedItem, AdCategoryConfig, LiteConfig, LiteMode, SubscriptionStatus } from './types';
import { Icons, BrandLogo } from './constants';
import Feed from './components/Feed';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import Stories from './components/Stories';
import TermsOfUse from './components/TermsOfUse';
import Registration from './components/Registration';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VerificationProcess from './components/VerificationProcess';
import AdControlPanel from './components/AdControlPanel';
import MonetizationManifesto from './components/MonetizationManifesto';
import BetaCenter from './components/BetaCenter';
import CreatorPlus from './components/CreatorPlus';
import Roadmap from './components/Roadmap';
import NotificationSettings from './components/NotificationSettings';
import DeveloperInfo from './components/DeveloperInfo';
import DeveloperManifesto from './components/DeveloperManifesto';
import AdvancedSettings from './components/AdvancedSettings';
import SecurityCenter from './components/SecurityCenter';
import CombinedBanner from './components/CombinedBanner';
import CreatorPlusFAQ from './components/CreatorPlusFAQ';
import CancelSubscription from './components/CancelSubscription';
import Explore from './components/Explore';
import Reels from './components/Reels';
import BiometricPolicy from './components/BiometricPolicy';
import ImpactSocialScreen from './components/ImpactSocialScreen';
import SupportScreen from './components/SupportScreen';
import { rankFeed } from './services/algorithmService';
import { dbService } from './services/dbService';
import { liteModeManager, networkLimiter } from './services/liteModeService';

const LiteLayout = React.lazy(() => import('./components/LiteLayout'));

declare global {
  interface Window {
    setWindowAnimations: (duration: number) => void;
  }
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [feedMode, setFeedMode] = useState<FeedMode>('relevance');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [showReachInfo, setShowReachInfo] = useState(false);
  const [isCombinedBannerVisible, setIsCombinedBannerVisible] = useState<boolean>(() => {
    return localStorage.getItem('carlin_combined_banner_dismissed') !== 'true';
  });
  
  const [showInstaBanner, setShowInstaBanner] = useState<boolean>(() => {
    return localStorage.getItem('carlin_insta_banner_closed') !== 'true';
  });

  const [liteMode, setLiteMode] = useState<LiteMode>(() => liteModeManager.getLiteMode());
  const [liteConfig, setLiteConfig] = useState<LiteConfig>(() => liteModeManager.getConfig());
  const [forcedNoAnimations, setForcedNoAnimations] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('carlin_dark_mode');
    return saved === null ? true : saved === 'true';
  });
  
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    return localStorage.getItem('carlin_terms_accepted') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    window.setWindowAnimations = (duration: number) => {
      setForcedNoAnimations(duration === 0);
    };

    const handleModeChange = (e: any) => {
      const newMode = e.detail as LiteMode;
      setLiteMode(newMode);
      if (newMode !== LiteMode.NORMAL) {
        liteModeManager.applyLiteRules();
      }
    };
    
    const handleConfigChange = () => setLiteConfig(liteModeManager.getConfig());

    window.addEventListener('carlin-lite-mode-changed', handleModeChange);
    window.addEventListener('carlin-lite-config-changed', handleConfigChange);

    return () => {
      window.removeEventListener('carlin-lite-mode-changed', handleModeChange);
      window.removeEventListener('carlin-lite-config-changed', handleConfigChange);
    };
  }, []);

  useEffect(() => {
    const identity = dbService.verificarIdentidadeLocal();
    const sessionActive = sessionStorage.getItem('carlin_session') === 'true';

    if (!identity) {
      setCurrentView('register');
    } else if (sessionActive) {
      setCurrentUser(identity);
      setIsAuthenticated(true);
      setCurrentView('feed');
    } else {
      setCurrentView('login');
    }
  }, []);

  const [adConfig, setAdConfig] = useState<AdCategoryConfig>(() => {
    const saved = localStorage.getItem('carlin_ad_config');
    return saved ? JSON.parse(saved) : {
      education: true, tech: true, tools: true, investments: true, brands: true, casino: false 
    };
  });
  
  useEffect(() => {
    if (liteMode !== liteModeManager.getLiteMode()) {
      liteModeManager.setMode(liteMode);
    }
    
    localStorage.setItem('carlin_dark_mode', darkMode.toString());
    localStorage.setItem('carlin_ad_config', JSON.stringify(adConfig));
    
    if (!isAuthenticated || !currentUser) return;

    const isLiteActive = liteMode !== LiteMode.NORMAL;
    const loadLimit = isLiteActive ? 10 : 40;
    const categories = ["Marketing Digital", "Estratégia", "Growth", "Design", "Monetização", "Storytelling", "AI"];
    
    const generatedPosts: Post[] = Array.from({ length: loadLimit }).map((_, i) => ({
      id: `post-${i}`,
      autor_id: `u-${i}`,
      username: `expert_${i}`,
      userAvatar: `https://picsum.photos/seed/post-${i}/150/150`,
      content: `Insights estratégicos sobre ${categories[i % categories.length]}. Conteúdo otimizado para o seu perfil.`,
      category: categories[i % categories.length],
      media: [i % 4 === 0 ? 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-2322-large.mp4' : `https://picsum.photos/seed/media-${i}/1080/1080`],
      type: i % 4 === 0 ? 'video' : 'image',
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 20),
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      trendingScore: Math.floor(Math.random() * 100),
      timestamp: `${i + 1}h atrás`,
      isVerified: i % 5 === 0
    } as Post));

    setFeedItems(rankFeed(generatedPosts, currentUser));

    setStories(Array.from({ length: isLiteActive ? 6 : 12 }).map((_, i) => ({
      id: `story-${i}`,
      userId: `s-${i}`,
      username: `user_${i}`,
      userAvatar: `https://picsum.photos/seed/story-${i}/100/100`,
      media: `https://picsum.photos/seed/sm-${i}/1080/1920`,
      viewed: i > 8
    })));
  }, [liteMode, liteConfig, darkMode, adConfig, isAuthenticated, currentUser]);

  const handleRegistrationComplete = (user: User, startLite: boolean) => {
    sessionStorage.setItem('carlin_session', 'true');
    setLiteMode(startLite ? LiteMode.LITE_ANTIGO : LiteMode.NORMAL);
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('feed');
  };

  const handleSubscribe = () => {
    const updated = { ...currentUser!, isPremium: true, subscriptionStatus: 'active' as SubscriptionStatus };
    dbService.registrarNoBackend(updated);
    localStorage.setItem('carlin_id_local', JSON.stringify(updated));
    setCurrentUser(updated);
    setCurrentView('profile');
  };

  const renderView = () => {
    if (!hasAcceptedTerms) return <TermsOfUse onAccept={() => { setHasAcceptedTerms(true); localStorage.setItem('carlin_terms_accepted', 'true'); }} showAcceptButton={true} />;
    
    if (!isAuthenticated) {
        if (currentView === 'register') return <Registration onComplete={handleRegistrationComplete} onNavigateToLogin={() => setCurrentView('login')} />;
        return <Login onLogin={(u) => { setCurrentUser(u); setIsAuthenticated(true); setCurrentView('feed'); sessionStorage.setItem('carlin_session', 'true'); }} onNavigateToRegister={() => setCurrentView('register')} />;
    }

    const isLiteActive = liteMode !== LiteMode.NORMAL;

    switch (currentView) {
      case 'feed':
        return (
          <div className="flex flex-col w-full max-w-xl mx-auto pt-14 lg:pt-4">
            <div className={`sticky top-14 lg:top-0 z-[80] flex border-b ${darkMode ? 'bg-black/95 border-zinc-900' : 'bg-white/95 border-zinc-200'} backdrop-blur-md`}>
              <button onClick={() => setFeedMode('followers')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${feedMode === 'followers' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}>Seguindo</button>
              <button onClick={() => setFeedMode('relevance')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${feedMode === 'relevance' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}>Entrega Total</button>
              <button onClick={() => setFeedMode('discovery')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${feedMode === 'discovery' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}>Descoberta</button>
            </div>
            
            {isLiteActive && (
              <Suspense fallback={null}>
                <LiteLayout />
              </Suspense>
            )}

            <Stories stories={stories} />
            <Feed 
              posts={feedItems} 
              currentUser={currentUser!} 
              showInstaBanner={showInstaBanner} 
              onCloseBanner={() => setShowInstaBanner(false)} 
              onOpenInfo={() => setShowReachInfo(true)} 
              onOpenCreate={() => setCurrentView('create')} 
              liteConfig={liteConfig}
            />
          </div>
        );
      case 'explore': return <Explore posts={feedItems as Post[]} />;
      case 'reels': return <Reels liteConfig={liteConfig} />;
      case 'profile': return (
        <Profile 
          user={currentUser!} onOpenTerms={() => setCurrentView('terms')} onOpenPrivacy={() => setCurrentView('privacy')} 
          isLite={isLiteActive} onToggleLite={() => setLiteMode(isLiteActive ? LiteMode.NORMAL : LiteMode.LITE_ANTIGO)} isDark={darkMode} onToggleDark={() => setDarkMode(!darkMode)}
          onOpenDashboard={() => setCurrentView('dashboard')} onOpenVerification={() => setCurrentView('verification')} onUpdateUser={(u) => setCurrentUser(u)}
          onOpenAdControls={() => setCurrentView('ad_controls')} onOpenManifesto={() => setCurrentView('monetization_manifesto')} onOpenBetaCenter={() => setCurrentView('beta_center')}
          onOpenCreatorPlus={() => setCurrentView('creator_plus')} onOpenRoadmap={() => setCurrentView('roadmap')} onOpenMonetizationInfo={() => setCurrentView('monetization_info')}
          onOpenNotificationSettings={() => setCurrentView('notification_settings')}
          onOpenDeveloperInfo={() => setCurrentView('developer_info')}
          onOpenDeveloperManifesto={() => setCurrentView('developer_manifesto')}
          onOpenAdvancedSettings={() => setCurrentView('advanced_settings')}
          onOpenImpactSocial={() => setCurrentView('impact_social')}
          onOpenSupport={() => setCurrentView('support')}
        />
      );
      case 'support': return <SupportScreen onSupport={handleSubscribe} onBack={() => setCurrentView('profile')} />;
      case 'impact_social': return <ImpactSocialScreen user={currentUser!} onBack={() => setCurrentView('profile')} />;
      case 'advanced_settings': return (
        <AdvancedSettings 
          user={currentUser!} onBack={() => setCurrentView('profile')} 
          isDark={darkMode} onToggleDark={() => setDarkMode(!darkMode)}
          currentMode={liteMode} onSetMode={setLiteMode}
          liteConfig={liteConfig} onUpdateLiteConfig={setLiteConfig}
          onOpenSecurityCenter={() => setCurrentView('security_center')}
        />
      );
      case 'security_center': return <SecurityCenter user={currentUser!} onBack={() => setCurrentView('advanced_settings')} onUpdateUser={(u) => setCurrentUser(u)} />;
      case 'dashboard': return <Dashboard user={currentUser!} posts={[]} onBack={() => setCurrentView('profile')} onOpenRoadmap={() => setCurrentView('roadmap')} />;
      case 'create': return <CreatePost onPostCreated={(p) => { setFeedItems([p, ...feedItems]); setCurrentView('feed'); }} onCancel={() => setCurrentView('feed')} />;
      case 'verification': return (
        <VerificationProcess 
          user={currentUser!} 
          onComplete={() => {
            const updated = dbService.verificarIdentidadeLocal();
            if (updated) setCurrentUser(updated);
            setCurrentView('profile');
          }} 
          onCancel={() => setCurrentView('profile')} 
          onOpenPolicy={() => setCurrentView('biometric_policy')}
        />
      );
      case 'biometric_policy': return <BiometricPolicy onClose={() => setCurrentView('verification')} />;
      case 'ad_controls': return <AdControlPanel config={adConfig} onUpdate={setAdConfig} onBack={() => setCurrentView('profile')} />;
      case 'monetization_manifesto': return <MonetizationManifesto onBack={() => setCurrentView('profile')} />;
      case 'beta_center': return <BetaCenter user={currentUser!} onUpdateUser={(u) => setCurrentUser(u)} onBack={() => setCurrentView('profile')} onOpenTerms={() => setCurrentView('beta_terms')} />;
      case 'creator_plus': return <CreatorPlus user={currentUser!} onSubscribe={handleSubscribe} onBack={() => setCurrentView('profile')} onOpenFAQ={() => setCurrentView('creator_plus_faq')} onOpenCancel={() => setCurrentView('cancel_subscription')} />;
      case 'roadmap': return <Roadmap onBack={() => setCurrentView('profile')} />;
      case 'notification_settings': return <NotificationSettings user={currentUser!} onUpdate={(p) => {
        const updated = { ...currentUser!, notificationPrefs: p };
        localStorage.setItem('carlin_id_local', JSON.stringify(updated));
        setCurrentUser(updated);
      }} onBack={() => setCurrentView('profile')} />;
      case 'developer_info': return <DeveloperInfo onBack={() => setCurrentView('profile')} onOpenRoadmap={() => setCurrentView('roadmap')} />;
      case 'developer_manifesto': return <DeveloperManifesto onBack={() => setCurrentView('profile')} />;
      case 'creator_plus_faq': return <CreatorPlusFAQ onBack={() => setCurrentView('creator_plus')} />;
      case 'cancel_subscription': return <CancelSubscription onConfirm={() => {
        const updated = { ...currentUser!, isPremium: false, subscriptionStatus: 'canceled' as SubscriptionStatus };
        localStorage.setItem('carlin_id_local', JSON.stringify(updated));
        setCurrentUser(updated);
        setCurrentView('creator_plus');
      }} onBack={() => setCurrentView('creator_plus')} />;
      default: return <Feed posts={feedItems} currentUser={currentUser!} liteConfig={liteConfig} />;
    }
  };

  const isNoAnimationsActive = (liteMode !== LiteMode.NORMAL) || forcedNoAnimations;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'} flex flex-col lg:flex-row font-sans overflow-hidden transition-colors ${isNoAnimationsActive ? 'carlin-no-animations' : ''}`}>
      <style>
        {`
          .carlin-no-animations *, .carlin-no-animations *::before, .carlin-no-animations *::after {
            animation-duration: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
            animation-delay: 0s !important;
          }
        `}
      </style>

      <CombinedBanner onClose={() => setIsCombinedBannerVisible(false)} />
      
      {isAuthenticated && (
        <nav className={`hidden lg:flex flex-col w-72 border-r ${darkMode ? 'border-zinc-900 bg-black' : 'border-zinc-200 bg-white'} p-8 sticky top-0 h-screen gap-4`}>
          <div className="py-4 px-4 mb-10">
             <BrandLogo size="md" lightText={darkMode} />
          </div>
          <NavButton icon={<Icons.Home className="w-6 h-6" />} label="Feed" active={currentView === 'feed'} onClick={() => setCurrentView('feed')} darkMode={darkMode} />
          <NavButton icon={<Icons.Search className="w-6 h-6" />} label="Pesquisar" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} darkMode={darkMode} />
          <NavButton icon={<Icons.Play className="w-6 h-6" />} label="Rios" active={currentView === 'reels'} onClick={() => setCurrentView('reels')} darkMode={darkMode} />
          <NavButton icon={<Icons.User className="w-6 h-6" />} label="Perfil" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} darkMode={darkMode} />
          <div className="mt-auto">
             <button onClick={() => { sessionStorage.removeItem('carlin_session'); setIsAuthenticated(false); setCurrentView('login'); }} className="flex items-center gap-4 p-4 text-zinc-500 hover:text-red-500 transition-colors">
                <span className="text-xl">🚪</span>
                <span className="text-[10px] tracking-widest font-black uppercase">Sair com Segurança</span>
             </button>
          </div>
        </nav>
      )}

      <main className={`flex-1 overflow-y-auto h-screen scroll-smooth transition-colors ${isCombinedBannerVisible ? 'pt-[340px] md:pt-48' : ''}`}>
        {renderView()}
      </main>

      {isAuthenticated && (
        <nav className={`lg:hidden fixed bottom-0 w-full ${darkMode ? 'bg-black/95 border-zinc-900' : 'bg-white/95 border-zinc-200'} border-t flex justify-around items-center h-16 z-[100] backdrop-blur-md`}>
          <button onClick={() => setCurrentView('feed')} className={`p-2 ${currentView === 'feed' ? 'text-blue-500' : 'text-zinc-500'}`}><Icons.Home className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('explore')} className={`p-2 ${currentView === 'explore' ? 'text-blue-500' : 'text-zinc-500'}`}><Icons.Search className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('reels')} className={`p-2 ${currentView === 'reels' ? 'text-blue-500' : 'text-zinc-500'}`}><Icons.Play className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('create')} className={`p-2 ${currentView === 'create' ? 'text-blue-500' : 'text-zinc-500'}`}><Icons.Plus className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('profile')} className={`p-2 ${currentView === 'profile' ? 'text-blue-500' : 'text-zinc-500'}`}>
            <div className={`w-7 h-7 rounded-full overflow-hidden border ${currentView === 'profile' ? 'border-blue-500' : 'border-zinc-300'}`}>
               <img src={currentUser?.avatar || 'assets/profile.png'} className="w-full h-full object-cover" />
            </div>
          </button>
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick, darkMode }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, darkMode: boolean }) => (
  <button onClick={onClick} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? (darkMode ? 'bg-blue-600/10 text-blue-500' : 'bg-blue-50 text-blue-600') : 'text-zinc-400'}`}>
    <div className={active ? 'scale-110' : ''}>{icon}</div>
    <span className={`text-[10px] tracking-widest font-black uppercase`}>{label}</span>
  </button>
);

export default App;
