
import React, { useState } from 'react';
import { Icons } from '../constants';

const DownloadPage: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (platform: string) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`O download para ${platform} começará em instantes no seu dispositivo!`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 lg:p-12">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-block p-3 rounded-2xl bg-blue-600/20 mb-4">
             <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter text-blue-500">CARLIN</h1>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold">Leve a Carlin Mídia Ofic para onde você for.</h2>
          <p className="text-zinc-400 text-lg lg:text-xl max-w-2xl mx-auto">
            Acesse seus Reels, Stories e mensagens em tempo real com o melhor desempenho. Disponível para todos os seus dispositivos.
          </p>
        </div>

        {/* Device Preview & Buttons */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 py-8">
          <div className="relative w-64 h-[500px] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden hidden md:block">
            <div className="absolute top-0 w-full h-6 bg-zinc-800 flex justify-center">
              <div className="w-20 h-4 bg-black rounded-b-xl"></div>
            </div>
            <img src="https://picsum.photos/seed/mobile/300/600" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-blue-500 font-black italic text-2xl">CARLIN</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-sm">
            <button 
              onClick={() => handleDownload('iOS')}
              className="flex items-center gap-4 bg-white text-black p-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 group"
            >
              <div className="text-3xl">🍎</div>
              <div className="text-left">
                <p className="text-xs font-bold opacity-60 uppercase">Baixar na</p>
                <p className="text-xl font-bold">App Store</p>
              </div>
            </button>

            <button 
              onClick={() => handleDownload('Android')}
              className="flex items-center gap-4 bg-zinc-800 text-white p-4 rounded-2xl hover:bg-zinc-700 transition-all active:scale-95"
            >
              <div className="text-3xl">🤖</div>
              <div className="text-left">
                <p className="text-xs font-bold opacity-60 uppercase">Disponível no</p>
                <p className="text-xl font-bold">Google Play</p>
              </div>
            </button>

            <div className="mt-4 p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 flex items-center gap-6">
               <div className="w-24 h-24 bg-white p-1 rounded-xl">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=carlin-midia-ofic" className="w-full h-full" alt="QR Code" />
               </div>
               <div className="text-left">
                 <p className="font-bold text-sm">Escaneie para baixar</p>
                 <p className="text-xs text-zinc-500">Aponte a câmera do seu celular para o código ao lado.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-zinc-900">
           <div className="p-6">
              <div className="text-blue-500 text-3xl mb-4">⚡</div>
              <h4 className="font-bold mb-2">Ultra Rápido</h4>
              <p className="text-sm text-zinc-500">Carregamento instantâneo de vídeos em 4K e fotos de alta resolução.</p>
           </div>
           <div className="p-6">
              <div className="text-blue-500 text-3xl mb-4">🔒</div>
              <h4 className="font-bold mb-2">Segurança Total</h4>
              <p className="text-sm text-zinc-500">Suas mensagens e dados protegidos com criptografia de ponta a ponta.</p>
           </div>
           <div className="p-6">
              <div className="text-blue-500 text-3xl mb-4">🎨</div>
              <h4 className="font-bold mb-2">Editor Nativo</h4>
              <p className="text-sm text-zinc-500">Filtros e ferramentas de edição exclusivas da versão mobile.</p>
           </div>
        </div>
      </div>

      {downloading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center">
           <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-bold text-xl">Preparando seu download...</p>
              <p className="text-sm text-zinc-500">Carlin Mídia Ofic v3.4.1 (APK/IPA)</p>
           </div>
        </div>
      )}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default DownloadPage;
