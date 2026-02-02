
import React, { useState, useRef } from 'react';
import { analyzeProfilePhoto } from '../services/geminiService';

interface EditProfilePhotoProps {
  currentAvatar: string;
  onUpdate: (newAvatar: string) => void;
  onCancel: () => void;
}

const EditProfilePhoto: React.FC<EditProfilePhotoProps> = ({ currentAvatar, onUpdate, onCancel }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    const result = await analyzeProfilePhoto(selectedImage);

    if (!result.safe) {
      setError("A imagem contém conteúdo impróprio e não pode ser usada.");
      setIsAnalyzing(false);
      return;
    }

    if (!result.authentic) {
      setError("A imagem não parece ser autêntica ou não cumpre nossos requisitos de qualidade.");
      setIsAnalyzing(false);
      return;
    }

    onUpdate(selectedImage);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[3000] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Alterar Foto de Perfil</h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Sua identidade, seu valor.</p>
        </div>

        <div className="relative w-48 h-48 mx-auto">
          <div className="w-full h-full rounded-full border-4 border-zinc-800 overflow-hidden shadow-2xl relative">
            <img 
              src={selectedImage || currentAvatar} 
              className={`w-full h-full object-cover transition-all ${isAnalyzing ? 'blur-sm grayscale' : ''}`}
              alt="Preview"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-black shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-center">
            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          {selectedImage ? (
            <button 
              onClick={handleApply}
              disabled={isAnalyzing}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              {isAnalyzing ? 'Validando Foto...' : 'Confirmar Alteração'}
            </button>
          ) : (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-zinc-900 text-white border border-zinc-800 py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all"
            >
              Escolher da Galeria
            </button>
          )}
          <button 
            onClick={onCancel}
            disabled={isAnalyzing}
            className="w-full text-zinc-500 text-[10px] font-black uppercase tracking-widest py-2 hover:text-white transition-colors disabled:opacity-30"
          >
            Cancelar
          </button>
        </div>

        <div className="p-4 text-center">
          <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
            IA Guardian v4.1 realiza análise imediata de segurança.<br/>
            Seu selo de verificação será mantido após a troca.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePhoto;
