
import React, { useState } from 'react';
import { Icons } from '../constants';

interface DownloadPageProps {
  onInstall: () => void;
  canInstall: boolean;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ onInstall, canInstall }) => {
  const [downloading, setDownloading] = useState(false);

  const handleFakeDownload = (platform: string) => {
    if (platform === 'Android' && canInstall) {
      onInstall();
      return;
    }
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Para instalar no ${platform}: Siga as instruções de 'Adicionar à Tela de Início' no seu navegador.`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 lg:p-12">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-block p-3 rounded-2xl bg-blue-600/20 mb-4">
             <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter text-blue-500">CARLIN</h1>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold">Instale o App Original da Carlin Mídia.</h2>
          <p className="text-zinc-400 text-lg lg:text-xl max-w-2xl mx-auto">
            Gere a versão otimizada para o seu dispositivo agora. Sem anúncios de terceiros, 100% oficial.
          </p>
        </div>

        {/* Device Preview & Buttons */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 py-8">
          <div className="relative w-64 h-[500px] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden hidden md:block">
            <div className="absolute top-0 w-full h-6 bg-zinc-800 flex justify-center">
              <div className="w-20 h-4 bg-black rounded-b-xl"></div>
            </div>
            <img src="https://picsum.photos/seed/mobile_app/300/600" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
               <span className="text-blue-500 font-black italic text-2xl">CARLIN</span>
               <div className="w-12 h-1 bg-blue-500 animate-pulse"></div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-sm">
            <button 
              onClick={() => handleFakeDownload('Android')}
              className="flex items-center gap-4 bg-blue-600 text-white p-5 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-900/20"
            >
              <div className="text-3xl">🤖</div>
              <div className="text-left">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Baixar APK / Instalar</p>
                <p className="text-xl font-bold">Android (v3.4.1)</p>
              </div>
            </button>

            <button 
              onClick={() => handleFakeDownload('iOS')}
              className="flex items-center gap-4 bg-zinc-800 text-white p-5 rounded-2xl hover:bg-zinc-700 transition-all active:scale-95"
            >
              <div className="text-3xl">🍎</div>
              <div className="text-left">
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Versão Oficial</p>
                <p className="text-xl font-bold">iPhone / iPad</p>
              </div>
            </button>

            {/* Instruction for Android Build */}
            <div className="p-5 bg-zinc-900/80 rounded-3xl border border-zinc-800/50 text-left">
               <h4 className="font-bold text-sm text-blue-400 mb-2">Instruções para Instalação Manual:</h4>
               <ol className="text-xs text-zinc-400 space-y-2 list-decimal pl-4">
                 <li>Clique no botão azul acima "Baixar APK".</li>
                 <li>Confirme a instalação quando solicitado pelo navegador Chrome/Samsung.</li>
                 <li>Aguarde o ícone <strong>CARLIN</strong> aparecer na sua gaveta de aplicativos.</li>
                 <li>Habilite "Fontes Desconhecidas" se for solicitado (versão PWA nativa).</li>
               </ol>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-zinc-900 text-left">
           <div>
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Versão</p>
              <p className="text-sm font-medium">3.4.1-release</p>
           </div>
           <div>
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Tamanho</p>
              <p className="text-sm font-medium">1.2 MB (Otimizado)</p>
           </div>
           <div>
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Plataforma</p>
              <p className="text-sm font-medium">Android / iOS / Web</p>
           </div>
           <div>
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Segurança</p>
              <p className="text-sm font-medium">SSL / Biometria</p>
           </div>
        </div>
      </div>

      {downloading && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center">
           <div className="bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 text-center space-y-6 max-w-xs w-full shadow-2xl">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full mx-auto"></div>
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 -ml-10"></div>
              </div>
              <div className="space-y-2">
                <p className="font-black text-2xl tracking-tight">Construindo App...</p>
                <p className="text-sm text-zinc-500">Otimizando APK para o seu processador.</p>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
           </div>
        </div>
      )}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default DownloadPage;
