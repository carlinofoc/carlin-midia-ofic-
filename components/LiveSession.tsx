
import React, { useState, useEffect, useRef } from 'react';
import { Post, User } from '../types';
import { Icons } from '../constants';
import { impactService, LIVE_POINTS_CYCLE_SECONDS, LIVE_POINTS_PER_CYCLE, LivePointsStatus, LiveStatusResponse, MIN_POINTS_FOR_DONATION, MAX_LIVE_BOOST_PERCENT, AdsDistributionImpact, GROWTH_SIM_DEFAULTS } from '../services/impactService';
import { simulateAIResponse } from '../services/geminiService';
import LivePointsFAQ from './LivePointsFAQ';
import DonatePointsButton from './DonatePointsButton';

interface LiveSessionProps {
  post: Post;
  user: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ post: initialPost, user, onUpdateUser, onBack }) => {
  const [post, setPost] = useState(initialPost);
  const [seconds, setSeconds] = useState(0);
  const [isPointsAwarded, setIsPointsAwarded] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [apiStatus, setApiStatus] = useState<LivePointsStatus | null>(null);
  const [liveStatus, setLiveStatus] = useState<LiveStatusResponse | null>(null);
  const [adsImpact, setAdsImpact] = useState<AdsDistributionImpact | null>(null);
  const [isForeground, setIsForeground] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [fraudReason, setFraudReason] = useState<string | null>(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [shouldPulseDonate, setShouldPulseDonate] = useState(false);

  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [showAdBanner, setShowAdBanner] = useState(false);
  const [adSeconds, setAdSeconds] = useState(0);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const sessionPointsEarned = useRef<number>(0);

  useEffect(() => {
    const handleVisibilityChange = () => setIsForeground(document.visibilityState === 'visible');
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchApiData = async () => {
      setIsSyncing(true);
      const [pointsRes, statusRes, impactRes] = await Promise.all([
        impactService.getLivePointsStatus(user, post, seconds),
        impactService.getLiveStatus(post),
        impactService.getAdsImpact(post, user)
      ]);
      setApiStatus(pointsRes);
      setLiveStatus(statusRes);
      setAdsImpact(impactRes);
      setIsSyncing(false);

      if (pointsRes.pointsAvailable >= MIN_POINTS_FOR_DONATION && !pointsRes.isBoostCapped) {
          setShouldPulseDonate(true);
      } else {
          setShouldPulseDonate(false);
      }
    };
    fetchApiData();
  }, [seconds, user.points, post.liveEngagementBoost]);

  useEffect(() => {
    const timer = setInterval(() => {
      const validation = impactService.validateLiveSession(isForeground, isOnline);
      
      if (validation.safe) {
        setFraudReason(null);
        setSeconds(prev => {
          if (prev + 1 >= LIVE_POINTS_CYCLE_SECONDS) {
            awardPoints();
            return 0;
          }
          return prev + 1;
        });

        if (liveStatus) {
            setAdSeconds(prev => {
                const intervalSeconds = liveStatus.adsConfig.frequencyMinutes * 60;
                if (prev + 1 >= intervalSeconds) {
                    triggerAd();
                    return 0;
                }
                return prev + 1;
            });
        }
      } else {
        setFraudReason(validation.reason || "Erro desconhecido");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isForeground, isOnline, liveStatus]);

  const triggerAd = () => {
    const random = Math.random();
    if (random > 0.5) {
        setShowAdOverlay(true);
        setTimeout(() => setShowAdOverlay(false), 15000); 
    } else {
        setShowAdBanner(true);
        setTimeout(() => setShowAdBanner(false), 30000); 
    }

    setMessages(prev => [{
        id: Date.now(),
        system: true,
        text: `📡 INTERVALO COMERCIAL ÉTICO (${liveStatus?.adsConfig.experienceMode === 'Optimized' ? 'REDUZIDO' : 'PADRÃO'})`
    }, ...prev]);
  };

  const awardPoints = () => {
    sessionPointsEarned.current += LIVE_POINTS_PER_CYCLE;
    const updatedUser = {
      ...user,
      points: (user.points || 0) + LIVE_POINTS_PER_CYCLE
    };
    onUpdateUser(updatedUser);
    localStorage.setItem('carlin_id_local', JSON.stringify(updatedUser));
    
    setIsPointsAwarded(true);
    setShouldPulseDonate(true);
    setTimeout(() => setIsPointsAwarded(false), 8000);
    
    setMessages(prev => [{
      id: Date.now(),
      system: true,
      text: `🏆 +${LIVE_POINTS_PER_CYCLE} PONTOS LIBERADOS! USE PARA IMPULSO.`
    }, ...prev]);
  };

  const handleDonate = async () => {
    if (isDonating) return;
    setIsDonating(true);
    setShouldPulseDonate(false);
    
    const pointsToDonate = MIN_POINTS_FOR_DONATION;

    setMessages(prev => [{
      id: Date.now() + 1001,
      system: true,
      text: `Sync: POST /api/v1/live/points/donate...`
    }, ...prev]);

    const result = await impactService.donatePointsToLive(user, post, pointsToDonate);
    
    if (result.status === "SUCCESS") {
      const updatedUser = { 
        ...user, 
        points: result._newBalance, 
        viewsLastYear: user.viewsLastYear + result.acceleratedViews,
        boostedViews: (user.boostedViews || 0) + result.acceleratedViews
      };
      const updatedPost = { ...post, liveEngagementBoost: result._newBoost };
      
      onUpdateUser(updatedUser);
      setPost(updatedPost);
      
      setMessages(prev => [{
        id: Date.now(),
        donator: user.username,
        text: `Impulsionou a live! (+${result.boostApplied} ⚡) • Total: ${result.currentBoost}`
      }, ...prev]);
    } else if (result.status === "CAPPED") {
      setMessages(prev => [{
        id: Date.now(),
        system: true,
        text: `🚫 LIMITE ATINGIDO: ${result.message}`
      }, ...prev]);
    } else {
      alert(result.message);
    }
    
    setIsDonating(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), username: user.username, text: inputText };
    setMessages(prev => [userMsg, ...prev]);
    setInputText('');

    if (messages.length % 3 === 0) {
      const response = await simulateAIResponse(inputText, `Assistindo live de ${post.username}`);
      setMessages(prev => [{ id: Date.now() + 1, username: `viewer_${Math.floor(Math.random()*100)}`, text: response }, ...prev]);
    }
  };

  const progressPercent = (seconds / LIVE_POINTS_CYCLE_SECONDS) * 100;
  
  const currentBoostVal = post.liveEngagementBoost || 0;
  const boostPercentOfCap = (currentBoostVal / MAX_LIVE_BOOST_PERCENT) * 100;
  
  let boostColorClass = "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]";
  if (currentBoostVal >= 20) boostColorClass = "bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]";
  else if (currentBoostVal >= 10) boostColorClass = "bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.6)]";

  return (
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black pointer-events-none">
         <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-64 h-64 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
         </div>
      </div>

      {showFAQ && <LivePointsFAQ onClose={() => setShowFAQ(false)} />}

      {/* BoostProgressBar */}
      <div className="relative z-20 w-full px-6 pt-4 space-y-1.5 animate-in slide-in-from-top-2 duration-700">
         <div className="flex justify-between items-center px-1">
            <span className="text-[7px] font-black uppercase text-zinc-500 tracking-[0.2em]">Soberania Algorítmica</span>
            <p className="text-[8px] font-black uppercase text-white tracking-widest">
               Boost de Engajamento: <span className={currentBoostVal >= 20 ? 'text-amber-400' : currentBoostVal >= 10 ? 'text-purple-400' : 'text-blue-400'}>{currentBoostVal}%</span> / {MAX_LIVE_BOOST_PERCENT}%
            </p>
         </div>
         <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 backdrop-blur-md">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${boostColorClass}`}
              style={{ width: `${boostPercentOfCap}%` }}
            >
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
         </div>
      </div>

      <div className="relative z-10 p-6 pt-4 flex items-start justify-between">
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl p-2 pr-6 rounded-full border border-white/10">
           <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all">
             <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
             </svg>
           </button>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-red-600 p-0.5">
                 <img src={post.userAvatar} className="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                 <div className="flex items-center gap-2">
                    <p className="text-[11px] font-black uppercase text-white truncate w-20">@{post.username}</p>
                    {liveStatus?.monetization.isAccelerated && (
                       <span className="text-[7px] bg-green-500/20 text-green-400 px-1 rounded-sm font-black border border-green-500/30">MONETIZANDO</span>
                    )}
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="bg-red-600 px-1.5 py-0.5 rounded text-[7px] font-black uppercase">LIVE</span>
                    <span className="text-[8px] font-bold text-zinc-300 uppercase">{liveStatus?.viewerCount.toLocaleString() || '1.2k'} assistindo</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col items-end gap-2">
           <div className="flex gap-2">
              <button 
                onClick={() => setShowFAQ(true)}
                className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-blue-500 transition-all shadow-xl"
              >
                 <span className="text-sm font-black italic">?</span>
              </button>
              <div className="bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-2xl backdrop-blur-xl shadow-xl text-right flex flex-col gap-0.5 min-w-[120px]">
                <div className="flex items-center justify-end gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-blue-500 animate-spin' : (liveStatus?.boostActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-700')}`}></div>
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Handshake API</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                   {apiStatus?.isBoostCapped && <span className="text-[8px] text-orange-500 font-black uppercase tracking-tighter">CAPPED</span>}
                   <p className={`text-lg font-black italic tracking-tighter ${apiStatus?.isBoostCapped ? 'text-orange-400' : 'text-white'}`}>
                     +{currentBoostVal}%
                   </p>
                </div>
              </div>
           </div>
           {isPointsAwarded && (
             <div className="bg-purple-600 border border-purple-500 text-white px-4 py-1.5 rounded-2xl text-[8px] font-black uppercase tracking-widest animate-in slide-in-from-right-4 shadow-xl">
                300 PONTOS RECEBIDOS! ⚡ PRONTO PARA DOAR.
             </div>
           )}
        </div>
      </div>

      <div className="flex-1 relative flex flex-col justify-center items-center overflow-y-auto pt-10 pb-20 scroll-smooth hide-scrollbar w-full">
         {/* Live Ads Overlay */}
         {showAdOverlay && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8 animate-in zoom-in-95 duration-500 pointer-events-auto">
                 <div className="bg-zinc-900 border border-blue-500/30 p-10 rounded-[3rem] text-center space-y-6 shadow-3xl max-w-sm">
                     <span className="text-4xl">🎯</span>
                     <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Publicidade Ética</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                            O Carlin permite anúncios apenas de marcas verificadas para manter a plataforma gratuita.
                        </p>
                     </div>
                     <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl">
                        <p className="text-[11px] text-blue-400 font-black uppercase">Educação & Tecnologia</p>
                     </div>
                     <button onClick={() => setShowAdOverlay(false)} className="text-[8px] font-black uppercase text-zinc-600 tracking-widest hover:text-white transition-colors">Fechar em 15s...</button>
                 </div>
             </div>
         )}

         {/* Live Ads Banner */}
         {showAdBanner && (
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[80] w-full max-w-xs animate-in slide-in-from-bottom-4 duration-500 pointer-events-auto">
                 <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-4 shadow-2xl">
                     <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-sm">🎓</span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-white uppercase truncate">Cursos Carlin Tech</p>
                        <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-tighter">Aprenda Marketing Digital Ético</p>
                     </div>
                     <button onClick={() => setShowAdBanner(false)} className="p-1 text-zinc-700 hover:text-white"><Icons.Plus className="w-4 h-4 rotate-45" /></button>
                 </div>
             </div>
         )}

         {fraudReason && (
           <div className="absolute top-10 bg-red-600/20 border border-red-500/40 px-6 py-2 rounded-full backdrop-blur-xl animate-in fade-in slide-in-from-top-4 z-50">
              <p className="text-[9px] font-black uppercase text-red-400 tracking-widest flex items-center gap-2">
                 <span className="text-xs">🚨</span> {fraudReason}
              </p>
           </div>
         )}

         <div className="relative group pointer-events-auto mb-8 shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center relative">
               <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle 
                    cx="50" cy="50" r="46" fill="transparent" stroke={fraudReason ? "#ef4444" : "#3b82f6"} strokeWidth="4" 
                    strokeDasharray="289" strokeDashoffset={289 - (289 * progressPercent) / 100}
                    strokeLinecap="round" className="transition-all duration-1000"
                  />
               </svg>
               <div className="text-center">
                  <p className="text-[8px] font-black uppercase text-zinc-500">Próximos Pontos</p>
                  <p className={`text-sm font-black ${fraudReason ? 'text-red-500' : 'text-white'}`}>{fraudReason ? 'PAUSADO' : apiStatus?.nextPointsIn || '...'}</p>
               </div>
            </div>
         </div>

         {/* Ads Priority Monitor (v8.4 Scale & Investor Data) */}
         <div className="flex flex-col items-center gap-6 pointer-events-auto px-4 w-full max-w-sm pb-10">
            <div className="bg-zinc-950/80 border border-zinc-800 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-3xl w-full">
                <div className="flex items-center justify-between w-full border-b border-zinc-900 pb-3">
                    <div className="flex flex-col">
                        <span className="text-[7px] font-black uppercase text-zinc-500 tracking-[0.2em]">Monitor de Impacto</span>
                        <span className="text-[5px] font-mono text-blue-500 uppercase tracking-widest">Engine v8.4 Scaling Logic</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full border text-[7px] font-black uppercase ${
                        adsImpact?.priorityLevel === 'Máxima' ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
                        adsImpact?.priorityLevel === 'Elevada' ? 'bg-purple-500/10 border-purple-500 text-purple-500' :
                        'bg-zinc-900 border-zinc-800 text-zinc-600'
                    }`}>
                        {adsImpact?.priorityLevel || 'SINC'}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                   <MetricBox label="Alcance Base" value={adsImpact?.estimatedMetrics?.baseReach.toLocaleString() || '0'} color="text-zinc-400" />
                   <MetricBox label="Alcance Final" value={adsImpact?.estimatedMetrics?.finalReach.toLocaleString() || '0'} color="text-white italic" isHighlighted />
                   <MetricBox label="Views Anúncios" value={adsImpact?.estimatedMetrics?.adsViews.toLocaleString() || '0'} color="text-zinc-400" />
                   <MetricBox label="Receita Proj. (BRL)" value={`R$ ${adsImpact?.estimatedMetrics?.revenue.amount.toFixed(2) || '0.00'}`} color="text-green-400" />
                </div>

                {/* V8.4 Investor Takeaway / Scaling Insight Box */}
                <div className="w-full bg-indigo-600/5 p-5 rounded-[2rem] border border-indigo-500/10 space-y-4 shadow-inner">
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🏛️</span>
                        <h4 className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Escala Estratégica</h4>
                      </div>
                      <span className="text-[5px] font-black text-indigo-600 uppercase tracking-widest">Investor Data</span>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="space-y-1.5">
                         <p className="text-[6px] font-black text-zinc-600 uppercase tracking-tighter ml-1">Drivers de Crescimento</p>
                         <div className="flex flex-wrap gap-1.5">
                            {adsImpact?.scalingLogic?.growthDrivers.map((driver, i) => (
                               <span key={i} className="px-2 py-0.5 bg-black/40 border border-zinc-800 rounded-lg text-[7px] font-bold text-zinc-400 uppercase tracking-tight">
                                  {driver}
                               </span>
                            ))}
                         </div>
                      </div>
                      <div className="h-px bg-zinc-900 w-full"></div>
                      <div className="space-y-1">
                         <p className="text-[6px] font-black text-zinc-600 uppercase tracking-tighter ml-1">Resultado Projetado</p>
                         <p className="text-[9px] font-black text-white italic bg-indigo-600/10 p-2 rounded-xl border border-indigo-500/10">
                            "{adsImpact?.scalingLogic?.expectedOutcome}"
                         </p>
                      </div>
                   </div>
                </div>

                <div className="w-full bg-zinc-900/60 p-4 rounded-[1.5rem] border border-white/5 space-y-3">
                   <div className="grid grid-cols-2 gap-4">
                      <SimVar label="Lives Mensais" value={GROWTH_SIM_DEFAULTS.livesPorMes} />
                      <SimVar label="Previsão 12m" value={`${adsImpact?.estimatedMetrics?.monthlyProjection.yearlyViews.toLocaleString()} views`} />
                      <SimVar label="Boost Atual" value={`${post.liveEngagementBoost || 0}%`} />
                      <SimVar label="Retenção" value={`${GROWTH_SIM_DEFAULTS.taxaRetencaoBase * 100}%`} />
                   </div>
                   <div className="h-px bg-zinc-800 w-full"></div>
                   <p className="text-[8px] text-zinc-400 font-medium italic leading-relaxed text-center">
                       "{adsImpact?.algorithmNote}"
                   </p>
                </div>
                <div className="flex justify-between w-full px-1">
                    <p className="text-[5px] font-mono text-zinc-800 uppercase tracking-widest">GET /api/v1/live/ads/impact</p>
                    <p className="text-[5px] font-mono text-zinc-800 uppercase tracking-widest">CPM: R$ {GROWTH_SIM_DEFAULTS.cpmmedio.toFixed(2)}</p>
                </div>
            </div>

            <p className="text-[9px] font-black uppercase text-blue-500 tracking-[0.4em] animate-pulse">Carlin Live Gateway</p>
            <div className="bg-zinc-900/60 border border-zinc-800 px-4 py-1.5 rounded-full flex items-center gap-3">
               <div className="flex flex-col items-center">
                  <span className="text-[6px] font-black text-zinc-600 uppercase">Alcance</span>
                  <span className={`text-[8px] font-black uppercase ${liveStatus?.boostActive ? 'text-green-500' : 'text-zinc-500'}`}>
                    {liveStatus?.estimatedReachIncrease || 'SYNCING'}
                  </span>
               </div>
               <div className="w-px h-4 bg-zinc-800"></div>
               <div className="flex flex-col items-center">
                  <span className="text-[6px] font-black text-zinc-600 uppercase">Capacidade</span>
                  <span className="text-[8px] text-zinc-400 font-black">{liveStatus?.maxBoost || '30%'}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="relative z-10 p-6 space-y-6 bg-gradient-to-t from-black via-black/80 to-transparent shrink-0">
        <div className="h-48 overflow-y-auto flex flex-col-reverse gap-2 px-2 mask-linear-top">
           <div ref={chatEndRef} />
           {messages.map((m) => (
             m.system ? (
               <div key={m.id} className="bg-blue-600/10 border border-blue-500/20 p-2 rounded-xl text-center">
                  <p className="text-[9px] font-bold text-blue-400 uppercase italic">{m.text}</p>
               </div>
             ) : m.donator ? (
               <div key={m.id} className="bg-indigo-600/20 border border-indigo-500/30 p-2 rounded-xl flex items-center gap-3">
                  <span className="text-xs">⚡</span>
                  <p className="text-[10px] font-medium text-white">
                    <span className="font-black text-indigo-400">@{m.donator}</span> {m.text}
                  </p>
               </div>
             ) : (
               <div key={m.id} className="flex gap-3">
                  <span className="text-[10px] font-black text-zinc-500 uppercase shrink-0">@{m.username}:</span>
                  <p className="text-[10px] text-zinc-300 leading-tight">{m.text}</p>
               </div>
             )
           ))}
        </div>

        <div className="flex gap-3 items-center">
          <form onSubmit={handleSendMessage} className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center px-4 py-3 focus-within:border-blue-500 transition-all">
             <input 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Diga algo na live..." 
              className="flex-1 bg-transparent outline-none text-xs text-white"
             />
             <button type="submit"><Icons.Message className="w-5 h-5 text-zinc-600" /></button>
          </form>

          <div className={`flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl shadow-2xl transition-all ${shouldPulseDonate ? 'ring-2 ring-purple-500/50 animate-pulse' : ''}`}>
             <div className="px-3 flex flex-col items-center">
                <span className="text-[7px] font-black text-zinc-600 uppercase">Saldo API</span>
                <span className={`text-xs font-black transition-colors ${apiStatus?.pointsAvailable && apiStatus.pointsAvailable >= 300 ? 'text-purple-400' : 'text-blue-500'}`}>{apiStatus?.pointsAvailable || 0}</span>
             </div>
             
             <DonatePointsButton 
              status={apiStatus} 
              isDonating={isDonating} 
              onDonate={handleDonate} 
             />
          </div>
        </div>

        <div className="text-center opacity-30 pb-2">
           <p className="text-[7px] font-black uppercase tracking-[0.4em]">Protocolo Antifraude: ATIVO • Governance: 30% CAP</p>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, color, isHighlighted = false }: { label: string, value: string, color: string, isHighlighted?: boolean }) => (
  <div className={`p-3 rounded-2xl border ${isHighlighted ? 'bg-blue-600/5 border-blue-500/10' : 'bg-black/40 border-white/5'} space-y-0.5`}>
    <p className="text-[6px] font-black text-zinc-600 uppercase tracking-tighter">{label}</p>
    <p className={`text-[11px] font-black truncate ${color}`}>{value}</p>
  </div>
);

const SimVar = ({ label, value }: { label: string, value: any }) => (
  <div className="flex justify-between items-center gap-2">
    <span className="text-[6px] font-black text-zinc-500 uppercase tracking-tighter">{label}</span>
    <span className="text-[8px] font-black text-zinc-300">{value}</span>
  </div>
);

export default LiveSession;
