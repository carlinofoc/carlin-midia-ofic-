
import React, { useState, useEffect } from "react";

const CarlinLabBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('carlin_lab_banner_dismissed');
    if (dismissed !== 'true') {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('carlin_lab_banner_dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="bg-[#0F172A] p-6 rounded-2xl border border-zinc-800/50 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 mb-4 w-full">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
        <h2 className="text-[#38BDF8] text-lg font-bold uppercase leading-tight tracking-tight">
          🧪 CARLIN LAB • SEGURANÇA & COMUNIDADE
        </h2>

        <p className="text-[#E5E7EB] text-sm leading-relaxed">
          Bem-vindo ao <span className="font-bold text-white">Carlin Ofic</span>, uma rede social
          criada por <span className="font-bold text-white">um único desenvolvedor independente</span>,
          com foco em segurança real, antifraude e crescimento justo.
        </p>

        <section className="space-y-2">
          <h3 className="text-[#FACC15] text-[15px] font-semibold flex items-center gap-2">
            <span>🔒</span> Segurança de ponta
          </h3>
          <ul className="space-y-1 ml-2">
            <li className="text-[#CBD5F5] text-sm flex items-start gap-2">
              <span className="text-[#CBD5F5]">•</span> 
              <span>Proteção contra golpes, fakes e clonagens</span>
            </li>
            <li className="text-[#CBD5F5] text-sm flex items-start gap-2">
              <span className="text-[#CBD5F5]">•</span> 
              <span>Dados e conteúdos protegidos</span>
            </li>
            <li className="text-[#CBD5F5] text-sm flex items-start gap-2">
              <span className="text-[#CBD5F5]">•</span> 
              <span>Sistema antifraude ativo</span>
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-[#FACC15] text-[15px] font-semibold flex items-center gap-2">
            <span>✔</span> Perfil verificado
          </h3>
          <p className="text-[#E5E7EB] text-sm ml-2 leading-relaxed">
            Para obter o selo de verificado, é necessário confirmar identidade com
            <span className="font-bold text-white"> foto real + verificação facial (Face ID)</span>.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-[#FACC15] text-[15px] font-semibold flex items-center gap-2">
            <span>🧪</span> O que é o Carlin Lab?
          </h3>
          <ul className="space-y-1 ml-2">
            <li className="text-[#CBD5F5] text-sm flex items-start gap-2">
              <span className="text-[#CBD5F5]">•</span> 
              <span>Acesso antecipado às versões beta</span>
            </li>
            <li className="text-[#CBD5F5] text-sm flex items-start gap-2">
              <span className="text-[#CBD5F5]">•</span> 
              <span>Ajuda na correção de bugs</span>
            </li>
            <li className="text-[#CBD5F5] text-sm flex items-start gap-2">
              <span className="text-[#CBD5F5]">•</span> 
              <span>Votação em atualizações e diretrizes</span>
            </li>
            <li className="text-[#CBD5F5] text-sm flex items-start gap-2">
              <span className="text-[#CBD5F5]">•</span> 
              <span>Formulários podem ser compartilhados com seguidores</span>
            </li>
          </ul>
        </section>

        <div className="pt-2">
          <p className="text-[#94A3B8] text-[12px] italic">
            O APK beta é exclusivo para assinantes e uso privado.
          </p>
        </div>

        <section className="pt-2">
          <h3 className="text-[#FACC15] text-[15px] font-semibold mb-1">
            <span>👤</span> Desenvolvedor
          </h3>
          <p className="text-[#E5E7EB] text-sm ml-2">
            Criado por <span className="font-bold text-white">Carlin Ofic</span> — Desenvolvedor
            independente e Tecnólogo em Marketing Digital (UNOPAR).
          </p>
        </section>

        <button
          onClick={handleClose}
          className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#020617] font-bold text-sm py-3 px-4 rounded-lg mt-4 active:scale-[0.98] transition-all"
        >
          Entendi e continuar
        </button>
      </div>
    </div>
  );
};

export default CarlinLabBanner;
