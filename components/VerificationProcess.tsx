
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

  const startCamera = async () => {
    try {
      consentService.validate(isConsentAccepted);
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      setStream(media);
      if (videoRef.current) videoRef.current.srcObject = media;
      setStep('selfie');
    } catch (err: any) {
      alert("Falha ao inicializar sensores biométricos.");
    }
  };

  const takeSelfie = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      // Converte para ByteArray (Uint8Array) para simular o comportamento nativo
      const byteString = atob(dataUrl.split(',')[1]);
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

      handleUploadFlow(ia);
    }
  };

  const handleUploadFlow = async (imageBytes: Uint8Array) => {
    setStep('envio_seguro');
    setLogs([]);
    setProgressMsg('Iniciando FacialVerificationManager...');
    
    // Replicates Kotlin: FacialVerificationManager.sendSelfie(image)
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
    <div className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center p-6 animate-in fade-in overflow-y-auto">
      <div className="max-w-md w-full space-y-8">
        
        {step === 'consentimento' && (
          <div className="text-center space-y-10">
            <div className="w-24 h-24 bg-zinc-900 rounded-3xl mx-auto flex items-center justify-center border border-zinc-800">
               <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Verificação Facial</h2>
            <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 text-left space-y-5">
               <p className="text-xs text-zinc-400 leading-relaxed">
                  O consentimento é obrigatório para processar sua biometria e elevar seu nível de segurança.
               </p>
               <label className="flex items-center gap-4 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-zinc-800 bg-black" checked={isConsentAccepted} onChange={(e) => setIsConsentAccepted(e.target.checked)} />
                  <span className="text-[10px] uppercase font-black tracking-widest text-zinc-200">Aceito os termos biométricos</span>
               </label>
            </div>
            <button onClick={handleStartRequisitos} disabled={!isConsentAccepted} className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase text-[10px] disabled:opacity-30">Prosseguir</button>
          </div>
        )}

        {step === 'requisitos' && (
           <div className="text-center space-y-8">
              <h2 className="text-2xl font-black italic uppercase text-white">Preparar Captura</h2>
              <div className="grid gap-3">
                 <div className="bg-zinc-900 p-6 rounded-3xl text-left flex gap-4">
                    <span className="text-2xl">🥈</span>
                    <div><p className="text-xs font-bold text-white">Nível PRATA</p><p className="text-[10px] text-zinc-500">Apenas seu rosto em local iluminado.</p></div>
                 </div>
                 <div className="bg-zinc-900 border border-yellow-500/30 p-6 rounded-3xl text-left flex gap-4">
                    <span className="text-2xl">🥇</span>
                    <div><p className="text-xs font-bold text-yellow-500">Nível OURO</p><p className="text-[10px] text-zinc-500">Segure seu documento ao lado do rosto.</p></div>
                 </div>
              </div>
              <button onClick={startCamera} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px]">Abrir Câmera</button>
           </div>
        )}

        {step === 'selfie' && (
          <div className="relative aspect-[3/4] w-full bg-black rounded-[3rem] overflow-hidden border-4 border-zinc-800 shadow-2xl">
             <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" />
             <div className="absolute bottom-8 left-0 w-full flex justify-center">
                <button onClick={takeSelfie} className="w-20 h-20 bg-white rounded-full border-8 border-zinc-900 active:scale-90 transition-transform"></button>
             </div>
          </div>
        )}

        {step === 'envio_seguro' && (
          <div className="text-center space-y-6">
             <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
             <p className="text-xs font-black uppercase text-zinc-500 tracking-widest">{progressMsg}</p>
             <div className="bg-zinc-900 p-4 rounded-2xl font-mono text-[9px] text-left">
                {logs.map((l, i) => <p key={i} className="text-blue-500">> {l}</p>)}
             </div>
          </div>
        )}

        {step === 'status' && (
          <div className="text-center space-y-8 animate-in zoom-in-95">
             <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-2xl ${achievedLevel === VerificationLevel.OURO ? 'bg-yellow-500' : 'bg-zinc-400'}`}>
                <span className="text-4xl">{achievedLevel === VerificationLevel.OURO ? '🥇' : '🥈'}</span>
             </div>
             <h2 className="text-3xl font-black italic uppercase text-white leading-none">Nível {achievedLevel}</h2>
             <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Identidade Carlin Verificada</p>
             <button onClick={() => onComplete({ hash: 'sealed_vector', level: achievedLevel })} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px]">Finalizar</button>
          </div>
        )}

        {step === 'alerta' && (
           <div className="text-center space-y-6">
              <span className="text-6xl">🚨</span>
              <h2 className="text-2xl font-black uppercase text-red-500">Erro de Segurança</h2>
              <p className="text-xs text-zinc-400 leading-relaxed px-4">
                {securityStatus === 'SIMILARITY_DETECTED' 
                  ? antiFakeEngine.alertMessage() 
                  : securityStatus === 'FAKE_PROFILE' 
                  ? 'Falha na prova de vida em tempo real.' 
                  : 'Esta biometria já pertence a uma conta verificada.'}
              </p>
              <button onClick={onCancel} className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-black uppercase text-[10px]">Voltar</button>
           </div>
        )}
      </div>
    </div>
  );
};

export default VerificationProcess;
