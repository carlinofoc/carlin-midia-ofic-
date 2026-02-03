
import React, { useState } from 'react';
import { User, BetaFeature, BetaComment } from '../types';

interface BetaCenterProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
  onOpenTerms: () => void;
}

const INITIAL_FEATURES: BetaFeature[] = [
  { id: 'f1', title: 'Modo Realidade Aumentada', description: 'Visualizar posts 3D no ambiente real através da câmera.', votes: 452, status: 'voting', comments: [] },
  { id: 'f2', title: 'Tradução de Voz em Tempo Real', description: 'Ouvir criadores internacionais no seu idioma nativo.', votes: 890, status: 'testing', comments: [] },
  { id: 'f3', title: 'Filtros de IA de Alta Fidelidade', description: 'Processamento neural avançado para fotos mobile.', votes: 320, status: 'development', comments: [] },
];

const BetaCenter: React.FC<BetaCenterProps> = ({ user, onUpdateUser, onBack, onOpenTerms }) => {
  const [features, setFeatures] = useState<BetaFeature[]>(INITIAL_FEATURES);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const isPremiumActive = user.subscriptionStatus === 'active';

  const toggleBeta = () => {
    onUpdateUser({ ...user, isBetaTester: !user.isBetaTester });
  };

  const toggleNotifications = () => {
    onUpdateUser({ ...user, betaNotifications: !user.betaNotifications });
  };

  const handleVote = (id: string) => {
    if (votedIds.includes(id)) return;
    setVotedIds([...votedIds, id]);
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, votes: f.votes + 1 } : f));
  };

  const handleAddComment = (featureId: string) => {
    if (!commentText.trim()) return;
    
    const newComment: BetaComment = {
      id: Math.random().toString(),
      userId: user.id,
      username: user.username,
      text: commentText,
      timestamp: new Date()
    };

    setFeatures(prev => prev.map(f => 
      f.id === featureId 
        ? { ...f, comments: [newComment, ...(f.comments || [])] } 
        : f
    ));
    setCommentText('');
  };

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const betaApkUrl = "https://github.com/carlin-oficial/carlin-midia-ofic/releases/download/v4.2.0-beta/app-beta.apk";

  return (
    <div className="min-h-screen bg-black text-white pb-32 animate-in fade-in duration-500 overflow-y-auto">
      <div className="sticky top-0 z-[100] bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all">
            <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-black italic tracking-tighter uppercase leading-none">Carlin LABS</h1>
            <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Programa de Antecipação v4.2</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${isPremiumActive ? 'bg-blue-600/10 border border-blue-500/20' : 'bg-zinc-800'}`}>
           <span className={`text-[8px] font-black uppercase tracking-widest ${isPremiumActive ? 'text-blue-500' : 'text-zinc-500'}`}>
             {isPremiumActive ? 'Premium Ativo' : 'Acesso Limitado'}
           </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-10">
        {/* Painel de Acesso APK (Assinantes) */}
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-[3rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
          {!isPremiumActive && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <span className="text-4xl">🔒</span>
                <h3 className="text-xl font-black italic tracking-tighter uppercase">Download Exclusivo</h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-xs">
                  O acesso às compilações beta e ao grupo fechado é restrito a assinantes <strong>CarlinPremium</strong>.
                </p>
                <button 
                  onClick={() => alert('Assine no menu Perfil > Seja Criador+')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl"
                >
                  Fazer Upgrade por R$ 9,90
                </button>
             </div>
          )}

          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Acesso ao APK Beta</h3>
                {isPremiumActive && (
                  <button 
                    onClick={toggleBeta}
                    className={`w-14 h-7 rounded-full relative transition-all ${user.isBetaTester ? 'bg-blue-600' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${user.isBetaTester ? 'left-8' : 'left-1'}`}></div>
                  </button>
                )}
             </div>
             <p className="text-[11px] text-zinc-500 leading-relaxed">
               As versões beta são privadas e distribuídas exclusivamente para o grupo fechado de testes.
             </p>
          </div>

          {isPremiumActive && user.isBetaTester && (
            <div className="space-y-6 pt-6 border-t border-zinc-800 animate-in slide-in-from-top-4 duration-500">
               <div className="p-6 bg-blue-600 rounded-[2rem] space-y-4 shadow-xl shadow-blue-600/20">
                  <div className="flex items-center gap-3">
                     <span className="text-2xl">🤖</span>
                     <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tighter">Carlin Beta v4.2.0-rc1</h4>
                        <p className="text-[9px] text-white/70 font-bold uppercase tracking-widest">Grupo: {user.betaGroup || 'Geral'}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => window.open(betaApkUrl, '_blank')}
                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Download APK Privado
                  </button>
                  <p className="text-[8px] text-white/60 text-center uppercase font-black tracking-widest">
                    Proibida a distribuição pública deste binário.
                  </p>
               </div>
            </div>
          )}
        </div>

        {/* Feedback Section (Public) */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗳️</span>
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Formulário de Feedback</h3>
              </div>
              <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest">Aberto ao Público</span>
           </div>
           
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
              <p className="text-[11px] text-zinc-500 leading-relaxed text-center">
                Qualquer usuário pode enviar logs ou sugestões. Assinantes têm prioridade de análise.
              </p>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Sugestão de interface ou log de erro..."
                className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-200 outline-none focus:border-blue-500 transition-all resize-none min-h-[100px] placeholder:text-zinc-700"
              />
              {showSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl animate-in zoom-in-95">
                   <p className="text-[10px] text-green-500 font-black uppercase text-center tracking-widest">Recebido! Obrigado por colaborar. 🚀</p>
                </div>
              )}
              <button 
                onClick={submitFeedback}
                disabled={isSubmitting || !feedback.trim()}
                className="w-full bg-zinc-100 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all disabled:opacity-30 shadow-lg"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Feedback Público'}
              </button>
           </div>
        </div>

        {/* Voting Section (Subscribers prioritized) */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Futuros Recursos</h3>
              </div>
           </div>
           
           <div className="space-y-4">
              {features.map(feature => (
                <div key={feature.id} className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden transition-all">
                   <div className="p-6 flex items-center justify-between gap-6">
                      <div className="flex-1 space-y-2 cursor-pointer" onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}>
                         <h4 className="text-xs font-black uppercase tracking-widest text-white">{feature.title}</h4>
                         <p className="text-[10px] text-zinc-500 leading-tight line-clamp-1">{feature.description}</p>
                      </div>
                      <button 
                       onClick={() => handleVote(feature.id)}
                       disabled={votedIds.includes(feature.id)}
                       className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[64px] border transition-all ${
                         votedIds.includes(feature.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'
                       }`}
                      >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                         <span className="text-[10px] font-black mt-1">{feature.votes}</span>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="p-8 text-center">
           <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-[0.3em] leading-relaxed">
             Carlin Labs • Gestão de Antecipação<br/>
             APK Beta Privado • Feedback Público
           </p>
        </div>
      </div>
    </div>
  );
};

export default BetaCenter;
