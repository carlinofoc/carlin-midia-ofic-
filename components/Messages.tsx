
import React, { useState, useEffect, useRef } from 'react';
import { User, Message, Chat, VerificationLevel } from '../types';
import { Icons } from '../constants';
import { simulateAIResponse } from '../services/geminiService';

const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    // Added missing User properties to satisfy the type definition
    user: { 
      id: 'u1', 
      username: 'crypto_wiz', 
      displayName: 'Elena Crypto', 
      name: 'Elena Crypto',
      email: 'elena@example.com',
      avatar: 'https://picsum.photos/seed/chat1/100/100', 
      followers: 120, 
      following: 100,
      // Added missing properties viewsLastYear and monetizationEnrolled
      viewsLastYear: 0,
      // Added missing required property
      averageViewsPerVideo: 0,
      monetizationEnrolled: false,
      nome_encrypted: { encrypted: '', iv: '', tag: '' },
      email_encrypted: { encrypted: '', iv: '', tag: '' },
      passwordHash: '',
      chave: '',
      verificationLevel: VerificationLevel.BRONZE,
      level: VerificationLevel.BRONZE,
      consentAccepted: true,
      interests: [],
      viewedContent: []
    },
    lastMessage: 'Check out the new NFT drop!',
    messages: [
      { id: 'm1', senderId: 'u1', text: 'Hey! Did you see the new collection?', timestamp: new Date() }
    ]
  },
  {
    id: 'c2',
    // Added missing User properties to satisfy the type definition
    user: { 
      id: 'u2', 
      username: 'ai_buddy', 
      displayName: 'Nexus AI (Simulation)', 
      name: 'Nexus AI',
      email: 'nexus@carlin.ai',
      avatar: 'https://picsum.photos/seed/ai/100/100', 
      followers: 1000, 
      following: 0, 
      isVerified: true,
      // Added missing properties viewsLastYear and monetizationEnrolled
      viewsLastYear: 0,
      // Added missing required property
      averageViewsPerVideo: 0,
      monetizationEnrolled: false,
      nome_encrypted: { encrypted: '', iv: '', tag: '' },
      email_encrypted: { encrypted: '', iv: '', tag: '' },
      passwordHash: '',
      chave: '',
      verificationLevel: VerificationLevel.OURO,
      level: VerificationLevel.OURO,
      consentAccepted: true,
      interests: [],
      viewedContent: []
    },
    lastMessage: 'I am here to help you!',
    messages: [
      { id: 'm1', senderId: 'u2', text: 'Hello! I am Nexus AI. Ask me anything about the platform!', timestamp: new Date(), isAI: true }
    ]
  }
];

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;

    const userMsg: Message = { id: Date.now().toString(), senderId: 'me', text: input, timestamp: new Date() };
    const updatedMessages = [...selectedChat.messages, userMsg];
    
    const updatedChat = { ...selectedChat, messages: updatedMessages, lastMessage: input };
    setChats(prev => prev.map(c => c.id === selectedChat.id ? updatedChat : c));
    setSelectedChat(updatedChat);
    setInput('');

    // If chatting with AI, simulate response
    if (selectedChat.user.username === 'ai_buddy') {
       const aiResponseText = await simulateAIResponse(input, "User is asking about Nexus platform features.");
       const aiMsg: Message = { id: (Date.now()+1).toString(), senderId: selectedChat.user.id, text: aiResponseText, timestamp: new Date(), isAI: true };
       const withAIResponse = [...updatedMessages, aiMsg];
       const finalChat = { ...updatedChat, messages: withAIResponse, lastMessage: aiResponseText };
       setChats(prev => prev.map(c => c.id === selectedChat.id ? finalChat : c));
       setSelectedChat(finalChat);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] lg:h-screen w-full pt-14 lg:pt-0">
      {/* Sidebar - Chat List */}
      <div className={`w-full lg:w-80 flex flex-col border-r border-zinc-800 bg-black ${selectedChat ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Messages</h2>
          <button className="p-2 hover:bg-zinc-900 rounded-full"><Icons.Plus className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-zinc-900 transition-colors ${selectedChat?.id === chat.id ? 'bg-zinc-900' : ''}`}
            >
              <div className="relative">
                <img src={chat.user.avatar} className="w-14 h-14 rounded-full" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold truncate">{chat.user.displayName}</span>
                  <span className="text-[10px] text-zinc-500">2h</span>
                </div>
                <p className="text-sm text-zinc-400 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-black ${selectedChat ? 'flex' : 'hidden lg:flex items-center justify-center'}`}>
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedChat(null)} className="lg:hidden p-2 -ml-2"><Icons.Plus className="w-6 h-6 rotate-45" /></button>
                <img src={selectedChat.user.avatar} className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                   <span className="font-bold text-sm leading-none">{selectedChat.user.displayName}</span>
                   <span className="text-xs text-green-500">Online</span>
                </div>
              </div>
              <div className="flex gap-4 text-zinc-400">
                <button className="hover:text-white"><Icons.Play className="w-6 h-6" /></button>
                <button className="hover:text-white font-bold text-xl">i</button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.senderId === 'me' ? 'bg-blue-600 rounded-br-none' : 'bg-zinc-800 rounded-bl-none'} ${msg.isAI ? 'border-l-4 border-purple-500' : ''}`}>
                    {msg.text}
                    <div className="text-[10px] text-zinc-400 mt-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-zinc-800">
              <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-2">
                 <button className="p-1"><Icons.Plus className="w-5 h-5" /></button>
                 <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Message..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm" 
                 />
                 <button 
                  onClick={sendMessage}
                  className={`font-bold text-blue-500 ${!input.trim() ? 'opacity-50 pointer-events-none' : ''}`}
                 >
                   Send
                 </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full border-2 border-zinc-700 flex items-center justify-center mx-auto">
               <Icons.Message className="w-12 h-12 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold">Your Messages</h3>
            <p className="text-zinc-500 max-w-xs">Send private photos and messages to a friend or group.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Send Message</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
