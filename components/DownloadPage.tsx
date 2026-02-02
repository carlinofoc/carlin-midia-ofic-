
import React from 'react';

interface DownloadPageProps {
  onInstall: () => void;
  canInstall: boolean;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ onInstall }) => {
  // Em um ambiente de produção real, este link apontaria para o arquivo gerado pelo build (CI/CD)
  // Exemplo: https://seu-dominio.com/downloads/carlin-release.apk
  const apkDownloadLink = window.location.origin + '/downloads/app-release.apk';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(apkDownloadLink)}`;

  const handleDownload = () => {
    // Tenta baixar o arquivo diretamente
    const link = document.createElement('a');
    link.href = apkDownloadLink;
    link.download = 'carlin-midia-ofic.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostra um feedback visual de que o download começou
    onInstall();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center lg:pb-24">
      <div className="max-w-xl w-full space-y-12">
        {/* Top Branding */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-6">
            <span className="text-4xl font-black italic tracking-tighter">C</span>
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter text-blue-500 uppercase">Carlin Mídia Ofic</h1>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">VERSÃO NATIVA PARA ANDROID</p>
        </div>

        {/* Main Action Card */}
        <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 p-8 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* QR Code Section */}
            <div className="bg-white p-3 rounded-2xl shadow-lg shrink-0">
              <img src={qrCodeUrl} alt="QR Code para Download" className="w-32 h-32" />
              <p className="text-[8px] text-black font-bold text-center mt-2 uppercase">Escanear para baixar</p>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-xl font-bold">Instalador Oficial (.APK)</h3>
                <p className="text-xs text-zinc-500">Versão: 3.5.2-stable • Tamanho: 1.4 MB</p>
              </div>
              
              <button 
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/30"
              >
                <span className="text-xl">📥</span>
                <span>BAIXAR APLICATIVO (APK)</span>
              </button>
            </div>
          </div>

          {/* User Instructions */}
          <div className="pt-6 border-t border-zinc-800 space-y-4">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Como Instalar no Celular:</h4>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                <p className="text-xs text-zinc-400">Clique no botão azul ou escaneie o QR Code.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <p className="text-xs text-zinc-400">Abra o arquivo <span className="text-blue-500 font-bold">.apk</span> baixado em sua pasta de Downloads.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <p className="text-xs text-zinc-400">Se o Android perguntar, permita a instalação de <span className="text-white font-bold">Fontes Desconhecidas</span>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex justify-center gap-8 opacity-40 grayscale">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">🛡️</div>
            <span className="text-[8px] font-bold uppercase">Seguro</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">🚀</div>
            <span className="text-[8px] font-bold uppercase">Rápido</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">✅</div>
            <span className="text-[8px] font-bold uppercase">Verificado</span>
          </div>
        </div>
      </div>
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default DownloadPage;
