
import { User, ImpactResult, SocialDonation, Post, MonetizationResult, CreatorTier, MembershipTier, WithdrawalRequest, PaymentMethod, WithdrawalStatus, PayoutDestination } from '../types';
import { impactRepository } from './impactRepository';

/**
 * Carlin Impact Engine v8.4 - Strategic Scale & Investor Logic
 */

const VALOR_BASE_SPOT = 0.50; 
const MEMBERSHIP_FEE_RATE = 0.05;
export const MIN_WITHDRAWAL_AMOUNT = 50.00;
export const LIVE_POINTS_CYCLE_SECONDS = 300; // 5 minutos
export const LIVE_POINTS_PER_CYCLE = 300;
export const MIN_POINTS_FOR_DONATION = 300;

// Constantes de Governança de Live
export const MAX_LIVE_BOOST_PERCENT = 30; // Teto de 30%
export const MAX_LIVE_POINTS_LIMIT = 9000; // 9.000 pontos = 30%

// Variáveis de Simulação v8.4
export const GROWTH_SIM_DEFAULTS = {
  viewersIniciais: 100,
  novosViewersPorMinuto: 10,
  tempoLiveMinutos: 60,
  cicloPontosMinutos: 5,
  boostPorCiclo: 1, // 1% por doação de 300 pontos
  tetoBoost: 30, // 30%
  taxaRetencaoBase: 0.40, // 40%
  cpmmedio: 8.50,
  livesPorMes: 20
};

export interface ScalingLogic {
  growthDrivers: string[];
  expectedOutcome: string;
}

export interface LivePointsStatus {
  userId: string;
  liveId: string;
  pointsAvailable: number;
  nextPointsIn: string;
  pointsPerCycle: number;
  canDonate: boolean;
  currentEngagementBoost: number;
  isBoostCapped: boolean; 
  fraudAlert?: string;
}

export interface AdsDistributionImpact {
  priorityLevel: "Normal" | "Elevada" | "Máxima";
  reachMultiplier: number;
  isAdsEligible: boolean;
  algorithmNote: string;
  apiPath: string;
  scalingLogic?: ScalingLogic; // V8.4 Investor Data
  estimatedMetrics?: {
    baseReach: number;
    finalReach: number;
    adsViews: number;
    donationsCount: number;
    revenue: {
      cpm: number;
      amount: number;
      currency: string;
    },
    monthlyProjection: {
      livesPerMonth: number;
      monthlyViews: number;
      yearlyViews: number;
      monetizationStatus: string;
    }
  };
}

export interface LiveAdsConfig {
  frequencyMinutes: number;
  allowedFormats: string[];
  experienceMode: "Standard" | "Optimized";
  retentionFocus: boolean;
}

export interface LiveStatusResponse {
  liveId: string;
  currentBoost: string;
  maxBoost: string;
  pointsReceived: number;
  boostActive: boolean;
  estimatedReachIncrease: "Nenhum" | "Baixo" | "Médio" | "Alto";
  viewerCount: number;
  isLive: boolean;
  monetization: {
    isAccelerated: boolean;
    tier: string;
    accelerationFactor: string;
  };
  adsImpact: AdsDistributionImpact;
  adsConfig: LiveAdsConfig;
  serverTimestamp: string;
  apiPath: string;
}

export interface DonateResponse {
  status: "SUCCESS" | "ERROR" | "CAPPED";
  boostApplied: string;     
  currentBoost: string;     
  boostRemaining: string;   
  message: string;
  _newBalance: number;
  _newBoost: number;
  monetizationImpact: string;
  acceleratedViews: number; 
  apiEndpoint: string;
}

