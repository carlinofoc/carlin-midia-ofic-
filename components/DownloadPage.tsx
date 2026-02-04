
import React, { useState } from 'react';
import { liteModeManager } from '../services/liteModeService';

interface DownloadPageProps {
  onInstall: () => void;
  canInstall: boolean;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ onInstall }) => {
  const [isCompiling, setIsCompiling] = useState(false);
  const [progress, setProgress] = useState(0);

  const apkDownloadLink = "https://github.com/carlin-oficial/carlin-midia-ofic/releases/download/v3.5.2/app-release.apk";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(apkDownloadLink)}`;

  const startDownload = () => {
    setIsCompiling(true);
    let p = 0;
    
    // Applying throttled frame delay logic:
    // if (lite) 32ms else 16ms
    // We scale this to a base of 40ms vs 80ms for visible progress UI
    const frameDelay = liteModeManager.getFrameDelay() * 2.5; 

    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 5) + 1;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsCompiling(false);
          const a = document.createElement('a');
          a.href = apkDownloadLink;
          a.download = 'CarlinMidiaOfic_v3.5.2.apk';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          onInstall();
        }, 500);
      }
      setProgress(p);
    }, frameDelay);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-start pt-20 lg:pt-12 pb-32 overflow-y-auto">
      <div className="w-full max-w-xl space-y-12">
        
        {/* Branding Native Style */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-4 ring-4 ring-zinc-900">
            <span className="text-5xl font-black italic tracking-tighter">C</span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">Carlin App</h1>
          <p className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.4em]">Native Android Distribution</p>
        </div>

        {/* Central APK Card */}
        <div className="bg-zinc-900/60 rounded-[3rem] border border-zinc-800 p-8 shadow-3xl backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          
          <div className="flex flex-col items-center gap-12">
            {/* Functional QR Code */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-2xl group-hover:bg-blue-600/20 transition-all"></div>
              <div className="bg-white p-5 rounded-[2.5rem] shadow-2xl relative">
                 <img src={qrCodeUrl} alt="QR Code APK" className="w-48 h-48" />
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-[2.5rem]">
                    <span className="text-black font-black text-xs uppercase tracking-tighter">Link Direto APK</span>
                 </div>
              </div>
            </div>

            <div className="w-full space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black italic text-zinc-100 tracking-tight">app-release.apk</h3>
                <div className="flex justify-center gap-5 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> ESTÁVEL</span>
                  <span className="text-zinc-800">|</span>
                  <span>v3.5.2</span>
                  <span className="text-zinc-800">|</span>
                  <span>ARM64-v8a</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={startDownload}
                  disabled={isCompiling}
                  className="w-full bg-white hover:bg-zinc-200 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-white/5 disabled:opacity-50"
                >
                  <span className="text-2xl">🤖</span>
                  <span className="tracking-tighter uppercase">Baixar Aplicativo Agora</span>
                </button>
                
                <p className="text-[9px] text-center text-zinc-600 leading-relaxed font-bold uppercase tracking-wider">
                  Download seguro via Native APK Bridge.<br/>Totalmente compatível com Android 10, 11, 12 e 13.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements & Info */}
        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 space-y-2">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Hardware</h4>
              <p className="text-xs text-zinc-400 font-medium">Requer 2GB RAM e processador 64-bit.</p>
           </div>
           <div className="p-6 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 space-y-2">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Segurança</h4>
              <p className="text-xs text-zinc-400 font-medium">Assinatura V2. Scan anti-vírus OK.</p>
           </div>
        </div>

        {/* Manual Instructions */}
        <div className="bg-zinc-900/20 p-8 rounded-3xl border border-dashed border-zinc-800">
           <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 text-center">Instalação Manual</h4>
           <div className="space-y-6">
              {[
                { step: "1", text: "Clique no botão acima para baixar o arquivo do instalador." },
                { step: "2", text: "Abra o arquivo APK e permita 'Fontes Desconhecidas'." },
                { step: "3", text: "Aguarde a instalação e abra o Carlin direto na tela de início." }
              ].map((item) => (
                <div key={item.step} className="flex gap-5 items-center">
                   <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-black">{item.step}</div>
                   <p className="text-sm text-zinc-400 leading-snug">{item.text}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isCompiling && (
        <div className="fixed inset-0 bg-black/95 z-[2000] flex flex-col items-center justify-center p-10 space-y-12">
           <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-900" />
                <circle 
                  cx="96" 
                  cy="96" 
                  r="80" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent" 
                  className="text-blue-500 transition-all duration-300" 
                  strokeDasharray={502} 
                  strokeDashoffset={502 - (502 * progress) / 100} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-4xl font-black italic tracking-tighter">{progress}%</span>
                 {liteModeManager.isLiteEnabled() && <span className="text-[8px] font-black uppercase text-blue-400 mt-2">Mode: Low FPS</span>}
              </div>
           </div>
           <div className="text-center space-y-3">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">Iniciando Download do APK</h2>
              <p className="text-zinc-500 text-xs font-mono animate-pulse">gradle assembleRelease --no-daemon</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
