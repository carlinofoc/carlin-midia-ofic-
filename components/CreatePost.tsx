import React, { useState } from 'react';
import { Post } from '../types';
import { Icons } from '../constants';
import { generateCaption } from '../services/geminiService';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
  onCancel: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, onCancel }) => {
  const [step, setStep] = useState<'upload' | 'caption'>('upload');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        setStep('caption');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAICaption = async () => {
    setIsGenerating(true);
    const newCaption = await generateCaption("a beautiful landscape photo with sunset");
    setCaption(newCaption);
    setIsGenerating(false);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    // Corrected 'userId' to 'autor_id' to match Post interface
    const newPost: Post = {
      id: Date.now().toString(),
      autor_id: 'me',
      username: 'nexus_user',
      userAvatar: 'https://picsum.photos/seed/me/100/100',
      content: caption,
      media: [selectedFile],
      type: 'image',
      likes: 0,
      comments: 0,
      timestamp: 'Just now'
    };

    onPostCreated(newPost);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <button onClick={onCancel} className="text-sm font-bold hover:text-zinc-400">Cancel</button>
          <h2 className="font-bold">Create New Post</h2>
          <button 
            onClick={step === 'upload' ? undefined : handleSubmit} 
            disabled={step === 'upload'}
            className={`text-sm font-bold text-blue-500 hover:text-blue-400 ${step === 'upload' ? 'opacity-0' : ''}`}
          >
            Share
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {step === 'upload' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-6">
              <svg className="w-24 h-24 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-medium">Drag photos and videos here</h3>
              <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer">
                Select from computer
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          ) : (
            <>
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center">
                <img src={selectedFile!} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="w-full md:w-2/5 flex flex-col border-l border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img src="https://picsum.photos/seed/me/100/100" className="w-7 h-7 rounded-full" />
                  <span className="font-bold text-sm">nexus_user</span>
                </div>
                
                <textarea 
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Write a caption..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm resize-none mb-4"
                />

                <div className="space-y-4">
                  <button 
                    onClick={handleGenerateAICaption}
                    disabled={isGenerating}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    {isGenerating ? 'AI Magic...' : '✨ Generate AI Caption'}
                  </button>
                  
                  <div className="flex items-center justify-between py-3 border-y border-zinc-800 cursor-pointer hover:bg-zinc-800 -mx-4 px-4 transition-colors">
                    <span className="text-sm">Add Location</span>
                    <Icons.Search className="w-4 h-4 text-zinc-400" />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800 -mx-4 px-4 transition-colors">
                    <span className="text-sm">Accessibility</span>
                    <Icons.Plus className="w-4 h-4 text-zinc-400 rotate-45" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;