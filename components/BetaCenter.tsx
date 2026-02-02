
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

  if (!user.isPremium) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center border border-zinc-800 shadow-2xl">
          <span className="text-4xl">💎</span>
        </div>
        <div className="space-y-4 max-w-sm">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Recurso Exclusivo</h2>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed">
            O Programa Beta é reservado para assinantes Premium. Faça parte do laboratório Carlin e molde o futuro da plataforma.
          </p>
        </div>
        <button onClick={onBack} className="bg-zinc-800 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Voltar para o Perfil</button>
      </div>
    );
  }

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
        <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full">
           <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Premium Ativo</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-10">
        {/* Painel de Participação */}
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-[3rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>
          
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Participar do Beta</h3>
                <button 
                  onClick={toggleBeta}
                  className={`w-14 h-7 rounded-full relative transition-all ${user.isBetaTester ? 'bg-blue-600' : 'bg-zinc-700'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${user.isBetaTester ? 'left-8' : 'left-1'}`}></div>
                </button>
             </div>
             <p className="text-[11px] text-zinc-500 leading-relaxed">
               Ao ativar, seu perfil terá o badge <span className="text-blue-500 font-bold uppercase tracking-tighter text-[9px]">Beta Tester</span>. Você poderá testar compilações experimentais do APK.
             </p>
             <button onClick={onOpenTerms} className="text-[10px] text-blue-500 font-black uppercase tracking-widest hover:underline">Ver Termos do Programa Beta</button>
          </div>

          {user.isBetaTester && (
            <div className="space-y-6 pt-6 border-t border-zinc-800 animate-in slide-in-from-top-4 duration-500">
               <div className="flex items-center justify-between">
                  <div className="flex-1">
                     <h4 className="text-xs font-black uppercase text-zinc-100">Alertas de Versão</h4>
                     <p className="text-[9px] text-zinc-500 uppercase tracking-tighter font-bold">Receber e-mail automático para novas compilações</p>
                  </div>
                  <button 
                    onClick={toggleNotifications}
                    className={`w-12 h-6 rounded-full relative transition-all ${user.betaNotifications ? 'bg-blue-600' : 'bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${user.betaNotifications ? 'left-7' : 'left-1'}`}></div>
                  </button>
               </div>

               <div className="p-6 bg-blue-600 rounded-[2rem] space-y-4 shadow-xl shadow-blue-600/20">
                  <div className="flex items-center gap-3">
                     <span className="text-2xl">🤖</span>
                     <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tighter">Carlin Beta v4.2.0-rc1</h4>
                        <p className="text-[9px] text-white/70 font-bold uppercase tracking-widest">Tamanho: 42MB • ARM64</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => window.open(betaApkUrl, '_blank')}
                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Download APK Beta
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Voting & Comments Section */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗳️</span>
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Votação & Debate</h3>
              </div>
              <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Recursos Sugeridos</span>
           </div>
           
           <div className="space-y-4">
              {features.map(feature => (
                <div key={feature.id} className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden transition-all">
                   <div className="p-6 flex items-center justify-between gap-6">
                      <div className="flex-1 space-y-2 cursor-pointer" onClick={() => setExpandedFeature(expandedFeature === feature.id ? null : feature.id)}>
                         <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black uppercase tracking-widest">{feature.title}</h4>
                            <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase ${
                               feature.status === 'voting' ? 'bg-zinc-800 text-zinc-500' : 
                               feature.status === 'testing' ? 'bg-green-600/20 text-green-500' : 'bg-blue-600/20 text-blue-500'
                            }`}>
                               {feature.status === 'voting' ? 'Votação' : feature.status === 'testing' ? 'Teste' : 'Dev'}
                            </span>
                         </div>
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

                   {expandedFeature === feature.id && (
                     <div className="px-6 pb-6 pt-2 border-t border-zinc-800/50 bg-black/20 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-xs text-zinc-400 mb-6 leading-relaxed italic">"{feature.description}"</p>
                        
                        {/* Seção de Comentários */}
                        <div className="space-y-4">
                           <div className="flex gap-2">
                              <input 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Dê sua opinião sobre este recurso..."
                                className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs outline-none focus:border-blue-500 transition-all"
                              />
                              <button 
                                onClick={() => handleAddComment(feature.id)}
                                className="bg-zinc-800 px-4 rounded-xl text-[10px] font-black uppercase"
                              >
                                Enviar
                              </button>
                           </div>
                           
                           <div className="space-y-3 max-h-40 overflow-y-auto pr-2 hide-scrollbar">
                              {feature.comments?.map(comment => (
                                <div key={comment.id} className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
                                   <div className="flex justify-between items-center mb-1">
                                      <span className="text-[9px] font-black uppercase text-blue-500">@{comment.username}</span>
                                      <span className="text-[7px] text-zinc-600 font-bold uppercase">Just now</span>
                                   </div>
                                   <p className="text-[10px] text-zinc-300">{comment.text}</p>
                                </div>
                              ))}
                              {(!feature.comments || feature.comments.length === 0) && (
                                <p className="text-[9px] text-zinc-700 uppercase font-black tracking-widest text-center py-4">Nenhum comentário ainda</p>
                              )}
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* Feedback de Bugs */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-2">
              <span className="text-2xl">💬</span>
              <h3 className="text-sm font-black uppercase text-white tracking-widest">Relatório de LABS</h3>
           </div>
           <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
              <p className="text-[11px] text-zinc-500 leading-relaxed text-center">
                Encontrou um erro em uma versão de teste? Envie o log aqui para nossa engenharia.
              </p>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Log do bug ou sugestão de UI..."
                className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-200 outline-none focus:border-blue-500 transition-all resize-none min-h-[100px] placeholder:text-zinc-700"
              />
              {showSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl animate-in zoom-in-95">
                   <p className="text-[10px] text-green-500 font-black uppercase text-center tracking-widest">Log enviado com sucesso! 🚀</p>
                </div>
              )}
              <button 
                onClick={submitFeedback}
                disabled={isSubmitting || !feedback.trim()}
                className="w-full bg-zinc-100 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all disabled:opacity-30 shadow-lg"
              >
                {isSubmitting ? 'Processando...' : 'Submeter Relatório'}
              </button>
           </div>
        </div>

        <div className="p-8 text-center">
           <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-[0.3em] leading-relaxed">
             Carlin Labs • Exclusivo Premium<br/>
             Suas sugestões moldam o build estável.
           </p>
        </div>
      </div>
    </div>
  );
};

export default BetaCenter;
