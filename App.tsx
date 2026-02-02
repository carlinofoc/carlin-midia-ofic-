
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

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('carlin_user');
    const user = saved ? JSON.parse(saved) : null;
    return user;
  });

  // Configuração inicial de anúncios
  const [adConfig, setAdConfig] = useState<AdCategoryConfig>(() => {
    const saved = localStorage.getItem('carlin_ad_config');
    return saved ? JSON.parse(saved) : {
      education: true,
      tech: true,
      tools: true,
      investments: true,
      brands: true,
      casino: false // Bloqueio fixo
    };
  });
  
  useEffect(() => {
    localStorage.setItem('carlin_lite_mode', liteMode.toString());
    localStorage.setItem('carlin_dark_mode', darkMode.toString());
    localStorage.setItem('carlin_ad_config', JSON.stringify(adConfig));
    
    const loadLimit = liteMode ? 15 : 40;
    
    const allPossibleAds: Ad[] = [
      {
        id: 'ad-1',
        type: 'ad',
        brandName: 'Carlin Academy',
        brandAvatar: 'https://picsum.photos/seed/academy/100/100',
        content: 'Aprenda estratégias de crescimento real. Sem fórmulas mágicas, apenas valor.',
        media: 'https://picsum.photos/seed/edu/1080/1080',
        ctaLabel: 'Ver Cursos',
        ctaUrl: '#',
        category: 'Educação'
      },
      {
        id: 'ad-2',
        type: 'ad',
        brandName: 'TechTools Pro',
        brandAvatar: 'https://picsum.photos/seed/tools/100/100',
        content: 'Otimize seu workflow de criação com IA. 30 dias grátis para novos usuários.',
        media: 'https://picsum.photos/seed/tech/1080/1080',
        ctaLabel: 'Baixar Agora',
        ctaUrl: '#',
        category: 'Tecnologia'
      }
    ];

    const allowedAds = allPossibleAds.filter(ad => {
      if (ad.category === 'Educação') return adConfig.education;
      if (ad.category === 'Tecnologia') return adConfig.tech;
      if (ad.category === 'Ferramentas') return adConfig.tools;
      if (ad.category === 'Investimentos') return adConfig.investments;
      if (ad.category === 'Marca') return adConfig.brands;
      return false;
    });

    const generatedPosts: Post[] = Array.from({ length: loadLimit }).map((_, i) => {
      const isFollower = i < (loadLimit * 0.3); 
      const category = ['Estratégia', 'Growth', 'Design', 'Monetização', 'Storytelling'][i % 5];
      const type: 'image' | 'video' | 'carousel' = i % 3 === 0 ? 'video' : (i % 3 === 1 ? 'carousel' : 'image');
      const relevanceScore = Math.floor(Math.random() * 35) + 65; 
      const isSuspicious = i % 10 === 0 && i !== 0; 
      const isVerified = i % 4 === 0 && !isSuspicious;

      return {
        id: `unified-${i}`,
        userId: `u-${i}`,
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
          relevanceScore: isSuspicious ? 15 : relevanceScore,
          engagementRate: isSuspicious ? 0.1 : (Math.random() * 18 + 7).toFixed(1) as any,
          saves: isSuspicious ? 0 : Math.floor(Math.random() * 1200),
          shares: isSuspicious ? 0 : Math.floor(Math.random() * 400),
          isContinuousCirculation: !isSuspicious && relevanceScore > 80
        },
        userRiskLevel: isSuspicious ? 'medium' : undefined,
        isSuspicious: isSuspicious,
        isVerified: isVerified
      } as Post;
    });

    const sortedPosts = [...generatedPosts].sort((a, b) => (b.stats?.relevanceScore || 0) - (a.stats?.relevanceScore || 0));

    const itemsWithAds: FeedItem[] = [];
    sortedPosts.forEach((post, index) => {
      itemsWithAds.push(post);
      if ((index + 1) % 5 === 0 && allowedAds.length > 0) {
        const adIndex = Math.floor((index + 1) / 5) % allowedAds.length;
        itemsWithAds.push({ ...allowedAds[adIndex], id: `ad-inst-${index}` });
      }
    });

    setFeedItems(itemsWithAds);

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

  const handleCloseInstaBanner = () => {
    setShowInstaBanner(false);
    localStorage.setItem('carlin_insta_banner_closed', 'true');
  };

  const handlePostCreated = (newPost: Post) => {
    setFeedItems([newPost, ...feedItems]);
    
    // Trigger "First Post" or "Consistency"
    const event = new CustomEvent('carlin-notification', {
        detail: {
            id: 'post_created',
            type: 'performance',
            title: 'Sua Voz no Carlin 🎙️',
            message: 'Seu conteúdo foi compartilhado. O valor real começa com sua primeira voz.',
            icon: <div className="bg-blue-600 p-2 rounded-lg text-white">✨</div>
        }
    });
    window.dispatchEvent(event);
  };

  const handleRegistrationComplete = (user: User, startLite: boolean) => {
    localStorage.setItem('carlin_user', JSON.stringify(user));
    localStorage.setItem('carlin_lite_mode', startLite.toString());
    setLiteMode(startLite);
    setCurrentUser(user);
    setCurrentView('feed');
  };

  const handleVerificationComplete = () => {
    if (currentUser) {
      const updated = { ...currentUser, isVerified: true, isFaciallyVerified: true };
      setCurrentUser(updated);
      localStorage.setItem('carlin_user', JSON.stringify(updated));
    }
    setCurrentView('profile');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('carlin_user', JSON.stringify(updatedUser));
  };

  const handleUpdateNotificationPrefs = (newPrefs: NotificationPrefs) => {
    if (currentUser) {
        handleUpdateUser({ ...currentUser, notificationPrefs: newPrefs });
    }
  };

  const handleUpdateAdConfig = (newConfig: AdCategoryConfig) => {
    setAdConfig(newConfig);
  };

  const handleSubscribeCreatorPlus = () => {
    if (!currentUser) return;
    const updated = { ...currentUser, isPremium: true };
    handleUpdateUser(updated);
    setCurrentView('profile');
  };

  const handleCancelCreatorPlus = () => {
    if (!currentUser) return;
    const updated = { ...currentUser, isPremium: false };
    handleUpdateUser(updated);
    setCurrentView('profile');
    
    const event = new CustomEvent('carlin-notification', {
        detail: {
          id: 'cancel_confirm',
          type: 'security',
          title: 'Assinatura cancelada com sucesso.',
          message: 'Você continuará com acesso aos benefícios até o final do ciclo atual.',
          icon: <div className="bg-zinc-700 p-2 rounded-lg text-white">🕊️</div>
        }
    });
    window.dispatchEvent(event);
  };

  const userHasPosted = feedItems.some(p => 'userId' in p && (p.userId === 'me' || p.userId === currentUser?.id));

  const filteredItems = feedItems.filter(item => {
    if ('type' in item && item.type === 'ad') return true;
    const post = item as Post;
    const matchesMode = feedMode === 'followers' ? post.isFromFollower : 
                       feedMode === 'discovery' ? !post.isFromFollower : true;
    if (!matchesMode) return false;
    if (formatPreference === 'posts') return post.type !== 'video';
    if (formatPreference === 'videos') return post.type === 'video';
    return true; 
  });

  const renderView = () => {
    if (!hasAcceptedTerms) return <TermsOfUse onAccept={() => setHasAcceptedTerms(true)} showAcceptButton={true} />;
    if (!currentUser) return <Registration onComplete={handleRegistrationComplete} />;

    switch (currentView) {
      case 'feed':
        return (
          <div className="flex flex-col w-full max-w-xl mx-auto pt-14 lg:pt-4">
            <div className={`sticky top-14 lg:top-0 z-[80] flex border-b ${darkMode ? 'bg-black/95 border-zinc-900' : 'bg-white/95 border-zinc-200'} backdrop-blur-md`}>
              <button onClick={() => setFeedMode('followers')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${feedMode === 'followers' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}>Seguindo</button>
              <button onClick={() => setFeedMode('relevance')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${feedMode === 'relevance' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}>Entrega Total</button>
              <button onClick={() => setFeedMode('discovery')} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest ${feedMode === 'discovery' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}>Descoberta</button>
            </div>
            <div className={`flex gap-4 px-6 py-3 overflow-x-auto hide-scrollbar ${darkMode ? 'bg-black/40' : 'bg-white/40'}`}>
              <button onClick={() => setFormatPreference('balanced')} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap border ${formatPreference === 'balanced' ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-800 text-zinc-500'}`}>Equilibrado</button>
              <button onClick={() => setFormatPreference('posts')} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap border ${formatPreference === 'posts' ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-800 text-zinc-500'}`}>Posts</button>
              <button onClick={() => setFormatPreference('videos')} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap border ${formatPreference === 'videos' ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-800 text-zinc-500'}`}>Vídeos</button>
            </div>
            <Stories stories={stories} />
            <Feed posts={filteredItems} currentUser={currentUser} showInstaBanner={showInstaBanner} onCloseBanner={handleCloseInstaBanner} onOpenInfo={() => setShowReachInfo(true)} onOpenCreate={() => setCurrentView('create')} />
          </div>
        );
      case 'explore': return <Explore />;
      case 'reels': return <Reels />;
      case 'messages': return <Messages />;
      case 'profile': return (
        <Profile 
          user={currentUser} onOpenTerms={() => setCurrentView('terms')} onOpenPrivacy={() => setCurrentView('privacy')} 
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
          user={currentUser!} 
          onBack={() => setCurrentView('profile')} 
          isDark={darkMode} 
          onToggleDark={() => setDarkMode(!darkMode)}
          isLite={liteMode}
          onToggleLite={() => setLiteMode(!liteMode)}
        />
      );
      case 'developer_info': return (
        <DeveloperInfo 
          onBack={() => setCurrentView('profile')} 
          onOpenRoadmap={() => setCurrentView('roadmap')} 
        />
      );
      case 'developer_manifesto': return (
        <DeveloperManifesto onBack={() => setCurrentView('profile')} />
      );
      case 'notification_settings': return (
        <NotificationSettings 
            user={currentUser!} 
            onUpdate={handleUpdateNotificationPrefs} 
            onBack={() => setCurrentView('profile')} 
        />
      );
      case 'dashboard': return (
        <Dashboard 
          user={currentUser!}
          posts={feedItems.filter(p => 'userId' in p && (p.userId === 'me' || p.userId === currentUser?.id)) as Post[]} 
          onBack={() => setCurrentView('profile')}
          onOpenRoadmap={() => setCurrentView('roadmap')}
        />
      );
      case 'roadmap': return <Roadmap onBack={() => setCurrentView('dashboard')} />;
      case 'monetization_info': return <MonetizationInfo onBack={() => setCurrentView('profile')} />;
      case 'creator_plus': return (
        <CreatorPlus 
          user={currentUser!} 
          onSubscribe={handleSubscribeCreatorPlus} 
          onBack={() => setCurrentView('profile')} 
          onOpenFAQ={() => setCurrentView('creator_plus_faq')}
          onOpenCancel={() => setCurrentView('cancel_subscription')}
        />
      );
      case 'creator_plus_faq': return <CreatorPlusFAQ onBack={() => setCurrentView('creator_plus')} />;
      case 'cancel_subscription': return <CancelSubscription onConfirm={handleCancelCreatorPlus} onBack={() => setCurrentView('creator_plus')} />;
      case 'beta_center': return <BetaCenter user={currentUser!} onUpdateUser={handleUpdateUser} onBack={() => setCurrentView('profile')} onOpenTerms={() => setCurrentView('beta_terms')} />;
      case 'beta_terms': return <BetaTerms onClose={() => setCurrentView('beta_center')} />;
      case 'ad_controls': return <AdControlPanel config={adConfig} onUpdate={handleUpdateAdConfig} onBack={() => setCurrentView('profile')} />;
      case 'monetization_manifesto': return <MonetizationManifesto onBack={() => setCurrentView('profile')} />;
      case 'verification': return <VerificationProcess onComplete={handleVerificationComplete} onCancel={() => setCurrentView('profile')} onOpenPolicy={() => setCurrentView('biometric_policy')} />;
      case 'biometric_policy': return <BiometricPolicy onClose={() => setCurrentView('verification')} />;
      case 'create': return <CreatePost onPostCreated={handlePostCreated} onCancel={() => setCurrentView('feed')} />;
      case 'download': return <DownloadPage onInstall={() => {}} canInstall={!!deferredPrompt} />;
      default: return <Feed posts={filteredItems} currentUser={currentUser!} />;
    }
  };

  const themeClasses = darkMode ? "bg-black text-white" : "bg-zinc-50 text-zinc-900";

  return (
    <div className={`min-h-screen ${themeClasses} flex flex-col lg:flex-row font-sans overflow-hidden transition-colors`}>
      {currentUser && (
        <nav className={`hidden lg:flex flex-col w-72 border-r ${darkMode ? 'border-zinc-900 bg-black' : 'border-zinc-200 bg-white'} p-8 sticky top-0 h-screen gap-4`}>
          <div className="py-4 px-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
               <img src="assets/profile.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-black italic tracking-tighter text-blue-500 uppercase leading-none">CARLIN</h1>
          </div>
          <NavButton icon={<Icons.Home className="w-6 h-6" />} label="Feed" active={currentView === 'feed'} onClick={() => setCurrentView('feed')} darkMode={darkMode} />
          <NavButton icon={<Icons.Search className="w-6 h-6" />} label="Explorar" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} darkMode={darkMode} />
          <NavButton icon={<Icons.Plus className="w-6 h-6" />} label="Criar" active={currentView === 'create'} onClick={() => setCurrentView('create')} darkMode={darkMode} />
          <NavButton icon={<Icons.User className="w-6 h-6" />} label="Perfil" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} darkMode={darkMode} />
        </nav>
      )}

      {currentUser && !['terms', 'privacy', 'download', 'create', 'verification', 'biometric_policy', 'ad_controls', 'monetization_manifesto', 'beta_center', 'creator_plus', 'beta_terms', 'roadmap', 'creator_plus_faq', 'monetization_info', 'cancel_subscription', 'notification_settings', 'developer_info', 'developer_manifesto', 'advanced_settings'].includes(currentView) && (
        <header className={`lg:hidden fixed top-0 w-full ${darkMode ? 'bg-black/95 border-zinc-900' : 'bg-white/95 border-zinc-200'} border-b z-[100] flex items-center justify-between px-6 h-14 backdrop-blur-md`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center overflow-hidden border border-zinc-800">
               <img src="assets/profile.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-lg font-black italic tracking-tighter text-blue-500 uppercase">CARLIN</h1>
          </div>
          <button onClick={() => setCurrentView('messages')} className="text-zinc-500">
            <Icons.Message className="w-6 h-6" />
          </button>
        </header>
      )}

      <main className="flex-1 overflow-y-auto h-screen scroll-smooth hide-scrollbar transition-colors">
        {renderView()}
      </main>

      {showReachInfo && <ReachInfo onClose={() => setShowReachInfo(false)} />}
      {currentUser && <NotificationSystem currentUser={currentUser} hasPosts={userHasPosted} onNavigateToCreate={() => setCurrentView('create')} />}

      {currentUser && (
        <nav className={`lg:hidden fixed bottom-0 w-full ${darkMode ? 'bg-black/95 border-zinc-900' : 'bg-white/95 border-zinc-200'} border-t flex justify-around items-center h-16 z-[100] pb-safe backdrop-blur-md`}>
          <button onClick={() => setCurrentView('feed')} className={`p-2 transition-transform active:scale-90 ${currentView === 'feed' ? 'text-blue-500' : 'text-zinc-500'}`}><Icons.Home className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('explore')} className={`p-2 transition-transform active:scale-90 ${currentView === 'explore' ? 'text-blue-500' : 'text-zinc-500'}`}><Icons.Search className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('create')} className={`p-2 transition-transform active:scale-90 ${currentView === 'create' ? 'text-blue-500' : 'text-zinc-500'}`}><Icons.Plus className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('profile')} className={`p-2 transition-transform active:scale-90 ${currentView === 'profile' ? 'text-blue-500' : 'text-zinc-500'}`}>
            <div className={`w-7 h-7 rounded-full overflow-hidden border ${currentView === 'profile' ? 'border-blue-500' : 'border-zinc-300'}`}>
               <img src={currentUser.avatar || 'assets/profile.png'} className="w-full h-full object-cover" />
            </div>
          </button>
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick, darkMode }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, darkMode: boolean }) => (
  <button onClick={onClick} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? (darkMode ? 'bg-blue-600/10 text-blue-500' : 'bg-blue-50 text-blue-600') : 'text-zinc-500 hover:text-blue-500'}`}>
    <div className={active ? 'scale-110' : ''}>{icon}</div>
    <span className={`text-[10px] tracking-widest font-black uppercase`}>{label}</span>
  </button>
);

export default App;
