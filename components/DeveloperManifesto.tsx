
import React from 'react';

interface DeveloperManifestoProps {
  onBack: () => void;
}

const DeveloperManifesto: React.FC<DeveloperManifestoProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black text-zinc-300 p-6 lg:p-12 animate-in fade-in duration-700 overflow-y-auto pb-32">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
            </svg>
          </button>
          <div className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Documento Oficial</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="space-y-4">
           <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-[0.9]">Manifesto do Desenvolvedor</h1>
           <p className="text-blue-500 font-bold text-xs uppercase tracking-[0.4em]">Carlin Mídia Ofic</p>
        </div>

        {/* Body Text */}
        <div className="space-y-10 text-sm lg:text-base leading-relaxed">
           <section className="space-y-6">
              <p className="text-lg font-medium text-zinc-100">
                Este aplicativo não nasceu em uma sala de reunião. Não nasceu de investidores. Não nasceu para viciar pessoas.
              </p>
              <p>
                Ele nasceu de <strong>uma pessoa</strong>, de estudo, de observação e de inconformismo.
              </p>
              <p>
                Sou um desenvolvedor independente. Um programador só. Responsável por cada linha de código, cada atualização, cada decisão.
              </p>
              <div className="bg-blue-600/10 border-l-2 border-blue-600 p-6 rounded-r-3xl">
                 <p className="text-white font-bold italic">
                   "Aqui não existe algoritmo escondido. Não existe manipulação silenciosa. Não existe promessa vazia de alcance. Existe transparência."
                 </p>
              </div>
           </section>

           <section className="space-y-4">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">🌱 Por que este app existe</h2>
              <div className="space-y-4 text-zinc-400">
                 <p>Porque as redes sociais esqueceram que <strong>pessoas vêm antes de métricas</strong>.</p>
                 <p>Porque criadores passaram a trabalhar sem entender as regras do jogo.</p>
                 <p>Porque usuários viraram produto, não participantes.</p>
                 <p>O <em>Carlin Mídia Ofic</em> existe para ser uma <strong>alternativa consciente</strong>, não uma competição.</p>
              </div>
           </section>

           <section className="space-y-4">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">🧠 Como este app é construído</h2>
              <ul className="space-y-3">
                 <li className="flex gap-3 items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>Um desenvolvedor executa</li>
                 <li className="flex gap-3 items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>La comunidade participa</li>
                 <li className="flex gap-3 items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>O roadmap é público</li>
                 <li className="flex gap-3 items-center"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>O feedback é levado a sério</li>
              </ul>
              <p className="text-xs italic text-zinc-500 pt-2">
                Aqui, sugestões viram recursos. Erros são assumidos. Melhorias são explicadas.
              </p>
           </section>

           <section className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 space-y-4">
              <h2 className="text-lg font-black italic uppercase tracking-tighter text-red-500">⚖️ O que não aceitamos</h2>
              <ul className="space-y-3 text-xs font-bold uppercase tracking-tight text-zinc-400">
                 <li>• Cassino disfarçado de anúncio</li>
                 <li>• Golpes travestidos de oportunidade</li>
                 <li>• Algoritmos injustos</li>
                 <li>• Perfis falsos prosperando</li>
                 <li>• Falta de clareza com quem cria conteúdo</li>
              </ul>
           </section>

           <section className="space-y-4">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">🛡️ Nosso compromisso</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-blue-500 mb-2">Segurança</p>
                    <p className="text-xs leading-relaxed">Proteger a identidade dos criadores e manter o app seguro.</p>
                 </div>
                 <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-blue-500 mb-2">Crescimento</p>
                    <p className="text-xs leading-relaxed">Valorizar constância, não hype. Crescer sem perder valores.</p>
                 </div>
              </div>
              <p className="text-sm font-black italic text-center pt-4 text-white">
                "Este app não promete fama. Ele promete respeito."
              </p>
           </section>

           <section className="space-y-4">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">🌍 Visão de futuro</h2>
              <p>Não queremos ser a maior rede do mundo. Queremos ser a <strong>mais justa</strong>.</p>
              <p>Se um dia crescermos, cresceremos sem esquecer quem estava aqui no começo. Se um dia errarmos, vamos corrigir à vista de todos.</p>
           </section>

           <section className="pt-10 border-t border-zinc-900 space-y-8">
              <div className="text-center space-y-4">
                 <span className="text-3xl">🤝</span>
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Um convite</h2>
                 <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                   Se você busca pertencimento, clareza e construção real — seja bem-vindo. Este não é apenas um aplicativo. É um projeto vivo.
                 </p>
              </div>

              <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 text-center space-y-2">
                 <p className="text-xs font-black uppercase tracking-widest text-zinc-100">Desenvolvedor Solo do Carlin Mídia Ofic</p>
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 italic leading-relaxed">
                   Baseado em Marketing Digital Tecnológico.<br/>Sustentado por uma comunidade.
                 </p>
              </div>
           </section>
        </div>

        <div className="flex flex-col gap-4">
           <button 
             onClick={onBack}
             className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all"
           >
             Fazer Parte da Rede Justa
           </button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperManifesto;
