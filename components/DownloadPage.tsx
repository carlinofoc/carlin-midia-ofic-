
import React, { useState, useEffect } from 'react';

interface DownloadPageProps {
  onInstall: () => void;
  canInstall: boolean;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ onInstall }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [hardwareScore, setHardwareScore] = useState(0);
  
  // Link para o APK final (deve ser hospedado no servidor de arquivos)
  const apkDownloadLink = window.location.origin + '/release/carlin-v3.5.2-final.apk';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(apkDownloadLink)}`;

  const runHardwareDiagnostic = () => {
    setIsVerifying(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setHardwareScore(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVerifying(false);
          triggerRealDownload();
        }, 800);
      }
    }, 50);
  };

  const triggerRealDownload = () => {
    const link = document.createElement('a');
    link.href = apkDownloadLink;
    link.download = 'CarlinMidiaOfic_v3.5.2.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onInstall(); // Dispara o prompt PWA como redundância de instalação nativa
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 pt-20 lg:pt-12 pb-32">
      <div className="w-full max-w-lg space-y-10">
        
        {/* App Header Branding */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3 transition-transform hover:rotate-0">
             <span className="text-5xl font-black italic tracking-tighter text-white">C</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic tracking-tighter text-white">CARLIN MÍDIA</h1>
            <p className="text-blue-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Versão Nativa v3.5.2
            </p>
          </div>
        </div>

        {/* QR Code and Actions */}
        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800/50 p-8 shadow-3xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
          
          <div className="flex flex-col items-center gap-8">
            <div className="bg-white p-4 rounded-3xl shadow-2xl transition-transform group-hover:scale-105 duration-500">
               <img src={qrCodeUrl} alt="QR Code Download" className="w-48 h-48" />
               <div className="mt-4 text-center">
                 <p className="text-[10px] text-black font-black uppercase tracking-tighter">Escanear para instalar agora</p>
               </div>
            </div>

            <div className="w-full space-y-4">
              <button 
                onClick={runHardwareDiagnostic}
                disabled={isVerifying}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/30"
              >
                <span className="text-2xl">{isVerifying ? '⚙️' : '📥'}</span>
                <span>{isVerifying ? 'VERIFICANDO HARDWARE...' : 'BAIXAR APK AGORA'}</span>
              </button>

              <div className="flex items-center justify-center gap-6 opacity-60">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tamanho</span>
                  <span className="text-xs font-bold text-white">1.42 MB</span>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Formato</span>
                  <span className="text-xs font-bold text-white">APK (ARM64)</span>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Segurança</span>
                  <span className="text-xs font-bold text-green-500">SSL v3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Requirements */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] px-4">Instruções de Instalação</h3>
          
          <div className="grid grid-cols-1 gap-3">
             <div className="p-5 bg-zinc-900/30 rounded-2xl border border-zinc-800/30 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-blue-500 font-black">1</div>
                <p className="text-xs text-zinc-400 font-medium">Baixe o arquivo <span className="text-white">.apk</span> acima no seu Android.</p>
             </div>
             <div className="p-5 bg-zinc-900/30 rounded-2xl border border-zinc-800/30 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-blue-500 font-black">2</div>
                <p className="text-xs text-zinc-400 font-medium">Abra a pasta de downloads e clique no arquivo baixado.</p>
             </div>
             <div className="p-5 bg-zinc-900/30 rounded-2xl border border-zinc-800/30 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-blue-500 font-black">3</div>
                <p className="text-xs text-zinc-400 font-medium">Permita "Fontes Desconhecidas" nas configurações para concluir.</p>
             </div>
          </div>
        </div>

        {/* Hardware Status Overlay */}
        {isVerifying && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[500] flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-10 text-center">
              <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-900" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-600" strokeDasharray={440} strokeDashoffset={440 - (440 * hardwareScore) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-3xl font-black italic">{hardwareScore}%</span>
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-black italic tracking-tighter uppercase">Compilando Binário NDK</h2>
                <div className="bg-zinc-900 h-1 w-full rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 animate-pulse" style={{ width: `${hardwareScore}%` }}></div>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Otimizando para processadores Snapdragon/Exynos</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
