
import React, { useState, useEffect, useCallback } from 'react';
import { Icons } from '../constants';
import { User, NotificationPrefs } from '../types';

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'welcome' | 'performance' | 'educational' | 'first_post' | 'security' | 'community';
}

interface NotificationSystemProps {
  currentUser: User;
  hasPosts: boolean;
  onNavigateToCreate: () => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ currentUser, hasPosts, onNavigateToCreate }) => {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

  const prefs = currentUser.notificationPrefs || {
    performance: true,
    educational: true,
    security: true,
    community: true
  };

  const triggerNotification = useCallback((notif: Notification) => {
    // Check if user allows this type of notification
    const canShow = 
      (notif.type === 'performance' && prefs.performance) ||
      (notif.type === 'educational' && prefs.educational) ||
      (notif.type === 'security' && prefs.security) ||
      (notif.type === 'community' && prefs.community) ||
      (notif.type === 'welcome');

    if (!canShow) return;

    setActiveNotification(notif);
    setTimeout(() => {
      setActiveNotification(null);
    }, 8000);
  }, [prefs]);

  useEffect(() => {
    if (!currentUser) return;

    const handleCustomNotification = (event: any) => {
      const data = event.detail as Notification;
      if (data.type === 'educational' && sessionStorage.getItem(`carlin_notif_${data.id}`)) return;
      if (data.type === 'educational') sessionStorage.setItem(`carlin_notif_${data.id}`, 'true');
      triggerNotification(data);
    };

    window.addEventListener('carlin-notification', handleCustomNotification);

    // Boas-vindas Educativa
    const checkTimeNotifications = () => {
      const sentWelcome = localStorage.getItem('carlin_push_welcome_v2') === 'true';
      if (!sentWelcome) {
        triggerNotification({
          id: 'welcome_v2',
          type: 'welcome',
          title: 'Respeito e Valor ✨',
          message: 'Você está no Carlin. Aqui, números servem para orientar, não para viciar.',
          icon: <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">C</div>,
        });
        localStorage.setItem('carlin_push_welcome_v2', 'true');
      }
    };

    // Segurança: Badge de Proteção
    if (currentUser.isFaciallyVerified && !localStorage.getItem('carlin_notif_security_init')) {
        setTimeout(() => {
            triggerNotification({
                id: 'security_init',
                type: 'security',
                title: 'Identidade Protegida 🛡️',
                message: 'Sua biometria facial garante que ninguém pode se passar por você.',
                icon: <div className="bg-zinc-800 p-2 rounded-lg text-blue-500"><Icons.Verified className="w-4 h-4" /></div>
            });
            localStorage.setItem('carlin_notif_security_init', 'true');
        }, 15000);
    }

    const timer = setTimeout(checkTimeNotifications, 4000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('carlin-notification', handleCustomNotification);
    };
  }, [currentUser, triggerNotification]);

  // Monitoramento de Constância (Human-centric)
  useEffect(() => {
    if (hasPosts && !localStorage.getItem('carlin_notif_consistency_1')) {
      const consistencyTimer = setTimeout(() => {
        triggerNotification({
          id: 'consistency_1',
          type: 'performance',
          title: 'Constância Real 🔥',
          message: 'Sua frequência esta semana foi excelente. O valor social do seu perfil cresceu.',
          icon: <div className="bg-orange-600 p-2 rounded-lg text-white">📈</div>
        });
        localStorage.setItem('carlin_notif_consistency_1', 'true');
      }, 30000);
      return () => clearTimeout(consistencyTimer);
    }
  }, [hasPosts, triggerNotification]);

  if (!activeNotification) return null;

  return (
    <div className="fixed top-20 left-4 right-4 lg:left-auto lg:right-8 lg:w-96 z-[2000] animate-in slide-in-from-top-10 fade-in duration-500">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-6 shadow-3xl flex gap-5 items-start relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1.5 h-full ${
            activeNotification.type === 'performance' ? 'bg-orange-500' : 
            activeNotification.type === 'educational' ? 'bg-indigo-500' : 
            activeNotification.type === 'security' ? 'bg-blue-500' : 'bg-zinc-100'
        }`}></div>
        <div className="shrink-0 scale-110">{activeNotification.icon}</div>
        <div className="flex-1 space-y-1.5">
          <h4 className="text-[11px] font-black uppercase text-white tracking-widest leading-none">{activeNotification.title}</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">{activeNotification.message}</p>
          {activeNotification.actionLabel && (
            <button 
              onClick={() => {
                activeNotification.onAction?.();
                setActiveNotification(null);
              }}
              className="mt-3 text-[9px] font-black uppercase text-blue-500 tracking-[0.2em] hover:text-blue-400 block"
            >
              {activeNotification.actionLabel} →
            </button>
          )}
        </div>
        <button 
          onClick={() => setActiveNotification(null)}
          className="shrink-0 p-1 text-zinc-700 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationSystem;
