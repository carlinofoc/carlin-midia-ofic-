
import React from 'react';

interface SuspiciousAlertProps {
  riskLevel: 'low' | 'medium' | 'high';
}

const SuspiciousAlert: React.FC<SuspiciousAlertProps> = ({ riskLevel }) => {
  const styles = {
    high: "bg-red-500/10 border-red-500/30 text-red-500",
    medium: "bg-orange-500/10 border-orange-500/30 text-orange-500",
    low: "bg-zinc-800 border-zinc-700 text-zinc-400"
  };

  const messages = {
    high: "Risco de Fraude Detectado",
    medium: "Perfil com Identidade Incerta",
    low: "Atividade Atípica"
  };

  const detailed = {
    high: "Este perfil possui características idênticas a um criador verificado. Proceda com cautela extrema.",
    medium: "Os dados deste perfil divergem dos padrões de um criador real verificado.",
    low: "Este perfil está sob análise de nossa IA de segurança v4.1."
  };

  return (
    <div className={`p-4 rounded-2xl border mb-4 animate-in fade-in duration-500 ${styles[riskLevel]}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <div className="flex-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">
            {messages[riskLevel]}
          </h4>
          <p className="text-[9px] font-medium leading-snug">
            {detailed[riskLevel]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuspiciousAlert;
