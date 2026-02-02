
import React, { useState, useEffect, useCallback } from 'react';
import { View, User, Post, Story, FeedMode, FeedFormatPreference } from './types';
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [feedMode, setFeedMode] = useState<FeedMode>('relevance');
  const [formatPreference, setFormatPreference] = useState<FeedFormatPreference>('balanced');
  const [posts, setPosts] = useState<Post[]>([]);
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
    return saved ? JSON.parse(saved) : null;
  });
  
  useEffect(() => {
    localStorage.setItem('carlin_lite_mode', liteMode.toString());
    localStorage.setItem('carlin_dark_mode', darkMode.toString());
    
    const loadLimit = liteMode ? 15 : 40;
    const generatedPosts: Post[] = Array.from({ length: loadLimit }).map((_, i) => {
      const isFollower = i < (loadLimit * 0.3); 
      const category = ['Estratégia de Conteúdo', 'Growth Hacking', 'Design para Criadores', 'Monetização Direta', 'Storytelling'][i % 5];
      const type: 'image' | 'video' | 'carousel' = i % 3 === 0 ? 'video' : (i % 3 === 1 ? 'carousel' : 'image');
      
      const relevanceScore = Math.floor(Math.random() * 35) + 65; 
      
      // Simulação de detecção de perfil suspeito para alguns posts
      const isSuspicious = i % 10 === 0 && i !== 0; 
      const riskLevel = isSuspicious ? (i % 20 === 0 ? 'high' : 'medium') : undefined;
      // Simulation of verified status
      const isVerified = i % 4 === 0 && !isSuspicious;

      const indicators = [
        ['Dica Prática', 'Educação'],
        ['Inspiração', 'Crescimento'],
        ['Solução Real', 'Tutorial'],
        ['Insight de Mercado', 'Valor'],
        ['Metodologia', 'Monetização']
      ][i % 5];

      return {
        id: `unified-${i}`,
        userId: `u-${i}`,
        username: isSuspicious ? `carlin_copia_${i}` : (isFollower ? `criador_parceiro_${i}` : `expert_relevante_${i}`),
        userAvatar: `https://picsum.photos/seed/unified-${i}/150/150`,
        content: isSuspicious ? "PROMOÇÃO EXCLUSIVA! Clique no link da bio para ganhar seguidores grátis agora!" : `[${type.toUpperCase()}] Masterclass em ${category}. ${relevanceScore > 85 ? 'Conteúdo em circulação contínua pela alta relevância. 🔥' : 'Entregue pelo algoritmo de Entrega Total.'}`,
        media: type === 'video' 
          ? ['https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-2322-large.mp4'] 
          : [`https://picsum.photos/seed/unified-media-${i}/1080/1080`],
        type,
        likes: isSuspicious ? 12 : Math.floor(Math.random() * 12000),
        comments: isSuspicious ? 2 : Math.floor(Math.random() * 450),
        timestamp: i > 10 ? 'Postagem Antiga' : `${i + 1}h atrás`,
        category: category,
        isFromFollower: isFollower,
        stats: {
          followerReach: isSuspicious ? 5 : (isFollower ? 100 : Math.floor(Math.random() * 25) + 10),
          nonFollowerReach: isSuspicious ? 2 : (relevanceScore > 75 ? 100 : Math.floor(Math.random() * 60) + 30),
          relevanceScore: isSuspicious ? 15 : relevanceScore,
          relevanceIndicators: indicators,
          engagementRate: isSuspicious ? 0.1 : (Math.random() * 18 + 7).toFixed(1) as any,
          saves: isSuspicious ? 0 : Math.floor(Math.random() * 1200),
          shares: isSuspicious ? 0 : Math.floor(Math.random() * 400),
          isContinuousCirculation: !isSuspicious && relevanceScore > 80
        },
        userRiskLevel: riskLevel,
        isSuspicious: isSuspicious,
        isVerified: isVerified
      } as Post;
    });

    // Ordenar para priorizar verificados no feed "Entrega Total"
    const sortedPosts = [...generatedPosts].sort((a, b) => {
        // Fix: isVerified property now exists on Post interface
        const aScore = (a.stats?.relevanceScore || 0) + (a.isVerified ? 50 : 0);
        const bScore = (b.stats?.relevanceScore || 0) + (b.isVerified ? 50 : 0);
        return bScore - aScore;
    });

    setPosts(sortedPosts);

    const initialStories: Story[] = Array.from({ length: 12 }).map((_, i) => ({
      id: `unified-story-${i}`,
      userId: `s-${i}`,
      username: `criador_${i}`,
      userAvatar: `https://picsum.photos/seed/unified-st-${i}/100/100`,
      media: `https://picsum.photos/seed/unified-sm-${i}/1080/1920`,
      viewed: i > 8
    }));
    setStories(initialStories);
  }, [liteMode, darkMode]);

  const handleCloseInstaBanner = () => {
    setShowInstaBanner(false);
    localStorage.setItem('carlin_insta_banner_closed', 'true');
  };

  const handlePostCreated = (newPost: Post) => {
    const myPosts = posts.filter(p => p.userId === 'me' || p.userId === currentUser?.id);
    const isFirstPost = myPosts.length === 0;
    const isTenthPost = myPosts.length === 9; 

    setPosts([newPost, ...posts]);
    
    if (isFirstPost) {
      setTimeout(() => {
        const event = new CustomEvent('carlin-notification', {
          detail: {
            id: 'first_post_success',
            type: 'first_post',
            title: 'Seu conteúdo já está circulando! 🚀',
            message: 'No Carlin, a entrega é contínua e justa. Agora é só deixar o algoritmo trabalhar para você.',
            icon: <div className="bg-green-600 p-2 rounded-lg text-white">✅</div>
          }
        });
        window.dispatchEvent(event);
      }, 2000);
    }

    if (isTenthPost) {
      setTimeout(() => {
        const event = new CustomEvent('carlin-notification', {
          detail: {
            id: 'milestone_10_posts',
            type: 'educational',
            title: 'Marca Histórica: 10 Publicações! ✨',
            message: 'Sua consistência é admirável. No Carlin, valorizamos cada esforço seu para criar valor real.',
            icon: <div className="bg-blue-600 p-2 rounded-lg text-white">🏆</div>
          }
        });
        window.dispatchEvent(event);
      }, 3000);
    }
  };

  const handleRegistrationComplete = (user: User, startLite: boolean) => {
    localStorage.setItem('carlin_user', JSON.stringify(user));
    localStorage.setItem('carlin_lite_mode', startLite.toString());
    localStorage.setItem('carlin_signup_timestamp', Date.now().toString());
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

  const userHasPosted = posts.some(p => p.userId === 'me' || p.userId === currentUser?.id);

  const filteredPosts = posts.filter(post => {
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
              <button onClick={() => setFormatPreference('posts')} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap border ${formatPreference === 'posts' ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-800 text-zinc-500'}`}>Somente Posts</button>
              <button onClick={() => setFormatPreference('videos')} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap border ${formatPreference === 'videos' ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-800 text-zinc-500'}`}>Somente Vídeos</button>
            </div>

            <Stories stories={stories} />
            <Feed 
              posts={filteredPosts} 
              currentUser={currentUser} 
              showInstaBanner={showInstaBanner} 
              onCloseBanner={handleCloseInstaBanner}
              onOpenInfo={() => setShowReachInfo(true)}
              onOpenCreate={() => setCurrentView('create')}
            />
          </div>
        );
      case 'explore': return <Explore />;
      case 'reels': return <Reels />;
      case 'messages': return <Messages />;
      case 'profile': return (
        <Profile 
          user={currentUser} 
          onOpenTerms={() => setCurrentView('terms')} 
          onOpenPrivacy={() => setCurrentView('privacy')} 
          isLite={liteMode}
          onToggleLite={() => setLiteMode(!liteMode)}
          isDark={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          onOpenDashboard={() => setCurrentView('dashboard')}
          onOpenVerification={() => setCurrentView('verification')}
        />
      );
      case 'dashboard': return (
        <Dashboard 
          posts={posts.filter(p => p.userId === 'me' || p.userId === currentUser?.id)} 
          onBack={() => setCurrentView('profile')}
        />
      );
      case 'verification': return (
        <VerificationProcess 
          onComplete={handleVerificationComplete} 
          onCancel={() => setCurrentView('profile')} 
          onOpenPolicy={() => setCurrentView('biometric_policy')}
        />
      );
      case 'biometric_policy': return (
        <BiometricPolicy onClose={() => setCurrentView('verification')} />
      );
      case 'create': return <CreatePost onPostCreated={handlePostCreated} onCancel={() => setCurrentView('feed')} />;
      case 'download': return <DownloadPage onInstall={() => {}} canInstall={!!deferredPrompt} />;
      default: return <Feed posts={posts} currentUser={currentUser!} />;
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
            <div className="flex flex-col">
              <h1 className="text-xl font-black italic tracking-tighter text-blue-500 uppercase leading-none">CARLIN</h1>
              <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mt-1">Unified Delivery v4.1</span>
            </div>
          </div>
          <NavButton icon={<Icons.Home className="w-6 h-6" />} label="Feed Unificado" active={currentView === 'feed'} onClick={() => setCurrentView('feed')} darkMode={darkMode} />
          <NavButton icon={<Icons.Search className="w-6 h-6" />} label="Explorar Relevância" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} darkMode={darkMode} />
          <NavButton icon={<Icons.Plus className="w-6 h-6" />} label="Criar Conteúdo" active={currentView === 'create'} onClick={() => setCurrentView('create')} darkMode={darkMode} />
          <NavButton icon={<Icons.User className="w-6 h-6" />} label="Meu Perfil" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} darkMode={darkMode} />
        </nav>
      )}

      {currentUser && !['terms', 'privacy', 'download', 'create', 'verification', 'biometric_policy'].includes(currentView) && (
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
      
      {currentUser && (
        <NotificationSystem 
          currentUser={currentUser} 
          hasPosts={userHasPosted} 
          onNavigateToCreate={() => setCurrentView('create')} 
        />
      )}

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
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? (darkMode ? 'bg-blue-600/10 text-blue-500' : 'bg-blue-50 text-blue-600') : 'text-zinc-500 hover:text-blue-500'}`}
  >
    <div className={active ? 'scale-110' : ''}>{icon}</div>
    <span className={`text-[10px] tracking-widest font-black uppercase`}>{label}</span>
  </button>
);

export default App;
