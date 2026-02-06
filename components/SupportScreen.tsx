
import React from 'react';
import { SupportMessages } from '../constants';

interface SupportScreenProps {
  onSupport: () => void;
  onBack: () => void;
}

/**
 * Replicates Jetpack Compose:
 * @Composable fun SupportScreen() { Column(...) { Text(...); Spacer(...); Button(...) } }
 */
const SupportScreen: React.FC<SupportScreenProps> = ({ onSupport, onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white animate-in fade-in duration-500 overflow-y-auto pb-32">
      {/* Top Bar for Navigation (Standard Android Scaffold behavior) */}
      <div className="px-4 pt-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <svg className="w-6 h-6 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
          </svg>
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Configurações / Apoio</span>
      </div>

      <div className="max-w-md mx-auto flex flex-col p-4 pt-8">
        {/* Text(text = "Apoie o desenvolvimento do aplicativo", fontSize = 18.sp, fontWeight = FontWeight.Bold) */}
        <h1 className="text-[18px] font-bold leading-tight text-white mb-2">
          {SupportMessages.TITLE}
        </h1>

        {/* Spacer(modifier = Modifier.height(8.dp)) handled by mb-2 above */}

        {/* Text(text = "Este aplicativo é desenvolvido de forma independente...") */}
        <p className="text-[14px] leading-relaxed text-zinc-300">
          Este aplicativo é desenvolvido de forma independente. 
          O apoio de <span className="font-bold text-white">R$ 9,90</span> ajuda a manter servidores, segurança, 
          atualizações, modo Lite e o desenvolvimento contínuo do projeto.
        </p>

        {/* Spacer(modifier = Modifier.height(8.dp)) */}
        <div className="h-2"></div>

        {/* Text(text = "Parte do lucro é destinada à compra de cestas básicas...") */}
        <p className="text-[14px] leading-relaxed text-zinc-300">
          Parte do lucro é destinada à compra de <span className="text-blue-400 font-semibold">cestas básicas</span> para famílias em situação de vulnerabilidade, registrado no ImpactRepository.
        </p>

        {/* Spacer(modifier = Modifier.height(12.dp)) */}
        <div className="h-3"></div>

        {/* Text(text = "O apoio é opcional. O aplicativo continua gratuito.", fontSize = 12.sp, color = Color.Gray) */}
        <p className="text-[12px] text-zinc-500 font-medium">
          O apoio é opcional. O aplicativo continua gratuito e todas as funções principais permanecem acessíveis para todos os níveis de verificação.
        </p>

        {/* Spacer(modifier = Modifier.height(16.dp)) */}
        <div className="h-4"></div>

        {/* Button(onClick = { ... }, modifier = Modifier.fillMaxWidth()) { Text("Apoiar por R$ 9,90") } */}
        <button 
          onClick={onSupport}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-sm transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
        >
          {SupportMessages.BUTTON}
        </button>

        <button 
          onClick={onBack}
          className="w-full mt-4 py-4 text-zinc-500 font-bold uppercase text-[10px] tracking-widest hover:text-zinc-300 transition-colors"
        >
          Voltar ao Perfil
        </button>

        {/* Bottom Banner (Carlin Branding) */}
        <div className="mt-20 pt-10 border-t border-zinc-900 text-center opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.4em]">Carlin Dev Environment • Kotlin-Ready v5.9</p>
        </div>
      </div>
    </div>
  );
};

export default SupportScreen;
