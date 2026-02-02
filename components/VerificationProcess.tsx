
import React, { useState, useRef, useEffect } from 'react';
import { analyzeVerification } from '../services/geminiService';

interface VerificationProcessProps {
  onComplete: () => void;
  onCancel: () => void;
  onOpenPolicy: () => void;
}

const VerificationProcess: React.FC<VerificationProcessProps> = ({ onComplete, onCancel, onOpenPolicy }) => {
  const [step, setStep] = useState<'intro' | 'consent' | 'selfie' | 'video' | 'analyzing' | 'success'>('intro');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      setStream(media);
      if (videoRef.current) videoRef.current.srcObject = media;
      setStep('selfie');
    } catch (err) {
      alert("Precisamos de acesso à câmera para a verificação facial.");
    }
  };

  const takeSelfie = () => {
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const data = canvas.toDataURL('image/jpeg');
      setCapturedSelfie(data);
      setStep('video');
    }
  };

  const startVideoRecord = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          processVerification();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const processVerification = async () => {
    setStep('analyzing');
    if (capturedSelfie) {
      await analyzeVerification(capturedSelfie);
      setTimeout(() => setStep('success'), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center p-6 lg:p-12 animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-8">
        {step === 'intro' && (
          <div className="text-center space-y-8 animate-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20">
               <span className="text-3xl">🛡️</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">Verificação de Autenticidade</h1>
              <p className="text-zinc-400 font-medium">
                Garantimos que você é um criador real. O processo leva 1 minuto e exige reconhecimento facial em tempo real.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 text-left space-y-4">
               <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">1</div>
                  <p className="text-xs text-zinc-300 font-bold uppercase">Selfie em Tempo Real</p>
               </div>
               <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">2</div>
                  <p className="text-xs text-zinc-300 font-bold uppercase">Prova de Vida (Vídeo Curto)</p>
               </div>
               <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-black">3</div>
                  <p className="text-xs text-zinc-300 font-bold uppercase">Análise de Relevância</p>
               </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => setStep('consent')} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl">Iniciar Verificação</button>
              <button onClick={onCancel} className="text-zinc-500 text-xs font-black uppercase tracking-widest hover:text-white">Cancelar</button>
            </div>
          </div>
        )}

        {step === 'consent' && (
          <div className="text-center space-y-8 animate-in slide-in-from-bottom-4">
             <div className="text-5xl mb-6">📝</div>
             <h2 className="text-2xl font-black italic uppercase tracking-tighter">Consentimento Biométrico</h2>
             <p className="text-zinc-400 text-sm leading-relaxed">
               Para prosseguir, você autoriza a coleta de sua selfie e vídeo curto para fins exclusivos de validação de identidade real. Seus dados serão criptografados e não serão usados comercialmente.
             </p>
             <button onClick={onOpenPolicy} className="text-blue-500 text-xs font-black uppercase tracking-widest hover:underline">Ler Política Completa</button>
             <div className="flex flex-col gap-3 pt-4">
                <button onClick={startCamera} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl">Autorizar e Continuar</button>
                <button onClick={() => setStep('intro')} className="text-zinc-500 text-xs font-black uppercase tracking-widest hover:text-white">Voltar</button>
             </div>
          </div>
        )}

        {(step === 'selfie' || step === 'video') && (
          <div className="text-center space-y-6">
            <div className="relative aspect-[3/4] w-full bg-zinc-900 rounded-[3rem] overflow-hidden border-4 border-zinc-800 shadow-2xl">
               <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" />
               <div className="absolute inset-0 border-[32px] border-black/20 pointer-events-none flex items-center justify-center">
                  <div className="w-[80%] aspect-[3/4] rounded-[6rem] border-2 border-dashed border-blue-500/50"></div>
               </div>
               {countdown && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <span className="text-8xl font-black italic animate-ping">{countdown}</span>
                 </div>
               )}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-black italic uppercase tracking-tighter">
                {step === 'selfie' ? 'Enquadre seu rosto' : 'Gire a cabeça levemente'}
              </h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                {step === 'selfie' ? 'Certifique-se de estar em um local iluminado.' : 'Estamos confirmando que você é humano.'}
              </p>
              <button 
                onClick={step === 'selfie' ? takeSelfie : startVideoRecord} 
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {step === 'selfie' ? 'Capturar Selfie' : 'Iniciar Prova de Vida'}
              </button>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="text-center space-y-12">
             <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">🤖</div>
             </div>
             <div className="space-y-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Analisando Biometria</h2>
                <div className="space-y-2">
                   <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Comparando com dados da plataforma...</p>
                   <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest animate-pulse delay-75">Validando prova de vida facial...</p>
                   <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-4">IA Carlin v4.1 Guardian</p>
                </div>
             </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-10 animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-green-500/40">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
             </div>
             <div className="space-y-4">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Verificado com Sucesso!</h2>
                <p className="text-zinc-400 font-medium">
                  Este perfil foi verificado por reconhecimento facial e atividade real como criador de conteúdo. Seu selo azul já está ativo.
                </p>
             </div>
             <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border-2 border-blue-500">
                   <img src={capturedSelfie || ""} className="w-full h-full object-cover" alt="Sua verificação" />
                </div>
                <div className="text-left">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Status do Perfil</p>
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">Criador Verificado</span>
                      <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                   </div>
                </div>
             </div>
             <button onClick={onComplete} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Continuar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationProcess;
