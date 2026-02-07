
import { User, ImpactResult, SocialDonation, Post, MonetizationResult, CreatorTier, MembershipTier, WithdrawalRequest, PaymentMethod, WithdrawalStatus, PayoutDestination } from '../types';
import { impactRepository } from './impactRepository';

/**
 * Carlin Impact Engine v3.9 - Admin & Suspension Controls
 * Standards: 
 * - Memberships: 1,000 Followers
 * - Ads: 1,000 Followers AND 500,000 Annual Views
 */

const VALOR_BASE_SPOT = 0.50; 
const MEMBERSHIP_FEE_RATE = 0.05;
export const MIN_WITHDRAWAL_AMOUNT = 50.00;

export interface UnlockedFeatures {
  canPost: boolean;
  canLive: boolean;
  canSeeBasicAnalytics: boolean;
  canEnrolMembership: boolean;
  canEnrolAds: boolean;
  hasGrowthBadge: boolean;
  advancedEditing: boolean;
}

export const impactService = {
  getUnlockedFeatures(user: User): UnlockedFeatures {
    if (user.isMonetizationSuspended) {
      return {
        canPost: true,
        canLive: false,
        canSeeBasicAnalytics: false,
        advancedEditing: false,
        hasGrowthBadge: false,
        canEnrolMembership: false,
        canEnrolAds: false
      };
    }

    const followers = user.followers || 0;
    const views = user.viewsLastYear || 0;

    const isStarter = followers >= 0;
    const isLiveReady = followers >= 50;
    const isGrowing = followers >= 50 && followers < 1000;
    const isMonetizationReady = followers >= 1000;
    const isAdsReady = followers >= 1000 && views >= 500000;

    return {
      canPost: isStarter,
      canLive: isLiveReady,
      canSeeBasicAnalytics: isGrowing || isMonetizationReady,
      advancedEditing: isGrowing || isMonetizationReady,
      hasGrowthBadge: isGrowing,
      canEnrolMembership: isMonetizationReady,
      canEnrolAds: isAdsReady
    };
  },

  /**
   * Simulates the admin endpoint: POST /api/v1/admin/creator/monetization/suspend
   */
  async suspendMonetization(userId: string, reason: string): Promise<{ status: string; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would update the backend DB.
    // For this simulation, we assume success.
    return {
      status: "SUSPENDED",
      message: `Monetização suspensa para o usuário ${userId}. Motivo: ${reason}`
    };
  },

  /**
   * Simula o endpoint GET /api/v1/creator/payout/history
   * Retorna objeto com chave 'payouts' e campos 'date' e 'status' (PAID, REFUSED, PROCESSING)
   */
  async getPayoutHistory(user: User): Promise<{ payouts: WithdrawalRequest[] }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Se não houver histórico, retorna mocks baseados no spec do usuário
    if (!user.withdrawalHistory || user.withdrawalHistory.length === 0) {
      return {
        payouts: [
          { id: 'p1', date: '2026-02-01', amount: 500.00, method: 'PIX', status: 'PAID' },
          { id: 'p2', date: '2026-01-10', amount: 300.00, method: 'PayPal', status: 'REFUSED' }
        ]
      };
    }

    return { payouts: user.withdrawalHistory };
  },

  /**
   * Simula o endpoint POST /api/v1/creator/payout/request
   * Resposta padrão: { "status": "PROCESSING", "message": "Pagamento solicitado com sucesso" }
   */
  async requestPayout(user: User, amount: number, method: PaymentMethod, destination: PayoutDestination): Promise<{ success: boolean; status: WithdrawalStatus; message: string; request?: WithdrawalRequest }> {
    if (user.isMonetizationSuspended) {
      return { success: false, status: 'REJECTED', message: "Sua monetização está suspensa. Saques não são permitidos no momento." };
    }

    const available = user.availableBalance || 0;

    if (amount < MIN_WITHDRAWAL_AMOUNT) {
      return { success: false, status: 'REJECTED', message: `O valor mínimo para saque é R$ ${MIN_WITHDRAWAL_AMOUNT.toFixed(2)}.` };
    }

    if (amount > available) {
      return { success: false, status: 'REJECTED', message: "Saldo insuficiente para realizar esta operação." };
    }

    if (method === 'PIX' && !destination.pixKey) {
      return { success: false, status: 'REJECTED', message: "Chave PIX é obrigatória para este método." };
    }
    if (method === 'PayPal' && !destination.paypalEmail) {
      return { success: false, status: 'REJECTED', message: "Email do PayPal é obrigatório para este método." };
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const status: WithdrawalStatus = 'PROCESSING';
    const message = "Pagamento solicitado com sucesso";

    const newRequest: WithdrawalRequest = {
      id: `payout_${Date.now()}`,
      amount: amount,
      method: method,
      status: status,
      date: new Date().toISOString().split('T')[0],
      destination: destination
    };

    return {
      success: true,
      status: status,
      message: message,
      request: newRequest
    };
  },

  createMembershipTier(user: User, name: string, price: number, benefits: string[]): { sucesso: boolean; motivo?: string; tier?: MembershipTier } {
    if (user.isMonetizationSuspended) {
      return { sucesso: false, motivo: "Sua monetização está suspensa." };
    }
    const features = this.getUnlockedFeatures(user);
    if (!features.canEnrolMembership) {
      return { sucesso: false, motivo: "Mínimo de 1.000 seguidores para criar níveis de membros." };
    }
    const newTier: MembershipTier = {
      id: `tier_${Date.now()}`,
      name,
      price,
      benefits,
      subscriberCount: 0
    };
    return { sucesso: true, tier: newTier };
  },

  calculateMembershipPayout(amount: number): { valorFinal: number; taxa: number } {
    const taxa = parseFloat((amount * MEMBERSHIP_FEE_RATE).toFixed(2));
    const valorFinal = parseFloat((amount - taxa).toFixed(2));
    return { valorFinal, taxa };
  },

  calculateMonetization(post: Post, user: User): MonetizationResult {
    if (user.isMonetizationSuspended) {
      return { aprovado: false, motivo: "Conta suspensa administrativamente", totalGanho: 0 };
    }
    const features = this.getUnlockedFeatures(user);
    if (!features.canEnrolAds || post.type !== 'video') {
      return { aprovado: false, motivo: "Conta não qualificada para anúncios", totalGanho: 0 };
    }

    const MEDIA_VISUALIZACOES_NIVEL = { pequeno: 5000, medio: 50000, grande: 200000 };
    let nivel: CreatorTier = "pequeno";
    if (user.followers >= 100000) nivel = "grande";
    else if (user.followers >= 10000) nivel = "medio";

    const mediaNivel = MEDIA_VISUALIZACOES_NIVEL[nivel];
    const visualizacoes = post.views || 0;
    const ajustePerformance = visualizacoes / mediaNivel;
    
    const spots = [{pos: "in", val: VALOR_BASE_SPOT}, {pos: "out", val: VALOR_BASE_SPOT}];
    const total = spots.reduce((acc, s) => acc + (s.val * ajustePerformance), 0);

    return { aprovado: true, nivel, totalGanho: parseFloat(total.toFixed(2)) };
  },

  calculateUserImpact(user: User): ImpactResult {
    const revenue = user.totalRevenue || 0;
    return {
      reinvestment: revenue * 0.30,
      socialImpact: revenue * 0.10,
      founderIncome: revenue * 0.20,
      reserve: revenue * 0.40,
      totalValueGenerated: revenue,
      peopleReached: Math.floor(user.followers * 0.42), 
      ecoScore: Math.min(100, Math.floor((revenue * 0.5) + (user.followers / 200))),
      donations: impactRepository.getAll()
    };
  }
};
