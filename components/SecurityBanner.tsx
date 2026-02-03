
import React, { useState, useEffect } from "react";

interface SecurityBannerProps {
  onClose?: () => void;
}

const SecurityBanner: React.FC<SecurityBannerProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('carlin_security_banner_seen');
    if (seen !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('carlin_security_banner_seen', 'true');
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-blue-600 text-white p-3 z-[9999] shadow-md animate-slideDown flex items-center justify-center border-b border-blue-500/30">
      <div className="max-w-4xl w-full flex items-center justify-between">
        <div className="text-[11px] md:text-sm font-medium space-y-0.5 md:space-y-1">
          <p className="flex items-center gap-2">
            <span className="shrink-0">🔒</span> 
            <span className="leading-tight">Segurança de ponta e dados protegidos</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="shrink-0">💡</span> 
            <span className="leading-tight">Perfis reais verificados com Face ID</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="shrink-0">⚠️</span> 
            <span className="leading-tight">Alerta contra contas falsas e golpes</span>
          </p>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 text-white bg-red-500 hover:bg-red-600 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shrink-0"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default SecurityBanner;