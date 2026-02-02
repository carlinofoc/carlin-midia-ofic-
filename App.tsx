
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

const MOCK_USER: User = {
  id: 'me',
  username: 'carlin_user',
  displayName: 'Carlin Explorer',
  avatar: 'https://picsum.photos/seed/me/200/200',
  bio: 'Acompanhando o melhor da Carlin Mídia Ofic. 🚀',
  followers: 1250,
  following: 840,
  isVerified: true
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy'>('terms');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    return localStorage.getItem('carlin_terms_accepted') === 'true';
  });
  
  useEffect(() => {
    const initialPosts: Post[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `post-${i}`,
      userId: `user-${i}`,
      username: `criador_${i + 1}`,
      userAvatar: `https://picsum.photos/seed/user${i}/100/100`,
      content: `Explorando as novidades da Carlin Mídia Ofic #${i + 1}. Conteúdo de qualidade! #CarlinMídia #Tendência`,
      media: [`https://picsum.photos/seed/post${i}/800/1000`],
      type: 'image',
      likes: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 200),
      timestamp: '2h ago'
    }));
    setPosts(initialPosts);

    const initialStories: Story[] = Array.from({ length: 12 }).map((_, i) => ({
      id: `story-${i}`,
      userId: `user-${i}`,
      username: `usuario_${i}`,
      userAvatar: `https://picsum.photos/seed/storyuser${i}/100/100`,
      media: `https://picsum.photos/seed/storymedia${i}/400/700`,
      viewed: i > 5
    }));
    setStories(initialStories);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('carlin_terms_accepted', 'true');
    setHasAcceptedTerms(true);
    setCurrentView('feed');
  };

  const renderView = () => {
    if (!hasAcceptedTerms) {
      return (
        <div className="fixed inset-0 z-[100] bg-black overflow-y-auto flex flex-col">
          <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 flex justify-center gap-8 p-4">
             <button 
              onClick={() => setLegalTab('terms')}
              className={`text-sm font-bold uppercase tracking-widest pb-2 transition-colors ${legalTab === 'terms' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}
             >
               Termos de Uso
             </button>
             <button 
              onClick={() => setLegalTab('privacy')}
              className={`text-sm font-bold uppercase tracking-widest pb-2 transition-colors ${legalTab === 'privacy' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}
             >
               Privacidade
             </button>
          </div>
          <div className="flex-1">
            {legalTab === 'terms' ? <TermsOfUse /> : <PrivacyPolicy />}
          </div>
          <div className="sticky bottom-0 bg-black/90 backdrop-blur-xl border-t border-zinc-800 p-6 lg:p-10 flex flex-col items-center gap-4">
            <p className="text-[10px] text-zinc-500 text-center max-w-sm">Ao clicar em aceitar, você confirma que leu e concorda com nossos Termos de Uso e Política de Privacidade.</p>
            <button 
              onClick={handleAcceptTerms}
              className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all active:scale-95 text-lg"
            >
              ✅ Aceito os Termos e Privacidade
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'feed':
        return (
          <div className="flex flex-col w-full max-w-xl mx-auto pt-16 pb-20 lg:pt-8">
            <Stories stories={stories} />
            <Feed posts={posts} />
          </div>
        );
      case 'explore': return <Explore />;
      case 'reels': return <Reels />;
      case 'messages': return <Messages />;
      case 'profile': return <Profile user={MOCK_USER} onOpenTerms={() => setCurrentView('terms')} onOpenPrivacy={() => setCurrentView('privacy')} />;
      case 'create': return <CreatePost onPostCreated={(p) => setPosts([p, ...posts])} onCancel={() => setCurrentView('feed')} />;
      case 'terms':
      case 'privacy':
        return (
          <div className="pt-20 lg:pt-8 flex flex-col min-h-screen">
             <div className="max-w-3xl mx-auto px-6 mb-4 flex gap-4">
                <button 
                  onClick={() => setCurrentView('terms')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${currentView === 'terms' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  Termos
                </button>
                <button 
                  onClick={() => setCurrentView('privacy')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${currentView === 'privacy' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  Privacidade
                </button>
             </div>
            {currentView === 'terms' ? <TermsOfUse /> : <PrivacyPolicy />}
            <div className="max-w-3xl mx-auto px-6 mb-20">
              <button 
                onClick={() => setCurrentView('profile')}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Voltar ao Perfil
              </button>
            </div>
          </div>
        );
      default: return <Feed posts={posts} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {hasAcceptedTerms && (
        <nav className="hidden lg:flex flex-col w-64 border-r border-zinc-800 p-4 sticky top-0 h-screen gap-2">
          <h1 className="text-2xl font-black mb-8 italic tracking-tighter px-4 text-blue-500">CARLIN</h1>
          <NavButton icon={<Icons.Home className="w-6 h-6" />} label="Página Inicial" active={currentView === 'feed'} onClick={() => setCurrentView('feed')} />
          <NavButton icon={<Icons.Search className="w-6 h-6" />} label="Explorar" active={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
          <NavButton icon={<Icons.Play className="w-6 h-6" />} label="Reels" active={currentView === 'reels'} onClick={() => setCurrentView('reels')} />
          <NavButton icon={<Icons.Message className="w-6 h-6" />} label="Mensagens" active={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
          <NavButton icon={<Icons.Plus className="w-6 h-6" />} label="Criar" active={currentView === 'create'} onClick={() => setCurrentView('create')} />
          <NavButton icon={<Icons.User className="w-6 h-6" />} label="Perfil" active={['profile', 'terms', 'privacy'].includes(currentView)} onClick={() => setCurrentView('profile')} />
          
          <div className="mt-auto">
            <button className="flex items-center gap-4 p-4 hover:bg-zinc-900 rounded-xl transition-colors w-full group">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700">
                <Icons.Verified className="w-4 h-4 text-zinc-500" />
              </div>
              <span className="font-medium text-zinc-400">Configurações</span>
            </button>
          </div>
        </nav>
      )}

      {hasAcceptedTerms && currentView !== 'reels' && !['terms', 'privacy'].includes(currentView) && (
        <header className="lg:hidden fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 z-50 flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-black italic tracking-tighter text-blue-500">CARLIN</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('messages')}><Icons.Message className="w-6 h-6" /></button>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto lg:overflow-visible bg-black">
        {renderView()}
      </main>

      {hasAcceptedTerms && (
        <nav className="lg:hidden fixed bottom-0 w-full bg-black border-t border-zinc-800 flex justify-around items-center h-16 z-50">
          <button onClick={() => setCurrentView('feed')} className={`p-2 ${currentView === 'feed' ? 'text-white' : 'text-zinc-500'}`}><Icons.Home className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('explore')} className={`p-2 ${currentView === 'explore' ? 'text-white' : 'text-zinc-500'}`}><Icons.Search className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('create')} className={`p-2 ${currentView === 'create' ? 'text-white' : 'text-zinc-500'}`}><Icons.Plus className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('reels')} className={`p-2 ${currentView === 'reels' ? 'text-white' : 'text-zinc-500'}`}><Icons.Play className="w-7 h-7" /></button>
          <button onClick={() => setCurrentView('profile')} className={`p-2 ${['profile', 'terms', 'privacy'].includes(currentView) ? 'text-white' : 'text-zinc-500'}`}><Icons.User className="w-7 h-7" /></button>
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${active ? 'bg-zinc-900' : 'hover:bg-zinc-900'}`}
  >
    <div className={`${active ? 'scale-110 text-white' : 'group-hover:scale-110 text-zinc-400'} transition-transform`}>
      {icon}
    </div>
    <span className={`text-base ${active ? 'font-bold text-white' : 'font-medium text-zinc-300'}`}>{label}</span>
  </button>
);

export default App;
