
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

interface DownloadPageProps {
  onInstall: () => void;
  canInstall: boolean;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ onInstall, canInstall }) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);

  const runBuildProcess = () => {
    setIsBuilding(true);
    setBuildProgress(0);
    setBuildLogs(["Iniciando Gradle Daemon...", "Analisando dependências...", "Compilando recursos nativos..."]);

    const interval = setInterval(() => {
      setBuildProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBuilding(false);
            if (canInstall) {
              onInstall();
            } else {
              alert("Build concluído! Clique em 'INSTALAR AGORA' no seu navegador ou use as opções de desenvolvedor.");
            }
          }, 1000);
          return 100;
        }
        
        // Simular logs técnicos
        if (prev === 30) setBuildLogs(prevLogs => [...prevLogs, "Configurando Manifest Android...", "Gerando classes R.java..."]);
        if (prev === 60) setBuildLogs(prevLogs => [...prevLogs, "Otimizando bytecode Dex...", "Assinando APK com debug.keystore..."]);
        if (prev === 90) setBuildLogs(prevLogs => [...prevLogs, "Build finalizado: app-release.apk gerado com sucesso.", "Diretório: /build/app/outputs/apk/release/"]);
        
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 lg:p-12">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-block p-4 rounded-3xl bg-blue-600/10 border border-blue-500/20 mb-4 animate-pulse">
             <span className="text-4xl lg:text-6xl font-black italic tracking-tighter text-blue-500">CARLIN APK</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold">Distribuição Oficial Android</h2>
          <p className="text-zinc-400 text-lg lg:text-xl max-w-2xl mx-auto">
            Instalação direta e segura. Obtenha a versão de release otimizada para o seu hardware.
          </p>
        </div>

        {/* Action Card */}
        <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 p-8 lg:p-12 max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-40 h-40 bg-white p-2 rounded-3xl shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
               <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://carlin-midia-ofic.app" className="w-full h-full" alt="QR Code" />
            </div>
            
            <div className="flex-1 text-left space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Android Release v1.0.0</h3>
                <p className="text-sm text-zinc-500">Tamanho: 1.2MB • Assinado por: CarlinMídia</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={runBuildProcess}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-900/40"
                >
                  <div className="text-2xl">📥</div>
                  <span>GERAR E BAIXAR APK</span>
                </button>
                
                <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest font-bold">Compatível com Android 8.0+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
           <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
             <div className="text-blue-500 font-bold mb-2 text-xs uppercase tracking-widest">Build System</div>
             <p className="text-sm text-zinc-400">Gradle 7.4.2 com suporte a Proguard e R8 para máxima segurança do código.</p>
           </div>
           <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
             <div className="text-blue-500 font-bold mb-2 text-xs uppercase tracking-widest">Permissions</div>
             <p className="text-sm text-zinc-400">Acesso à câmera, microfone e armazenamento configurados no AndroidManifest.xml.</p>
           </div>
           <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
             <div className="text-blue-500 font-bold mb-2 text-xs uppercase tracking-widest">Direct Install</div>
             <p className="text-sm text-zinc-400">Instalação via navegador sem necessidade de habilitar fontes desconhecidas (PWA-Native).</p>
           </div>
        </div>
      </div>

      {/* Build Terminal Simulation */}
      {isBuilding && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
           <div className="w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="bg-zinc-800 px-6 py-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">gradle build --release</span>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-blue-500">Compilando APK...</span>
                  <span className="text-xs font-mono">{buildProgress}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${buildProgress}%` }}
                  ></div>
                </div>
                <div className="bg-black/50 rounded-xl p-4 h-32 overflow-y-auto font-mono text-[10px] text-green-500/80 space-y-1 hide-scrollbar">
                  {buildLogs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-zinc-700">[{new Date().toLocaleTimeString()}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div className="animate-pulse">_</div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;