export const impactService = {
  validateLiveSession(isForeground: boolean, isOnline: boolean): { safe: boolean; reason?: string } {
    if (!isOnline) return { safe: false, reason: "Conexão Offline: Acúmulo suspenso." };
    if (!isForeground) return { safe: false, reason: "Live em segundo plano: Acúmulo pausado." };
    return { safe: true };
  },

  calculateAdsConfig(boost: number): LiveAdsConfig {
    const isBoostAlto = boost >= 15;
    return {
      frequencyMinutes: isBoostAlto ? 10 : 5,
      allowedFormats: ["Banner discreto", "Overlay temporário", "Anúncio entre blocos"],
      experienceMode: isBoostAlto ? "Optimized" : "Standard",
      retentionFocus: isBoostAlto
    };
  },

  /**
   * GET /api/v1/live/{liveId}/ads/impact
   * V8.4: Implementação do Investor Takeaway Logic
   */
  async getAdsImpact(post: Post, user: User): Promise<AdsDistributionImpact> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const boostVal = Math.min(GROWTH_SIM_DEFAULTS.tetoBoost, post.liveEngagementBoost || 0);
    const boostApplied = boostVal / 100;
    const multiplier = 1 + boostApplied;
    
    const isEligible = (user.followers || 0) >= 1000 && (user.viewsLastYear || 0) >= 500000;
    
    let priority: "Normal" | "Elevada" | "Máxima" = "Normal";
    if (boostVal >= 20) priority = "Máxima";
    else if (boostVal >= 10) priority = "Elevada";

    const tempoLive = GROWTH_SIM_DEFAULTS.tempoLiveMinutos;
    const viewersIniciais = GROWTH_SIM_DEFAULTS.viewersIniciais;
    const novosViewersPorMinuto = GROWTH_SIM_DEFAULTS.novosViewersPorMinuto;
    
    const alcanceBase = viewersIniciais + (novosViewersPorMinuto * tempoLive);
    const alcanceFinal = Math.floor(alcanceBase * multiplier);
    const viewsAnuncios = Math.floor(alcanceFinal * GROWTH_SIM_DEFAULTS.taxaRetencaoBase);
    const cpm = GROWTH_SIM_DEFAULTS.cpmmedio;
    const receitaAds = (viewsAnuncios / 1000) * cpm;

    const livesPorMes = GROWTH_SIM_DEFAULTS.livesPorMes;
    const viewsMensais = livesPorMes * alcanceFinal;
    const views12Meses = viewsMensais * 12;
    
    let statusMonetizacao = "Meta de 500k views pendente";
    if (views12Meses >= 500000) statusMonetizacao = "Elegível para Ads (Previsão)";
    else if (views12Meses >= 200000) statusMonetizacao = "Próximo do limite de 500k views";

    // V8.4 Investor Takeaway Integration
    const scalingLogic: ScalingLogic = {
      growthDrivers: [
        "Tempo de permanência em live",
        "Gamificação com pontos",
        "Boost limitado e controlado",
        "Anúncios integrados ao engajamento real"
      ],
      expectedOutcome: "Crescimento orgânico sustentável e monetização previsível"
    };

    return {
      priorityLevel: priority,
      reachMultiplier: parseFloat(multiplier.toFixed(2)),
      isAdsEligible: isEligible,
      algorithmNote: isEligible 
        ? `Engajamento v8.4: Escala sustentável via drivers de retenção e gamificação.`
        : "Drivers de escala detectados. Aguardando volume crítico para ativação plena.",
      apiPath: `/api/v1/live/${post.id}/ads/impact`,
      scalingLogic,
      estimatedMetrics: {
        baseReach: alcanceBase,
        finalReach: alcanceFinal,
        adsViews: viewsAnuncios,
        donationsCount: boostVal,
        revenue: {
          cpm,
          amount: parseFloat(receitaAds.toFixed(2)),
          currency: "BRL"
        },
        monthlyProjection: {
          livesPerMonth: livesPorMes,
          monthlyViews: viewsMensais,
          yearlyViews: views12Meses,
          monetizationStatus: statusMonetizacao
        }
      }
    };
  },

  calculateAdsImpact(post: Post, user: User): AdsDistributionImpact {
    const boost = Math.min(MAX_LIVE_BOOST_PERCENT, post.liveEngagementBoost || 0);
    const multiplier = 1 + (boost / 100);
    const isEligible = user.followers >= 1000 && user.viewsLastYear >= 500000;
    
    let priority: "Normal" | "Elevada" | "Máxima" = "Normal";
    if (boost >= 20) priority = "Máxima";
    else if (boost >= 10) priority = "Elevada";

    return {
      priorityLevel: priority,
      reachMultiplier: parseFloat(multiplier.toFixed(2)),
      isAdsEligible: isEligible,
      algorithmNote: "Precision Engine Active.",
      apiPath: `/api/v1/live/${post.id}/ads/impact`
    };
  },

  async getLiveStatus(post: Post): Promise<LiveStatusResponse> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = JSON.parse(localStorage.getItem('carlin_id_local') || '{}') as User;
    
    const boostVal = post.liveEngagementBoost || 0;
    const isAccelerated = boostVal > 0;
    const adsImpact = this.calculateAdsImpact(post, user);
    const adsConfig = this.calculateAdsConfig(boostVal);
    
    let estimatedReach: "Nenhum" | "Baixo" | "Médio" | "Alto" = "Nenhum";
    if (boostVal >= 20) estimatedReach = "Alto";
    else if (boostVal >= 10) estimatedReach = "Médio";
    else if (boostVal > 0) estimatedReach = "Baixo";

    return {
      liveId: post.id,
      currentBoost: `${boostVal}%`,
      maxBoost: `${MAX_LIVE_BOOST_PERCENT}%`,
      pointsReceived: boostVal * 300,
      boostActive: isAccelerated,
      estimatedReachIncrease: estimatedReach,
      viewerCount: GROWTH_SIM_DEFAULTS.viewersIniciais + (boostVal * 15),
      isLive: true,
      monetization: {
        isAccelerated: isAccelerated,
        tier: boostVal > 15 ? "PREMIUM_BOOST" : isAccelerated ? "STARTER_BOOST" : "ORGANIC",
        accelerationFactor: boostVal > 15 ? "2.0x" : isAccelerated ? "1.5x" : "1.0x"
      },
      adsImpact,
      adsConfig,
      serverTimestamp: new Date().toISOString(),
      apiPath: `/api/v1/live/${post.id}/status`
    };
  },

  async getLivePointsStatus(user: User, post: Post, currentSeconds: number): Promise<LivePointsStatus> {
    const remainingSeconds = LIVE_POINTS_CYCLE_SECONDS - currentSeconds;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const nextPointsInStr = minutes > 0 ? `${minutes}m` : `${seconds}s`;
    const currentBoost = post.liveEngagementBoost || 0;

    return {
      userId: user.id,
      liveId: post.id,
      pointsAvailable: user.points || 0,
      nextPointsIn: nextPointsInStr,
      pointsPerCycle: LIVE_POINTS_PER_CYCLE,
      canDonate: (user.points || 0) >= MIN_POINTS_FOR_DONATION && currentBoost < MAX_LIVE_BOOST_PERCENT,
      currentEngagementBoost: currentBoost,
      isBoostCapped: currentBoost >= MAX_LIVE_BOOST_PERCENT
    };
  },

  async donatePointsToLive(user: User, post: Post, pointsToDonate: number): Promise<DonateResponse> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const userPoints = user.points || 0;
    const currentBoostVal = post.liveEngagementBoost || 0;
    const apiPath = `/api/v1/live/${post.id}/points/donate`;

    if (currentBoostVal >= MAX_LIVE_BOOST_PERCENT) {
      return {
        status: "CAPPED",
        boostApplied: "0%",
        currentBoost: `${currentBoostVal}%`,
        boostRemaining: "0%",
        message: "Teto de impulso atingido para esta live (30%).",
        _newBalance: userPoints,
        _newBoost: currentBoostVal,
        monetizationImpact: "Cap máximo atingido",
        acceleratedViews: 0,
        apiEndpoint: apiPath
      };
    }

    if (userPoints < pointsToDonate) {
      return { 
        status: "ERROR", 
        boostApplied: "0%",
        currentBoost: `${currentBoostVal}%`,
        boostRemaining: `${MAX_LIVE_BOOST_PERCENT - currentBoostVal}%`,
        message: "Saldo de pontos insuficiente no cofre.",
        _newBalance: userPoints,
        _newBoost: currentBoostVal,
        monetizationImpact: "Sem impacto",
        acceleratedViews: 0,
        apiEndpoint: apiPath
      };
    }

    const appliedBoost = Math.floor(pointsToDonate / 300);
    const updatedBoostVal = Math.min(MAX_LIVE_BOOST_PERCENT, currentBoostVal + appliedBoost);
    const viewsGenerated = appliedBoost * 150; 

    const updatedUser: User = { 
      ...user, 
      points: userPoints - pointsToDonate,
      boostedViews: (user.boostedViews || 0) + viewsGenerated,
      viewsLastYear: user.viewsLastYear + viewsGenerated
    };
    
    const updatedPost = { 
      ...post, 
      liveEngagementBoost: updatedBoostVal
    };
    
    localStorage.setItem('carlin_id_local', JSON.stringify(updatedUser));
    
    return {
      status: "SUCCESS",
      boostApplied: `${appliedBoost}%`,
      currentBoost: `${updatedBoostVal}%`,
      boostRemaining: `${MAX_LIVE_BOOST_PERCENT - updatedBoostVal}%`,
      message: "Pontos doados. Engajamento da live aumentado.",
      _newBalance: updatedUser.points,
      _newBoost: updatedPost.liveEngagementBoost,
      monetizationImpact: "Acelerando metas de anúncios",
      acceleratedViews: viewsGenerated,
      apiEndpoint: apiPath
    };
  },

  getUnlockedFeatures(user: User): { canPost: boolean; canLive: boolean; canSeeBasicAnalytics: boolean; canEnrolMembership: boolean; canEnrolAds: boolean; hasGrowthBadge: boolean; advancedEditing: boolean; } {
    if (user.isMonetizationSuspended) {
      return { canPost: true, canLive: false, canSeeBasicAnalytics: false, advancedEditing: false, hasGrowthBadge: false, canEnrolMembership: false, canEnrolAds: false };
    }
    const f = user.followers || 0;
    const v = user.viewsLastYear || 0;
    return { canPost: true, canLive: f >= 50, canSeeBasicAnalytics: f >= 50, advancedEditing: f >= 50, hasGrowthBadge: f >= 50 && f < 1000, canEnrolMembership: f >= 1000, canEnrolAds: f >= 1000 && v >= 500000 };
  },

  async suspendMonetization(user: User, reason: string): Promise<{ status: string; message: string; updatedUser: User }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const updatedUser: User = { ...user, isMonetizationSuspended: true, suspensionReason: reason };
    localStorage.setItem('carlin_id_local', JSON.stringify(updatedUser));
    return { status: "SUSPENDED", message: `Monetização suspensa. Motivo: ${reason}`, updatedUser };
  },

  async getPayoutHistory(user: User): Promise<{ payouts: WithdrawalRequest[] }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!user.withdrawalHistory || user.withdrawalHistory.length === 0) {
      return { payouts: [{ id: 'p1', date: '2026-02-01', amount: 500.00, method: 'PIX', status: 'PAID' }] };
    }
    return { payouts: user.withdrawalHistory };
  },

  async requestPayout(user: User, amount: number, method: PaymentMethod, destination: PayoutDestination): Promise<{ success: boolean; status: WithdrawalStatus; message: string; request?: WithdrawalRequest }> {
    if (user.isMonetizationSuspended) return { success: false, status: 'REJECTED', message: "Sua monetização está suspensa." };
    const available = user.availableBalance || 0;
    if (amount < MIN_WITHDRAWAL_AMOUNT) return { success: false, status: 'REJECTED', message: `Mínimo R$ ${MIN_WITHDRAWAL_AMOUNT.toFixed(2)}.` };
    if (amount > available) return { success: false, status: 'REJECTED', message: "Saldo insuficiente." };
    await new Promise(resolve => setTimeout(resolve, 1500));
    const status: WithdrawalStatus = 'PROCESSING';
    const newRequest: WithdrawalRequest = { id: `payout_${Date.now()}`, amount, method, status, date: new Date().toISOString().split('T')[0], destination };
    return { success: true, status, message: "Pagamento solicitado com sucesso", request: newRequest };
  },

  createMembershipTier(user: User, name: string, price: number, benefits: string[]): { sucesso: boolean; motivo?: string; tier?: MembershipTier } {
    if (user.isMonetizationSuspended) return { sucesso: false, motivo: "Sua monetização está suspensa." };
    const features = this.getUnlockedFeatures(user);
    if (!features.canEnrolMembership) return { sucesso: false, motivo: "Mínimo de 1.000 seguidores." };
    const newTier: MembershipTier = { id: `tier_${Date.now()}`, name, price, benefits, subscriberCount: 0 };
    return { sucesso: true, tier: newTier };
  },

  calculateMembershipPayout(amount: number): { valorFinal: number; taxa: number } {
    const taxa = parseFloat((amount * MEMBERSHIP_FEE_RATE).toFixed(2));
    const valorFinal = parseFloat((amount - taxa).toFixed(2));
    return { valorFinal, taxa };
  },

  calculateMonetization(post: Post, user: User): MonetizationResult {
    if (user.isMonetizationSuspended) return { aprovado: false, motivo: "Conta suspensa", totalGanho: 0 };
    const features = this.getUnlockedFeatures(user);
    if (!features.canEnrolAds || (post.type !== 'video' && post.type !== 'live')) return { aprovado: false, motivo: "Não qualificada", totalGanho: 0 };
    const MEDIA_VISUALIZACOES_NIVEL = { pequeno: 5000, medio: 50000, grande: 200000 };
    let nivel: CreatorTier = user.followers >= 100000 ? "grande" : (user.followers >= 10000 ? "medio" : "pequeno");
    const adjust = (post.views || 0) / MEDIA_VISUALIZACOES_NIVEL[nivel];
    const total = (VALOR_BASE_SPOT * 2) * adjust;
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
