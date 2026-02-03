
import React, { useState, useEffect } from "react";

interface DeveloperBannerProps {
  isAuthenticated: boolean;
  onClose?: () => void;
}

const DeveloperBanner: React.FC<DeveloperBannerProps> = ({ isAuthenticated, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('carlin_developer_banner_dismissed');
    if (dismissed !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('carlin_developer_banner_dismissed', 'true');
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 w-full bg-gradient-to-r from-green-600 to-teal-700 text-white p-3 z-[1000] shadow-lg animate-slideUp ${isAuthenticated ? 'mb-16 lg:mb-0' : ''}`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex-1 space-y-1 text-[11px] md:text-sm">
          <p className="flex items-center gap-2">
            <span className="shrink-0">👨‍💻</span>
            <span className="font-bold">Desenvolvedor Independente: Carlinho Ofíc</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="shrink-0">🎓</span>
            <span>Formado em Marketing Digital Tecnólogo na <span className="font-semibold">Unopar</span></span>
          </p>
          <p className="flex items-center gap-2 opacity-90">
            <span className="shrink-0">📧</span>
            <span>Para conhecer melhor o projeto, entre em contato via e-mail ou LinkedIn.</span>
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-white bg-red-500 hover:bg-red-600 rounded-xl px-4 py-1.5 font-black uppercase tracking-widest text-[9px] shadow-md transition-all active:scale-95 self-end md:self-center"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default DeveloperBanner;