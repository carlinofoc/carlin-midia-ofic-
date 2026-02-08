import React, { useState, useRef, useEffect } from 'react';
import { Post, Story, User, MusicTrack } from '../types';
import { generateCaption } from '../services/geminiService';
import MusicPicker from './MusicPicker';
import { liteModeManager } from '../services/liteModeService';
import { impactService } from '../services/impactService';

type PublishType = 'post' | 'reel' | 'story' | 'live';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
  onStoryCreated: (story: Story) => void;
  onCancel: () => void;
  currentUser: User; 
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, onStoryCreated, onCancel, currentUser }) => {
  const [publishType, setPublishType] = useState<PublishType>('post');
  const [step, setStep] = useState<'upload' | 'details'>('upload');
  const [mediaFile, setMediaFile] = useState<{ url: string, type: 'image' | 'video', thumb?: string } | null>(null);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const livePreviewRef = useRef<HTMLVideoElement>(null);

  const features = impactService.getUnlockedFeatures(currentUser);
  const isDeveloper = currentUser?.profileType === 'developer';
  const canLive = features.canLive;

  useEffect(() => {
    if (publishType === 'live' && canLive) {
      startLivePreview();
    } else {
      stopLivePreview();
      if (publishType !== 'live') setStep('upload');
    }
    return () => stopLivePreview();
  }, [publishType]);

  const startLivePreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLiveStream(stream);
      if (livePreviewRef.current) {
        livePreviewRef.current.srcObject = stream;
      }
      setStep('details');
    } catch (err) {
      console.error("Erro ao acessar câmera para Live:", err);
      alert("Permissão de câmera/microfone negada.");
      setPublishType('post');
    }
  };

  const stopLivePreview = () => {
    if (liveStream) {
      liveStream.getTracks().forEach(track => track.stop());
      setLiveStream(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    
    if (publishType === 'post' && isVideo) {
      return alert("Erro: Escolha uma mídia (Imagem) para Post!");
    }
    if ((publishType === 'reel' || publishType === 'story') && !isVideo) {
      return alert(`Erro: Escolha uma mídia (Vídeo) para ${publishType === 'reel' ? 'Reel' : 'Story'}!`);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setMediaFile({ url, type: isVideo ? 'video' : 'image' });
      setStep('details');
      if (isVideo) {
        setTimeout(generateThumbnail, 500);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateThumbnail = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbUrl = canvas.toDataURL('image/jpeg', 0.6);
      setMediaFile(prev => prev ? { ...prev, thumb: thumbUrl } : null);
    }
  };

  const handlePublish = () => {
    if (isDeveloper) {
      return alert("Conta de autoridade não pode publicar conteúdo social.");
    }
    if (publishType === 'live' && !canLive) {
      return alert('Erro: Você precisa ter pelo menos 50 seguidores para iniciar uma Live!');
    }
    
    if (publishType !== 'live' && !mediaFile) {
      return alert('Erro: Escolha uma mídia antes de publicar!');
    }

    const isWeak = liteModeManager.network.isConnectionWeak() || liteModeManager.isLiteEnabled;
    
    const publication = {
      type: publishType,
      media: mediaFile?.url || null,
      text: caption,
      music: selectedMusic ? (isWeak ? selectedMusic.urlLow : selectedMusic.urlHigh) : null,
      musicAttribution: selectedMusic?.attribution ? selectedMusic.artist : null,
      user: { id: currentUser.id, name: currentUser.displayName, followers: currentUser.followers },
      createdAt: new Date(),
    };

    if (publishType === 'story') {
      const newStory: Story = {
        id: `story-${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        media: publication.media!,
        viewed: false,
        musicUrl: publication.music || undefined,
        musicAttribution: publication.musicAttribution || undefined
      };
      onStoryCreated(newStory);
    } else {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        autor_id: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        content: publication.text,
        media: publication.type === 'live' ? [] : [publication.media!],
        type: publication.type === 'reel' ? 'video' : (publication.type === 'live' ? 'live' : 'image'),
        likes: 0,
        comments: 0,
        shares: 0,
        category: publication.type === 'reel' ? 'Rio' : (publication.type === 'live' ? 'AO VIVO' : 'Geral'),
        createdAt: publication.createdAt.toISOString(),
        trendingScore: 0,
        timestamp: 'Agora',
        isVerified: currentUser.isVerified,
        musicUrl: publication.music || undefined,
        musicAttribution: publication.musicAttribution || undefined
      };
      onPostCreated(newPost);
    }

    alert(`Sucesso: ${publishType.toUpperCase()} publicado com sucesso!`);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[5000] flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl">
      <div className="bg-zinc-900 w-full max-w-5xl h-full max-h-[850px] rounded-[3rem] border border-zinc-800 overflow-hidden shadow-3xl flex flex-col md:flex-row">
        
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          {publishType === 'live' ? (
            <div className="w-full h-full relative">
              <video ref={livePreviewRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
              {(!canLive || isDeveloper) && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                   <span className="text-4xl mb-4">🔒</span>
                   <h3 className="text-xl font-black uppercase text-white">
                     {isDeveloper ? 'Soberania Ativa' : 'Live Bloqueada'}
                   </h3>
                   <p className="text-xs text-zinc-500 mt-2">
                     {isDeveloper ? 'Perfis de autoridade não podem transmitir socialmente.' : 'Mínimo 50 seguidores necessários para transmitir.'}
                   </p>
                </div>
              )}
            </div>
          ) : step === 'upload' ? (
            <label className="flex flex-col items-center gap-6 cursor-pointer p-20 border-2 border-dashed border-zinc-800 rounded-[3rem] hover:border-blue-500 transition-all">
               <span className="text-4xl">{publishType === 'post' ? '🖼️' : '🎬'}</span>
               <div className="text-center">
                 <h3 className="text-xl font-black uppercase text-white">Escolher Mídia</h3>
                 <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                   {publishType === 'post' ? 'Imagens Apenas' : 'Vídeos Apenas'}
                 </p>
               </div>
               <input type="file" className="hidden" accept={publishType === 'post' ? "image/*" : "video/*"} onChange={handleFileChange} />
            </label>
          ) : (
            <div className="w-full h-full relative">
               {mediaFile?.type === 'video' ? (
                 <video ref={videoRef} src={mediaFile.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
               ) : (
                 <img src={mediaFile?.url} className="w-full h-full object-cover" />
               )}
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="w-full md:w-[420px] bg-zinc-900 border-l border-zinc-800 flex flex-col p-8 space-y-8 overflow-y-auto">
          <div className="flex items-center justify-between">
            <button onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Voltar</button>
            <div className="flex gap-1 bg-black p-1 rounded-2xl border border-zinc-800 overflow-x-auto">
               <TabBtn active={publishType === 'post'} onClick={() => setPublishType('post')} label="Post" />
               <TabBtn active={publishType === 'reel'} onClick={() => setPublishType('reel')} label="Reel" />
               <TabBtn active={publishType === 'story'} onClick={() => setPublishType('story')} label="Story" />
               <TabBtn active={publishType === 'live'} onClick={() => setPublishType('live')} label="Live" />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <textarea 
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Legenda (opcional)" 
              className="w-full bg-black/50 border border-zinc-800 rounded-3xl p-6 text-sm text-zinc-200 outline-none focus:border-blue-600 transition-all resize-none min-h-[120px]"
            />
            
            <button 
              onClick={() => setShowMusicPicker(true)}
              className={`w-full py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${selectedMusic ? 'bg-blue-600/20 border-blue-500 text-blue-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
            >
               🎵 {selectedMusic ? `${selectedMusic.title} - ${selectedMusic.artist}` : 'Adicionar Música'}
            </button>

            {selectedMusic?.attribution && (
              <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                 <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest leading-relaxed italic">
                    🎵 Música: {selectedMusic.artist} (YouTube Audio Library)
                 </p>
              </div>
            )}
          </div>

          <button 
            onClick={handlePublish}
            disabled={(publishType !== 'live' && !mediaFile) || (publishType === 'live' && !canLive) || isDeveloper}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-2xl disabled:opacity-20"
          >
            {isDeveloper ? 'Publicação Desativada' : `Publicar ${publishType}`}
          </button>
          
          {isDeveloper && (
            <p className="text-[8px] text-center font-black uppercase text-zinc-600 tracking-widest italic">
              A conta CarlinOficial é reservada para fins técnicos.
            </p>
          )}
        </div>
      </div>

      {showMusicPicker && (
        <MusicPicker onSelect={(m) => { setSelectedMusic(m); setShowMusicPicker(false); }} onCancel={() => setShowMusicPicker(false)} />
      )}
    </div>
  );
};

const TabBtn = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all shrink-0 ${active ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>{label}</button>
);

export default CreatePost;