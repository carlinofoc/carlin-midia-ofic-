
import React from 'react';
import { User } from '../types';
import { SupportMessages } from '../constants';

interface CreatorPlusProps {
  user: User;
  onSubscribe: () => void;
  onBack: () => void;
  onOpenFAQ: () => void;
  onOpenCancel: () => void;
}

const CreatorPlus: React.FC<CreatorPlusProps> = ({ user, onSubscribe, onBack, onOpenFAQ, onOpenCancel }) => {
  const isPremium = user.subscriptionStatus === 'active';

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 transition-colors border border-zinc-800 shadow-lg">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full shadow-lg shadow-indigo-500/20">
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">CarlinPremium</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{SupportMessages.TITLE}</h1>
          <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-md mx-auto italic">
            "{SupportMessages.DESCRIPTION}"
          </p>
        </div>

        {/* Support Details Grid */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
           <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest text-center">Custos Cobertos</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SupportMessages.DETAILS.map((detail, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0"></div>
                  <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-tight">{detail}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Benefits Section */}
        <div className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 px-4">Vantagens Exclusivas</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BenefitCard icon="🧪" title="Labs Privado" text="Acesso ao APK beta e versões experimentais distribuídas no grupo oficial." />
              <BenefitCard icon="📊" title="Analytics Real" text="Dashboard com foco em retenção e valor social, sem métricas de vaidade." />
              <BenefitCard icon="🗳️" title="Voz Ativa" text="Seus feedbacks moldam as prioridades da engenharia Carlin." />
              <BenefitCard icon="🛡️" title="Selo de Apoio" text="Badge exclusivo de apoiador e status 'Active Subscriber' no perfil." />
           </div>
        </div>

        {/* Social Impact Reminder */}
        <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] space-y-4 shadow-inner">
           <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest leading-none">Impacto Social</h4>
           </div>
           <p className="text-xs text-zinc-300 leading-relaxed font-medium italic">
             "{SupportMessages.SOCIAL_IMPACT}"
           </p>
        </div>

        {/* Optionality & FAQ */}
        <div className="space-y-4">
           <div className="p-6 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl text-center">
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">
                {SupportMessages.OPTIONAL}
              </p>
           </div>
           <button 
             onClick={onOpenFAQ}
             className="w-full p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl flex items-center justify-between group hover:border-blue-500/30 transition-all"
           >
             <div className="text-left">
               <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Dúvidas?</h4>
               <p className="text-xs text-zinc-300 font-bold uppercase mt-1">Veja o FAQ da Assinatura</p>
             </div>
             <svg className="w-5 h-5 text-zinc-600 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
           </button>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/20 rounded-[3rem] p-10 text-center space-y-8 relative overflow-hidden shadow-3xl">
           <div className="absolute top-0 right-0 p-4">
              <span className="px-2 py-1 bg-indigo-600 text-[8px] font-black rounded uppercase">Mensal</span>
           </div>
           
           <div className="space-y-2">
              <p className="text-3xl font-black tracking-tighter">R$ 9,90 <span className="text-sm text-zinc-500 font-bold uppercase tracking-widest">/ mês</span></p>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Co-Crie o Futuro do Carlin</p>
           </div>

           <button 
             onClick={onSubscribe}
             disabled={isPremium}
             className={`w-full ${isPremium ? 'bg-zinc-800 text-zinc-500 cursor-default' : 'bg-white text-black active:scale-95 shadow-2xl'} py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all`}
           >
             {isPremium ? 'Assinatura Ativa 💎' : SupportMessages.BUTTON}
           </button>
           
           {isPremium && (
             <button 
              onClick={onOpenCancel}
              className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest hover:text-red-500 transition-colors underline"
             >
               Gerenciar Assinatura
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const BenefitCard = ({ icon, title, text }: { icon: string, title: string, text: string }) => (
  <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-2 hover:bg-zinc-900 transition-colors border-l-4 border-l-blue-600/30 shadow-lg">
    <span className="text-2xl">{icon}</span>
    <h4 className="text-xs font-black uppercase text-white tracking-widest">{title}</h4>
    <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">{text}</p>
  </div>
);

export default CreatorPlus;
