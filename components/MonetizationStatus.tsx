
import React, { useState } from 'react';
import { User } from '../types';
import { impactService } from '../services/impactService';

interface MonetizationStatusProps {
  user: User;
  onBack: () => void;
}

const MonetizationStatus: React.FC<MonetizationStatusProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'payments' | 'terms' | 'faq'>('roadmap');
  
  const subReq = 1000;
  const viewReq = 500000;

  const subProgress = Math.min(100, (user.followers / subReq) * 100);
  const viewProgress = Math.min(100, (user.viewsLastYear / viewReq) * 100);
  const isFullyMonetized = user.followers >= subReq && user.viewsLastYear >= viewReq && !user.isMonetizationSuspended;

  const milestones = [
    { title: "Iniciante", req: "Padrão", isMet: user.followers >= 0, icon: "🌱" },
    { title: "Live", req: "50 Inscritos", isMet: user.followers >= 50 && !user.isMonetizationSuspended, icon: "📡" },
    { title: "Crescimento", req: "500 Inscritos", isMet: user.followers >= 500 && !user.isMonetizationSuspended, icon: "📈" },
    { title: "Membro", req: "1k Inscritos", isMet: user.followers >= 1000 && !user.isMonetizationSuspended, icon: "💎" },
    { title: "Ads Ativo", req: "1k + 500k Views", isMet: isFullyMonetized, icon: "💰" }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32 animate-in fade-in duration-500 overflow-y-auto">
      <div className="sticky top-0 z-[100] bg-black/80 backdrop-blur-md border-b border-zinc-900 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full">
            <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-lg font-black italic tracking-tighter uppercase leading-none">Progresso de Ganhos</h1>
        </div>
        <div className={`px-4 py-1.5 rounded-full border transition-all duration-700 ${user.isMonetizationSuspended ? 'bg-red-600/20 border-red-500' : isFullyMonetized ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] border-blue-400' : 'bg-zinc-900 border-zinc-800'}`}>
           <span className={`text-[9px] font-black uppercase tracking-widest ${user.isMonetizationSuspended ? 'text-red-500' : isFullyMonetized ? 'text-white' : 'text-zinc-500'}`}>
             {user.isMonetizationSuspended ? 'SUSPENSO' : isFullyMonetized ? 'CONTA ATIVA' : 'PENDENTE'}
           </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-10">
        {user.isMonetizationSuspended && (
          <div className="bg-red-600/10 border border-red-500/30 p-8 rounded-[2.5rem] space-y-4 animate-pulse">
            <div className="flex items-center gap-4 text-red-500">
               <span className="text-3xl">⚠️</span>
               <h3 className="text-sm font-black uppercase tracking-widest">Monetização Suspensa</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              Sua conta foi suspensa de todas as atividades de monetização por nossa equipe administrativa.
            </p>
            {user.suspensionReason && (
              <div className="bg-black/40 p-4 rounded-2xl border border-red-500/20">
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Motivo Oficial:</p>
                <p className="text-[11px] text-red-400 italic">{user.suspensionReason}</p>
              </div>
            )}
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-center mt-2">
              Se você acredita que isso foi um erro, entre em contato com suporte@carlin.midia.ofic
            </p>
          </div>
        )}

        {/* Requirement Dashboards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${user.isMonetizationSuspended ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
           <RequirementCard 
            label="Inscritos para Membros" 
            current={user.followers} 
            target={subReq} 
            percent={subProgress} 
            color="bg-indigo-500"
            icon="💎"
           />
           <RequirementCard 
            label="Visualizações para Ads" 
            current={user.viewsLastYear} 
            target={viewReq} 
            percent={viewProgress} 
            color="bg-blue-500"
            icon="🎬"
           />
        </div>

        {/* Action Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar border-b border-zinc-900 pb-4">
           <TabBtn active={activeTab === 'roadmap'} onClick={() => setActiveTab('roadmap')} label="Conquistas" />
           <TabBtn active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} label="Saques" />
           <TabBtn active={activeTab === 'terms'} onClick={() => setActiveTab('terms')} label="Regras" />
           <TabBtn active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} label="FAQ" />
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'roadmap' && (
            <div className="space-y-6 relative pl-10">
               <div className="absolute left-4.5 top-2 bottom-2 w-0.5 bg-zinc-800"></div>
               {milestones.map((m, i) => (
                 <div key={i} className={`relative flex items-center gap-6 p-5 rounded-[2rem] border transition-all ${m.isMet ? 'bg-zinc-900/60 border-zinc-800 opacity-100' : 'bg-transparent border-transparent opacity-30 grayscale'}`}>
                    <div className={`absolute -left-9 w-8 h-8 rounded-full flex items-center justify-center text-[10px] z-10 border-4 border-black ${m.isMet ? 'bg-blue-600' : 'bg-zinc-800'}`}>
                       {m.isMet ? '✓' : ''}
                    </div>
                    <span className="text-3xl">{m.icon}</span>
                    <div className="flex-1">
                       <h4 className="text-xs font-black uppercase text-white tracking-widest">{m.title}</h4>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase">{m.req}</p>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] space-y-8 shadow-2xl">
               <div className="space-y-2">
                 <h3 className="text-xs font-black uppercase text-blue-500 tracking-widest">Fluxo de Retirada</h3>
                 <p className="text-[11px] text-zinc-500 leading-relaxed">O Carlin utiliza processamento manual para garantir que cada centavo chegue ao criador sem fraudes algorítmicas.</p>
               </div>
               
               <div className="grid gap-3 pt-4">
                  <Method icon="💠" name="PIX" />
                  <Method icon="💳" name="PayPal" />
                  <Method icon="🏦" name="Transferência" />
               </div>

               <div className="p-6 bg-black/40 rounded-3xl border border-zinc-800">
                  <p className="text-[10px] text-zinc-400 italic leading-relaxed text-center font-medium">
                    "Mínimo de R$ 50,00 por saque. Prazo de análise de segurança: 48h úteis."
                  </p>
               </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="bg-zinc-900/40 border border-zinc-800 p-10 rounded-[3rem] space-y-6">
               <h3 className="text-sm font-black uppercase text-white tracking-widest text-center">Contrato de Transparência</h3>
               <div className="space-y-4">
                 <Rule text="Conteúdo 100% Original e Autoral." />
                 <Rule text="Proibida a compra de inscritos ou visualizações." />
                 <Rule text="Respeito total às Diretrizes da Comunidade." />
                 <Rule text="Auditoria humana em todas as solicitações de saque." />
               </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
               <FaqItem q="As visualizações expiram?" a="O requisito de 500k considera os últimos 12 meses acumulados." />
               <FaqItem q="Posso perder a monetização?" a="Sim, se houver violação das regras éticas ou inatividade por mais de 6 meses." />
               <FaqItem q="O selo Ouro ajuda nos ganhos?" a="Indiretamente sim, pois gera mais confiança e conversão em membros." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RequirementCard = ({ label, current, target, percent, color, icon }: any) => (
  <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 shadow-xl relative overflow-hidden group">
     <div className={`absolute top-0 right-0 p-6 transition-transform group-hover:scale-110 ${percent >= 100 ? 'opacity-100' : 'opacity-10'}`}>
        <span className="text-3xl">{percent >= 100 ? '✅' : icon}</span>
     </div>
     <div className="space-y-1">
        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{label}</span>
        <p className="text-2xl font-black italic tracking-tighter text-white">{current.toLocaleString()} <span className="text-xs text-zinc-700 font-bold uppercase tracking-widest">/ {target.toLocaleString()}</span></p>
     </div>
     <div className="space-y-2 pt-2">
        <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-zinc-800">
           <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]`} style={{ width: `${percent}%` }}></div>
        </div>
        <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-600 tracking-widest">
           <span>{Math.floor(percent)}%</span>
           <span>{percent >= 100 ? 'Meta Atingida' : 'Em Progresso'}</span>
        </div>
     </div>
  </div>
);

const TabBtn = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-zinc-900 text-zinc-500'}`}>
    {label}
  </button>
);

const FaqItem = ({ q, a }: any) => (
  <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] space-y-2 group hover:border-blue-500/30 transition-all">
     <h4 className="text-[11px] font-black uppercase text-white group-hover:text-blue-400 transition-colors">{q}</h4>
     <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{a}</p>
  </div>
);

const Rule = ({ text }: { text: string }) => (
  <div className="flex gap-4 items-center">
     <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
     <p className="text-xs text-zinc-300 font-bold uppercase tracking-tight">{text}</p>
  </div>
);

const Method = ({ icon, name }: any) => (
  <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-zinc-800">
     <span className="text-xl">{icon}</span>
     <span className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">{name}</span>
  </div>
);

export default MonetizationStatus;