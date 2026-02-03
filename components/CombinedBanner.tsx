
import React, { useState, useEffect } from "react";

interface CombinedBannerProps {
  onClose?: () => void;
}

const CombinedBanner: React.FC<CombinedBannerProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('carlin_combined_banner_dismissed');
    if (dismissed !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('carlin_combined_banner_dismissed', 'true');
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 z-[9999] shadow-lg animate-slideDown border-b border-white/10">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 space-y-2 text-sm md:text-base">
          <p className="font-bold text-lg md:text-xl flex items-center gap-2">
            <span>🔒</span> Segurança e confiança em primeiro lugar
          </p>
          <div className="space-y-2 opacity-95 leading-relaxed">
            <p>
              No <span className="font-semibold">Carlin Mídia Ofic</span>, todos os usuários e criadores têm seus dados, mensagens e publicações <strong>protegidos com tecnologia de ponta</strong>, totalmente criptografados.
            </p>
            <p>
              💡 <span className="font-semibold">Perfil verificado:</span> Perfis reais podem ganhar o selo de verificado com <strong>foto real + Face ID</strong>.
            </p>
            <p>
              ⚠️ <span className="font-semibold">Proteção contra falsos e golpes:</span> Qualquer tentativa de criar contas falsas ou clonar perfis é detectada e gera alerta automático.
            </p>
            <div className="pt-3 border-t border-white/20 mt-3 flex flex-col gap-1">
              <p>
                👨‍💻 <span className="font-semibold">Desenvolvedor independente:</span> Carlin Ofic, formado em Marketing Digital Tecnólogo na <span className="font-semibold">Unopar</span>.
              </p>
              <p className="opacity-80">
                📧 Para conhecer melhor o projeto, entre em contato via e-mail ou LinkedIn.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-white bg-red-500 hover:bg-red-600 rounded-2xl px-5 py-2.5 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95 self-end md:self-center shrink-0"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default CombinedBanner;
