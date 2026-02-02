
import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '../constants';

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'welcome' | 'performance' | 'educational' | 'first_post';
}

interface NotificationSystemProps {
  currentUser: any;
  hasPosts: boolean;
  onNavigateToCreate: () => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ currentUser, hasPosts, onNavigateToCreate }) => {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  const triggerNotification = useCallback((notif: Notification) => {
    setActiveNotification(notif);
    // Auto dismiss após 8 segundos para push notifications
    setTimeout(() => {
      setActiveNotification(null);
    }, 8000);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Escutador de eventos para notificações inteligentes disparadas por outros componentes
    const handleCustomNotification = (event: any) => {
      const data = event.detail as Notification;
      
      // Evitar repetir notificações educativas na mesma sessão
      if (data.type === 'educational' && sessionStorage.getItem(`carlin_notif_${data.id}`)) return;
      if (data.type === 'educational') sessionStorage.setItem(`carlin_notif_${data.id}`, 'true');

      triggerNotification(data);
    };

    window.addEventListener('carlin-notification', handleCustomNotification);

    // Lógica de tempo (retenção)
    const checkTimeNotifications = () => {
      const signupTime = parseInt(localStorage.getItem('carlin_signup_timestamp') || Date.now().toString());
      const now = Date.now();
      const elapsedHours = (now - signupTime) / (1000 * 60 * 60);

      const sentWelcome = localStorage.getItem('carlin_push_welcome') === 'true';
      const sentReinforcement = localStorage.getItem('carlin_push_24h') === 'true';

      if (!sentWelcome) {
        triggerNotification({
          id: 'welcome',
          type: 'welcome',
          title: 'Seja bem-vindo ao Carlin!',
          message: 'Aqui o seu alcance é baseado em relevância real. Sinta-se livre para criar sem medo de shadowban.',
          icon: <div className="bg-blue-600 p-2 rounded-lg text-white">✨</div>,
          actionLabel: 'Começar agora',
          onAction: onNavigateToCreate
        });
        localStorage.setItem('carlin_push_welcome', 'true');
      } else if (elapsedHours >= 24 && !localStorage.getItem('carlin_push_24h')) {
        triggerNotification({
          id: 'reinforcement',
          type: 'welcome',
          title: 'Sua voz tem valor ⚖️',
          message: 'Lembre-se: no Carlin, entregamos seu conteúdo para quem realmente quer vê-lo, independentemente do tamanho da sua conta.',
          icon: <div className="bg-indigo-600 p-2 rounded-lg text-white">🚀</div>
        });
        localStorage.setItem('carlin_push_24h', 'true');
      }
    };

    const timer = setTimeout(checkTimeNotifications, 3000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('carlin-notification', handleCustomNotification);
    };
  }, [currentUser, triggerNotification, onNavigateToCreate]);

  // Simulação de "Inteligência Artificial" monitorando performance em background
  useEffect(() => {
    if (hasPosts && !localStorage.getItem('carlin_notif_performance_initial')) {
      const perfTimer = setTimeout(() => {
        const event = new CustomEvent('carlin-notification', {
          detail: {
            id: 'perf_initial',
            type: 'performance',
            title: 'Seu conteúdo está brilhando! ⚖️',
            message: 'A relevância do seu último post está acima da média. Novas pessoas estão descobrindo seu valor agora mesmo.',
            icon: <div className="bg-yellow-500 p-2 rounded-lg text-white">🔥</div>
          }
        });
        window.dispatchEvent(event);
        localStorage.setItem('carlin_notif_performance_initial', 'true');
      }, 15000); // 15 segundos após postar ou logar com posts
      return () => clearTimeout(perfTimer);
    }
  }, [hasPosts]);

  if (!activeNotification) return null;

  return (
    <div className="fixed top-20 left-4 right-4 lg:left-auto lg:right-8 lg:w-96 z-[2000] animate-in slide-in-from-top-10 fade-in duration-500">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl flex gap-4 items-start relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-1 h-full ${activeNotification.type === 'performance' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
        <div className="shrink-0">{activeNotification.icon}</div>
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-black text-white leading-tight">{activeNotification.title}</h4>
          <p className="text-xs text-zinc-400 leading-snug font-medium">{activeNotification.message}</p>
          {activeNotification.actionLabel && (
            <button 
              onClick={() => {
                activeNotification.onAction?.();
                setActiveNotification(null);
              }}
              className="mt-2 text-[10px] font-black uppercase text-blue-500 tracking-widest hover:text-blue-400"
            >
              {activeNotification.actionLabel} →
            </button>
          )}
        </div>
        <button 
          onClick={() => setActiveNotification(null)}
          className="shrink-0 text-zinc-600 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationSystem;
