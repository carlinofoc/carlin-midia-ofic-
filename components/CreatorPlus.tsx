
import React from 'react';
import { User } from '../types';

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
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full shadow-lg shadow-indigo-500/20">
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Plano CarlinPremium</span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Apoie quem te respeita.</h1>
          <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-md mx-auto">
            O Carlin é independente de cassinos e publicidade abusiva. Ao assinar o <span className="text-white font-bold">CarlinPremium</span>, você sustenta a rede mais justa e ganha acesso ao nosso laboratório privado.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <BenefitCard icon="🧪" title="Laboratório Labs" text="Acesso exclusivo ao APK beta e versões experimentais distribuídas em grupos fechados." />
           <BenefitCard icon="📊" title="Métricas de Impacto" text="Dashboard Pro com foco em retenção e valor social real, sem métricas de vaidade." />
           <BenefitCard icon="🗳️" title="Voto Prioritário" text="Seus feedbacks são analisados primeiro e moldam a prioridade da engenharia." />
           <BenefitCard icon="🛡️" title="Badge Premium" text="Selo exclusivo de apoiador no perfil e status 'Active Subscriber' garantido." />
        </div>

        {/* Ethics Box - MANDATORY RULES */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
           <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest text-center">Regras de Assinante</h3>
           <div className="space-y-4">
              <RuleItem text="O APK beta é privado e de uso pessoal exclusivo para assinantes ativos." />
              <RuleItem text="O CarlinPremium é o que nos permite manter a rede livre de anúncios de cassino." />
              <RuleItem text="Cancelamento respeitoso: 2 cliques e você volta ao plano comum no próximo ciclo." />
           </div>
        </div>

        {/* FAQ Link */}
        <button 
          onClick={onOpenFAQ}
          className="w-full p-6 bg-zinc-900/30 border border-zinc-800 rounded-3xl flex items-center justify-between group hover:border-blue-500/30 transition-all shadow-xl"
        >
          <div className="text-left">
            <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Dúvidas?</h4>
            <p className="text-xs text-zinc-300 font-bold uppercase mt-1">Veja o FAQ da Assinatura</p>
          </div>
          <svg className="w-5 h-5 text-zinc-600 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 border border-indigo-500/20 rounded-[3rem] p-10 text-center space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4">
              <span className="px-2 py-1 bg-blue-600 text-[8px] font-black rounded uppercase">Preço Sustentável</span>
           </div>
           
           <div className="space-y-2">
              <p className="text-3xl font-black tracking-tighter">R$ 9,90 <span className="text-sm text-zinc-500 font-bold uppercase tracking-widest">/ mês</span></p>
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Para quem quer co-criar o futuro</p>
           </div>

           <button 
             onClick={onSubscribe}
             disabled={isPremium}
             className={`w-full ${isPremium ? 'bg-zinc-800 text-zinc-500 cursor-default' : 'bg-white text-black active:scale-95'} py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all shadow-blue-600/10`}
           >
             {isPremium ? 'Sua Assinatura está Ativa 💎' : 'Assinar CarlinPremium Agora'}
           </button>
           
           {isPremium && (
             <button 
              onClick={onOpenCancel}
              className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest hover:text-red-500 transition-colors underline"
             >
               Gerenciar ou Cancelar Assinatura
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const BenefitCard = ({ icon, title, text }: { icon: string, title: string, text: string }) => (
  <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl space-y-2 hover:bg-zinc-900 transition-colors">
    <span className="text-2xl">{icon}</span>
    <h4 className="text-xs font-black uppercase text-white tracking-widest">{title}</h4>
    <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">{text}</p>
  </div>
);

const RuleItem = ({ text }: { text: string }) => (
  <div className="flex gap-3 items-center">
    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></div>
    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">{text}</p>
  </div>
);

export default CreatorPlus;
