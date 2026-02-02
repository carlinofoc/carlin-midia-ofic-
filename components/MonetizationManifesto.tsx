
import React, { useState } from 'react';

interface MonetizationManifestoProps {
  onBack: () => void;
}

const MonetizationManifesto: React.FC<MonetizationManifestoProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<'manifesto' | 'why' | 'advertisers' | 'premium'>('manifesto');

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-xl font-black italic tracking-tighter uppercase text-blue-500">Ética e Valor</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar border-b border-zinc-900 pb-4">
           {[
             { id: 'manifesto', label: 'Manifesto' },
             { id: 'why', label: 'Anti-Cassino' },
             { id: 'advertisers', label: 'Anunciantes' },
             { id: 'premium', label: 'Futuro' }
           ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeSection === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-900 text-zinc-500'}`}
             >
               {tab.label}
             </button>
           ))}
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {activeSection === 'manifesto' && (
            <div className="space-y-8">
               <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-[3rem] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Manifesto pela Experiência Justa</h2>
                  <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
                    <p>O Carlin Mídia Ofic nasceu para valorizar criadores, ideias e conexões reais.</p>
                    <p>Não acreditamos em crescimento baseado em anúncios invasivos, promessas enganosas ou plataformas que exploram impulsos emocionais.</p>
                    <p className="text-white font-bold italic">Por isso, não aceitamos anúncios de cassinos, apostas ou jogos de azar.</p>
                    <p>Nosso compromisso é com uma experiência limpa, honesta e respeitosa — tanto para quem cria quanto para quem consome conteúdo.</p>
                    <p>Preferimos crescer com confiança do que lucrar com algo que prejudica nossa comunidade.</p>
                  </div>
               </div>
            </div>
          )}

          {activeSection === 'why' && (
            <div className="space-y-8">
               <h2 className="text-2xl font-black italic uppercase tracking-tighter">Por que não exibimos anúncios de cassino?</h2>
               <div className="grid gap-4">
                  <ReasonCard title="Geração de Frustração" text="Esses anúncios prometem ganhos irreais que levam à quebra de confiança." />
                  <ReasonCard title="Impacto na Experiência" text="Conteúdos de azar saturam o feed e degradam a qualidade da plataforma." />
                  <ReasonCard title="Divergência de Valores" text="Apoiamos a criação de valor real, não a exploração de perdas alheias." />
               </div>
               <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest text-center pt-8 italic">"Essa decisão é definitiva e faz parte da identidade da plataforma."</p>
            </div>
          )}

          {activeSection === 'advertisers' && (
            <div className="space-y-8">
               <h2 className="text-2xl font-black italic uppercase tracking-tighter">Por que anunciar no Carlin?</h2>
               <div className="bg-blue-600/10 border border-blue-600/20 p-8 rounded-[3rem] space-y-6">
                  <p className="text-sm font-medium leading-relaxed">O Carlin Mídia Ofic é uma plataforma focada em criadores reais e públicos engajados, não em tráfego vazio.</p>
                  <ul className="space-y-4">
                     <li className="flex gap-4">
                        <span className="text-blue-500 font-black">✔</span>
                        <p className="text-xs font-bold uppercase tracking-widest">Usuários atentos, não saturados</p>
                     </li>
                     <li className="flex gap-4">
                        <span className="text-blue-500 font-black">✔</span>
                        <p className="text-xs font-bold uppercase tracking-widest">Ambiente sem anúncios agressivos</p>
                     </li>
                     <li className="flex gap-4">
                        <span className="text-blue-500 font-black">✔</span>
                        <p className="text-xs font-bold uppercase tracking-widest">Associação com uma marca ética</p>
                     </li>
                  </ul>
               </div>
               <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Categorias Aceitas:</h4>
                  <div className="flex flex-wrap gap-2">
                     {['Educação', 'Tecnologia', 'Ferramentas Digitais', 'Marcas Criativas', 'Serviços Legítimos'].map(c => (
                       <span key={c} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-bold uppercase tracking-tighter">{c}</span>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeSection === 'premium' && (
            <div className="space-y-8">
               <h2 className="text-2xl font-black italic uppercase tracking-tighter">Monetização Sustentável</h2>
               <div className="space-y-6">
                  <RoadmapCard 
                    title="1. Recursos Premium" 
                    items={["Destaque de Perfil", "Estatísticas Avançadas", "Personalização Extra"]}
                    badge="EM BREVE"
                  />
                  <RoadmapCard 
                    title="2. Marketplace de Criadores" 
                    items={["Venda de Cursos", "E-books e Mentorias", "Taxa justa para plataforma"]}
                    badge="ROADMAP"
                  />
                  <RoadmapCard 
                    title="3. Apoio Direto" 
                    items={["Gorjetas Unificadas", "Assinaturas de Criador", "Conteúdo Exclusivo"]}
                    badge="IDEIA"
                  />
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReasonCard = ({ title, text }: { title: string, text: string }) => (
  <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-2">
    <h4 className="text-xs font-black uppercase text-white">{title}</h4>
    <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{text}</p>
  </div>
);

const RoadmapCard = ({ title, items, badge }: { title: string, items: string[], badge: string }) => (
  <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] space-y-4">
    <div className="flex justify-between items-center">
       <h4 className="text-sm font-black uppercase italic tracking-tighter text-white">{title}</h4>
       <span className="px-2 py-0.5 bg-blue-600/20 text-blue-500 text-[8px] font-black rounded uppercase">{badge}</span>
    </div>
    <ul className="space-y-2">
       {items.map(i => (
         <li key={i} className="flex gap-2 items-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
            {i}
         </li>
       ))}
    </ul>
  </div>
);

export default MonetizationManifesto;
