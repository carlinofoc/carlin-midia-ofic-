import React, { useState, useRef, useEffect } from 'react';
import { hashFacialVector } from '../services/cryptoService';
import { dbService, SecurityStatus } from '../services/dbService';
import { consentService } from '../services/consentService';
import { facialVerificationManager } from '../services/facialVerificationService';
import { antiFakeEngine } from '../services/antiFakeEngine';
import { VerificationLevel, UserAccount } from '../types';

interface VerificationProcessProps {
  user: { id: string };
  onComplete: (data: { hash: string, level: VerificationLevel }) => void;
  onCancel: () => void;
  onOpenPolicy: () => void;
  externalData?: UserAccount;
}

const VerificationProcess: React.FC<VerificationProcessProps> = ({ user, onComplete, onCancel, onOpenPolicy, externalData }) => {
  const [step, setStep] = useState<'consentimento' | 'requisitos' | 'selfie' | 'envio_seguro' | 'status' | 'alerta'>('consentimento');
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>('OK');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [achievedLevel, setAchievedLevel] = useState<VerificationLevel>(VerificationLevel.BRONZE);
  const [progressMsg, setProgressMsg] = useState('');
  const [isConsentAccepted, setIsConsentAccepted] = useState(externalData?.consentAccepted || false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const assignLevel = (selfieVerified: boolean, documentDetected: boolean): VerificationLevel => {
    addLog("[ENGINE] Auditoria de hardware concluída.");
    if (selfieVerified && documentDetected) return VerificationLevel.OURO;
    if (selfieVerified) return VerificationLevel.PRATA;
    return VerificationLevel.BRONZE;
  };

  const handleStartRequisitos = () => {
    try {
      consentService.validate(isConsentAccepted);
      setStep('requisitos');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    try {
      // Para o stream anterior se existir
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      consentService.validate(isConsentAccepted);
      const media = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: mode,
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        }, 
        audio: false 
      });
      setStream(media);
      if (videoRef.current) videoRef.current.srcObject = media;
      setStep('selfie');
      setIsScanning(true);
    } catch (err: any) {
      console.error(err);
      alert("Falha ao inicializar sensores biométricos.");
    }
  };

  const toggleCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const takeSelfie = () => {
    setIsScanning(false);
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Se for a câmera frontal, precisamos espelhar o canvas para salvar corretamente
      if (facingMode === 'user') {
        ctx?.translate(canvas.width, 0);
        ctx?.scale(-1, 1);
      }
      
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      const byteString = atob(dataUrl.split(',')[1]);
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

      handleUploadFlow(ia);
    }
  };

  const handleUploadFlow = async (imageBytes: Uint8Array) => {
    setStep('envio_seguro');
    setLogs([]);
    setProgressMsg('Processando biometria...');
    
    const serverResponse = await facialVerificationManager.sendSelfie(imageBytes);
    
    if (!serverResponse.success || !serverResponse.livenessConfirmed) {
      setSecurityStatus('FAKE_PROFILE');
      setStep('alerta');
      return;
    }

    addLog(`[SERVER] Sincronizado. TX: ${serverResponse.txId}`);
    
    const encryptedVector = await hashFacialVector(serverResponse.facialVector);
    const duplicateCheck = await dbService.verificarDuplicata(encryptedVector);
    
    if (duplicateCheck.status !== 'OK') {
      setSecurityStatus(duplicateCheck.status);
      setStep('alerta');
      return;
    }

    setAchievedLevel(assignLevel(serverResponse.livenessConfirmed, serverResponse.documentDetected));
    setStep('status');
  };

  return (
    <div className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center animate-in fade-in overflow-hidden">
      <style>
        {`
          @keyframes scanline {
            0% { top: 20%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 80%; opacity: 0; }
          }
          .animate-scan {
            animation: scanline 3s ease-in-out infinite;
          }
          .face-mask {
            clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 50% 20%, 80% 35%, 85% 55%, 80% 75%, 50% 85%, 20% 75%, 15% 55%, 20% 35%, 50% 20%);
          }
        `}
      </style>

      <div className="max-w-md w-full h-full flex flex-col relative">
        
        {step === 'consentimento' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-10">
            <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 shadow-2xl">
               <span className="text-4xl">🛡️</span>
            </div>
            <div className="space-y-2">
               <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Face ID Carlin</h2>
               <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">Segurança v5.9</p>
            </div>
            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 text-left space-y-5 backdrop-blur-xl">
               <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Para garantir que você é uma pessoa real e proteger sua identidade, solicitamos acesso à sua biometria facial ou registro de objeto de segurança.
               </p>
               <label className="flex items-center gap-4 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-zinc-800 bg-black text-blue-500" checked={isConsentAccepted} onChange={(e) => setIsConsentAccepted(e.target.checked)} />
                  <span className="text-[10px] uppercase font-black tracking-widest text-zinc-300 group-hover:text-white transition-colors">Aceito os termos biométricos</span>
               </label>
            </div>
            <button onClick={handleStartRequisitos} disabled={!isConsentAccepted} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest disabled:opacity-20 shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Começar</button>
          </div>
        )}

        {step === 'requisitos' && (
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
              <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Preparar Captura</h2>
              <div className="grid gap-3 w-full">
                 <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] text-left flex gap-5 items-center">
                    <span className="text-3xl">👤</span>
                    <div>
                       <p className="text-xs font-black text-white uppercase tracking-widest">Enquadramento</p>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase">Centralize o rosto ou o objeto.</p>
                    </div>
                 </div>
                 <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] text-left flex gap-5 items-center">
                    <span className="text-3xl">📸</span>
                    <div>
                       <p className="text-xs font-black text-white uppercase tracking-widest">Alternar Lente</p>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase">Você poderá girar a câmera na prévia.</p>
                    </div>
                 </div>
              </div>
              <button onClick={() => startCamera('user')} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl active:scale-95 transition-all">Abrir Câmera</button>
              <button onClick={onCancel} className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Cancelar</button>
           </div>
        )}

        {step === 'selfie' && (
          <div className="relative w-full h-full bg-black">
             {/* Preview Camera - Only mirror for front camera */}
             <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`} 
             />
             
             {/* Face Overlay Mask */}
             <div className="absolute inset-0 bg-black/60 face-mask pointer-events-none"></div>
             
             {/* Scan Animation */}
             {isScanning && (
               <div className="absolute left-[15%] right-[15%] w-[70%] h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan z-20"></div>
             )}

             {/* UI Controls */}
             <div className="absolute inset-0 flex flex-col justify-between p-10 z-30">
                <div className="flex justify-between items-start mt-10">
                   <div className="text-left space-y-1">
                      <h3 className="text-white font-black uppercase tracking-widest text-sm drop-shadow-lg">
                        {facingMode === 'user' ? 'Face ID Ativo' : 'Scanner Objeto'}
                      </h3>
                      <p className="text-zinc-300 font-bold uppercase text-[9px] tracking-[0.2em] opacity-80">Posicione no centro</p>
                   </div>
                   
                   {/* Toggle Camera Button */}
                   <button 
                    onClick={toggleCamera}
                    className="w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all shadow-xl"
                   >
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                     </svg>
                   </button>
                </div>

                <div className="flex flex-col items-center gap-8 mb-10">
                   <div className="flex gap-4">
                      <div className={`w-2 h-2 rounded-full ${facingMode === 'user' ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`}></div>
                      <div className={`w-2 h-2 rounded-full ${facingMode === 'user' ? 'bg-blue-500/40' : 'bg-green-500/40'} animate-pulse delay-75`}></div>
                      <div className={`w-2 h-2 rounded-full ${facingMode === 'user' ? 'bg-blue-500/20' : 'bg-green-500/20'} animate-pulse delay-150`}></div>
                   </div>
                   
                   <button 
                     onClick={takeSelfie} 
                     className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-90 transition-all shadow-2xl"
                   >
                      <div className="w-16 h-16 bg-white rounded-full border-4 border-black group-hover:scale-95 transition-all"></div>
                   </button>
                </div>
             </div>

             {/* Sensor Stats */}
             <div className="absolute top-10 left-10 right-10 flex justify-between pointer-events-none">
                <div className="flex flex-col">
                   <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">Bio-Scanner</span>
                   <span className="text-[9px] font-mono text-white/50">{facingMode === 'user' ? 'FRONT_CAM' : 'REAR_CAM'}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">Sensor</span>
                   <span className="text-[9px] font-mono text-white/50">LENS_READY</span>
                </div>
             </div>
          </div>
        )}

        {step === 'envio_seguro' && (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
             <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="absolute inset-0 flex items-center justify-center text-2xl">🔐</span>
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">{progressMsg}</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Criptografando dados biométricos...</p>
             </div>
             <div className="w-full bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 text-left font-mono text-[8px] space-y-1 max-h-40 overflow-hidden">
                {logs.map((l, i) => <p key={i} className="text-blue-500/80">> {l}</p>)}
             </div>
          </div>
        )}

        {step === 'status' && (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-10 animate-in zoom-in-95 duration-500">
             <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)] ${achievedLevel === VerificationLevel.OURO ? 'bg-yellow-500' : 'bg-blue-600'}`}>
                <span className="text-5xl">{achievedLevel === VerificationLevel.OURO ? '🥇' : '🥈'}</span>
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">Verificado</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Nível {achievedLevel} Ativado</p>
             </div>
             <button onClick={() => onComplete({ hash: 'sealed_vector', level: achievedLevel })} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl active:scale-95 transition-all">Finalizar Configuração</button>
          </div>
        )}

        {step === 'alerta' && (
           <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8 animate-in slide-in-from-bottom-4">
              <div className="w-24 h-24 bg-red-600/10 rounded-[2.5rem] flex items-center justify-center border border-red-500/20 shadow-2xl">
                 <span className="text-5xl">🚨</span>
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black uppercase text-red-500 tracking-tighter">Erro de Identidade</h2>
                 <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                   {securityStatus === 'SIMILARITY_DETECTED' 
                     ? antiFakeEngine.alertMessage() 
                     : securityStatus === 'FAKE_PROFILE' 
                     ? 'Falha na prova de vida ou validação de objeto. Certifique-se do alinhamento correto.' 
                     : 'Esta biometria já foi selada em outro cofre.'}
                 </p>
              </div>
              <div className="flex flex-col w-full gap-3">
                <button onClick={() => startCamera('user')} className="w-full bg-zinc-100 text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Tentar Novamente</button>
                <button onClick={onCancel} className="w-full text-zinc-600 font-black uppercase text-[9px] tracking-widest py-2">Voltar ao Início</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default VerificationProcess;