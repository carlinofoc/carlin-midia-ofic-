
import React, { useState, useEffect } from "react";

const CarlinLabBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('carlin_lab_banner_dismissed');
    if (dismissed !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('carlin_lab_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#0F172A] p-6 rounded-[2rem] my-6 border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="space-y-4">
        <h2 className="text-[#38BDF8] text-lg font-black italic tracking-tighter uppercase leading-tight">
          🧪 CARLIN LAB • SEGURANÇA & COMUNIDADE
        </h2>

        <p className="text-zinc-300 text-sm leading-relaxed">
          Bem-vindo ao <span className="font-black text-white">Carlin Ofic</span>, uma rede social
          criada por <span className="font-black text-white">um único desenvolvedor independente</span>,
          com foco em segurança real, antifraude e crescimento justo.
        </p>

        <section>
          <h3 className="text-[#FACC15] text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <span>🔒</span> Segurança de ponta
          </h3>
          <ul className="space-y-1.5 ml-1">
            <li className="text-zinc-400 text-[11px] flex items-center gap-2">
              <span className="w-1 h-1 bg-[#38BDF8] rounded-full shrink-0"></span> 
              <span>Proteção contra golpes, fakes e clonagens</span>
            </li>
            <li className="text-zinc-400 text-[11px] flex items-center gap-2">
              <span className="w-1 h-1 bg-[#38BDF8] rounded-full shrink-0"></span> 
              <span>Dados e conteúdos protegidos</span>
            </li>
            <li className="text-zinc-400 text-[11px] flex items-center gap-2">
              <span className="w-1 h-1 bg-[#38BDF8] rounded-full shrink-0"></span> 
              <span>Sistema antifraude ativo</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-[#FACC15] text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <span>✔</span> Perfil verificado
          </h3>
          <p className="text-zinc-400 text-[11px] ml-1">
            Para obter o selo de verificado, é necessário confirmar identidade com
            <span className="font-bold text-white"> foto real + verificação facial (Face ID)</span>.
          </p>
        </section>

        <section>
          <h3 className="text-[#FACC15] text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
            <span>🧪</span> O que é o Carlin Lab?
          </h3>
          <ul className="space-y-1.5 ml-1">
            <li className="text-zinc-400 text-[11px] flex items-center gap-2">
              <span className="w-1 h-1 bg-[#FACC15] rounded-full shrink-0"></span> 
              <span>Acesso antecipado às versões beta</span>
            </li>
            <li className="text-zinc-400 text-[11px] flex items-center gap-2">
              <span className="w-1 h-1 bg-[#FACC15] rounded-full shrink-0"></span> 
              <span>Ajuda na correção de bugs</span>
            </li>
            <li className="text-zinc-400 text-[11px] flex items-center gap-2">
              <span className="w-1 h-1 bg-[#FACC15] rounded-full shrink-0"></span> 
              <span>Votação em atualizações e diretrizes</span>
            </li>
            <li className="text-zinc-400 text-[11px] flex items-center gap-2">
              <span className="w-1 h-1 bg-[#FACC15] rounded-full shrink-0"></span> 
              <span>Formulários podem ser compartilhados com seguidores</span>
            </li>
          </ul>
        </section>

        <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider italic bg-black/20 p-2 rounded-lg">
          O APK beta é exclusivo para assinantes e uso privado.
        </p>

        <section className="pt-3 border-t border-zinc-800 mt-2">
          <h3 className="text-[#FACC15] text-[10px] font-black uppercase tracking-widest mb-1">👤 Desenvolvedor</h3>
          <p className="text-zinc-400 text-[11px]">
            Criado por <span className="font-bold text-white uppercase tracking-tight">Carlin Ofic</span> — Desenvolvedor
            independente e Tecnólogo em Marketing Digital (<span className="text-zinc-200">UNOPAR</span>).
          </p>
        </section>

        <button
          onClick={handleDismiss}
          className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] p-4 rounded-2xl mt-6 flex justify-center items-center active:scale-95 transition-all shadow-xl shadow-[#38BDF8]/10"
        >
          <span className="text-[#020617] font-black uppercase text-[11px] tracking-widest">
            Entendi e continuar
          </span>
        </button>
      </div>
    </div>
  );
};

export default CarlinLabBanner;
