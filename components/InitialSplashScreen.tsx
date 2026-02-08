
import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../constants';

interface InitialSplashScreenProps {
  onReady: () => void;
}

const InitialSplashScreen: React.FC<InitialSplashScreenProps> = ({ onReady }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Iniciando Bridge...');

  useEffect(() => {
    const steps = [
      { p: 15, t: 'Verificando Identidade...' },
      { p: 40, t: 'Abrindo Cofre Seguro...' },
      { p: 75, t: 'Sincronizando Algoritmo...' },
      { p: 100, t: 'Ecossistema Pronto' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].t);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onReady, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onReady]);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-10 animate-in fade-in duration-500">
      {/* Logo com efeito Heartbeat */}
      <div className="mb-16 animate-pulse">
        <BrandLogo size="lg" />
      </div>

      <div className="w-full max-w-xs space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-[9px] font-black uppercase text-blue-500 tracking-[0.3em] animate-pulse">
            {statusText}
          </p>
          
          {/* Barra de progresso técnica Carlin Style */}
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-0.5">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-center gap-1 opacity-20">
           {[...Array(5)].map((_, i) => (
             <div key={i} className={`w-1 h-1 rounded-full bg-white ${progress > (i * 20) ? 'opacity-100' : 'opacity-20'}`}></div>
           ))}
        </div>
      </div>

      <div className="absolute bottom-12 text-center">
        <p className="text-[7px] font-black text-zinc-700 uppercase tracking-[0.4em]">
          Carlin Native App v3.6.0 • Production Environment
        </p>
      </div>
    </div>
  );
};

export default InitialSplashScreen;
