import React, { useState, useEffect } from 'react';
import { LivePointsStatus } from '../services/impactService';

interface DonatePointsButtonProps {
  status: LivePointsStatus | null;
  isDonating: boolean;
  onDonate: () => Promise<void>;
}

const DonatePointsButton: React.FC<DonatePointsButtonProps> = ({ status, isDonating, onDonate }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const canDonate = status?.canDonate && !isDonating && !status?.isBoostCapped;

  const handleClick = async () => {
    if (!canDonate) return;
    
    await onDonate(); // This now opens the picker in LiveSession
  };

  return (
    <div className="relative">
      {/* Feedback Message Overlay */}
      {showFeedback && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-purple-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full animate-bounce shadow-lg shadow-purple-500/40 z-20">
          Impulso Sincronizado!
        </div>
      )}

      {/* Particle Explosion simulation */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2 w-1 h-1 bg-purple-400 rounded-full pointer-events-none z-10"
          style={{
            transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
            opacity: 0,
            animation: 'particle-out 0.8s ease-out forwards'
          }}
        />
      ))}

      <style>
        {`
          @keyframes particle-out {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(calc(-50% + var(--tw-translate-x)), calc(-50% + var(--tw-translate-y))) scale(0.5); }
          }
        `}
      </style>

      <button
        onClick={handleClick}
        disabled={!canDonate}
        className={`group relative overflow-hidden py-3 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-2xl ${
          canDonate 
            ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-purple-900/40 hover:brightness-110' 
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
        }`}
      >
        {/* Glow effect on hover */}
        {canDonate && (
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        )}

        {isDonating ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <span className="text-sm">⚡</span>
        )}

        <span>
          {canDonate ? 'Impulsionar' : 'Indisponível'}
        </span>

        {/* Status Hint */}
        {!canDonate && !isDonating && status && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-[7px] text-white">
                {status.pointsAvailable < 300 ? 'Saldo insuficiente' : status.isBoostCapped ? 'Cap atingido' : 'Aguarde ciclo'}
              </span>
           </div>
        )}
      </button>
    </div>
  );
};

export default DonatePointsButton;