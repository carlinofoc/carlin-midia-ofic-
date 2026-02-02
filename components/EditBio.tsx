
import React, { useState } from 'react';
import { moderateBio } from '../services/geminiService';

interface EditBioProps {
  currentBio: string;
  onUpdate: (newBio: string) => void;
  onCancel: () => void;
}

const MAX_BIO_LENGTH = 150;

const EditBio: React.FC<EditBioProps> = ({ currentBio, onUpdate, onCancel }) => {
  const [bio, setBio] = useState(currentBio);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (bio.length > MAX_BIO_LENGTH) return;
    
    setIsSaving(true);
    setError(null);

    try {
      const result = await moderateBio(bio);
      if (result.approved) {
        onUpdate(bio);
      } else {
        setError(result.reason || "Sua biografia contém conteúdo não permitido.");
        setIsSaving(false);
      }
    } catch (err) {
      setError("Erro ao salvar. Tente novamente.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[3100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-zinc-900 w-full max-w-md rounded-[2.5rem] border border-zinc-800 p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Editar Biografia</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Diga ao mundo quem você é.</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Escreva algo sobre você..."
              maxLength={MAX_BIO_LENGTH}
              rows={4}
              className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-200 outline-none focus:border-blue-500 transition-all resize-none placeholder:text-zinc-700"
            />
            <div className={`absolute bottom-4 right-4 text-[10px] font-black uppercase tracking-widest ${bio.length >= MAX_BIO_LENGTH ? 'text-red-500' : 'text-zinc-600'}`}>
              {bio.length} / {MAX_BIO_LENGTH}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            {isSaving ? 'Validando...' : 'Salvar Alteração'}
          </button>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="w-full text-zinc-500 text-[10px] font-black uppercase tracking-widest py-2 hover:text-white transition-colors disabled:opacity-30"
          >
            Cancelar
          </button>
        </div>

        <div className="text-center">
          <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider">
            Sua biografia é moderada pela IA Guardian v4.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditBio;
