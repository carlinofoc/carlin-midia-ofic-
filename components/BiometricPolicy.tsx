
import React from 'react';

interface BiometricPolicyProps {
  onClose: () => void;
}

const BiometricPolicy: React.FC<BiometricPolicyProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col bg-black text-zinc-300 p-6 lg:p-12 max-w-3xl mx-auto leading-relaxed overflow-y-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <span className="text-blue-500">🛡️</span> Política Biométrica
        </h1>
        <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="space-y-8 text-sm lg:text-base">
        <section className="bg-blue-600/5 p-6 rounded-3xl border border-blue-500/20">
          <h3 className="text-lg font-bold text-blue-400 mb-3">Compromisso de Segurança</h3>
          <p>Seus dados biométricos são coletados exclusivamente para confirmar sua identidade real e proteger sua conta contra clonagem e perfis falsos.</p>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white">1. Natureza da Coleta</h3>
          <p>Coletamos sua imagem facial (selfie) e um vídeo curto de movimentos faciais em tempo real para prova de vida e análise biométrica comparativa.</p>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white">2. Proteção e Criptografia</h3>
          <p>Os dados são criptografados de ponta a ponta e armazenados em servidores seguros. Não utilizamos seus dados biométricos para fins comerciais ou publicitários.</p>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white">3. Direitos do Usuário (LGPD)</h3>
          <p>Em conformidade com a LGPD, você tem o direito de:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Saber quais dados estão sendo processados.</li>
            <li>Solicitar a exclusão definitiva dos dados biométricos a qualquer momento (o que resultará na perda do selo de verificação).</li>
            <li>Revogar o consentimento de uso futuro.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white">4. Não Compartilhamento</h3>
          <p>O Carlin Mídia Ofic não compartilha sua biometria com terceiros, parceiros comerciais ou outras redes sociais.</p>
        </section>

        <div className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 mb-6 uppercase font-bold tracking-widest">v4.1 Guardian • Carlin Security</p>
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-black py-4 px-8 rounded-xl transition-all active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default BiometricPolicy;
