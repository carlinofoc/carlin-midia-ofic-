import { User, ImpactResult, SocialDonation, Post, MonetizationResult, CreatorTier, MembershipTier, WithdrawalRequest, PaymentMethod, WithdrawalStatus, PayoutDestination, MonetizationLevel, CreatorBenefits, CreatorDashboardSnapshot, MonthlyCreatorStats, ViewPattern, EngagementPattern, TrustDetails } from '../types';
import { impactRepository } from './impactRepository';

/**
 * Carlin Impact Engine v10.0.3 - Strict Engagement Validation
 */

const VALOR_BASE_SPOT = 0.50; 
const MEMBERSHIP_FEE_RATE = 0.05;
export const MIN_WITHDRAWAL_AMOUNT = 50.00;
export const LIVE_POINTS_CYCLE_SECONDS = 300; 
export const LIVE_POINTS_PER_CYCLE = 300;
export const MIN_POINTS_FOR_DONATION = 300;

export const MAX_LIVE_BOOST_PERCENT = 30; 
export const MAX_LIVE_POINTS_LIMIT = 9000; 

export const GROWTH_SIM_DEFAULTS = {
  viewersIniciais: 100,
  novosViewersPorMinuto: 10,
  tempoLiveMinutos: 60,
  cicloPontosMinutos: 5,
  boostPorCiclo: 1, 
  tetoBoost: 30, 
  taxaRetencaoBase: 0.40, 
  cpmmedio: 8.50,
  livesPorMes: 20
};

export interface CreatorGrowthProjection {
  currentStatus: string;
  daysToMonetization: number;
  estimatedFollowers12m: number;
  monthlyRevenuePotential: number;
  scalingEfficiency: number; 
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
}

export interface AdsDistributionImpact {
  priorityLevel: "Normal" | "Elevada" | "Máxima";
  reachMultiplier: number;
  isAdsEligible: boolean;
  algorithmNote: string;
  apiPath: string;
  scalingLogic?: {
    growthDrivers: string[];
    expectedOutcome: string;
  };
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

export const impactService = {
  /**
   * REPLICATED FROM PYTHON: def is_creator_eligible(creator: Creator) -> bool
   * Update: Bypass for developer account 'CarlinOficial'
   */
  isCreatorEligible(user: User): boolean {
    if (user.username === 'CarlinOficial' || user.profileType === 'developer') return true;
    const followers = user.followers || 0;
    const accountActive = user.isActive !== false && !user.isMonetizationSuspended;
    return followers >= 1000 && accountActive;
  },

  /**
   * REPLICATED FROM PYTHON: def get_monetization_level(creator: Creator) -> str
   */
  getMonetizationLevel(user: User): MonetizationLevel {
    if (user.username === 'CarlinOficial' || user.profileType === 'developer') return "FULL_MONETIZATION";
    
    if (!this.isCreatorEligible(user)) {
      return "NOT_ELIGIBLE";
    }

    const totalViews = user.viewsLastYear || 0;

    if (totalViews < 100000) {
      return "CREATOR_PROGRAM";
    }

    if (totalViews >= 100000 && totalViews < 300000) {
      return "PARTIAL_MONETIZATION";
    }

    if (totalViews >= 300000 && totalViews < 500000) {
      return "ADVANCED_PARTIAL_MONETIZATION";
    }

    const firstView = user.firstViewDate ? new Date(user.firstViewDate) : new Date();
    const deadline = new Date(firstView);
    deadline.setFullYear(deadline.getFullYear() + 1);
    
    if (totalViews >= 500000 && new Date() <= deadline) {
      return "FULL_MONETIZATION";
    }

    return "PARTIAL_MONETIZATION";
  },

  /**
   * REPLICATED FROM PYTHON: def calculate_total_views(videos_views, live_views)
   */
  calculateTotalViews(videosViews: number, liveViews: number): number {
    return videosViews + liveViews;
  },

  /**
   * REPLICATED FROM PYTHON: def calculate_creator_revenue(platform_revenue, creator_share_percentage)
   */
  calculateCreatorRevenue(platformRevenue: number, creatorSharePercentage: number): number {
    return (platformRevenue * creatorSharePercentage) / 100;
  },

  /**
   * REPLICATED FROM PYTHON: def apply_engagement_bonus(base_revenue, bonus)
   */
  applyEngagementBonus(baseRevenue: number, bonus: number): number {
    return baseRevenue * (1 + bonus);
  },

  /**
   * REPLICATED FROM PYTHON: def calculate_trust_score(view_pattern, engagement_pattern)
   */
  calculateTrustScore(viewPattern: ViewPattern, engagementPattern: EngagementPattern): number {
    let score = 1.0;

    if (viewPattern.is_spike) {
      score -= 0.3;
    }

    if (engagementPattern.too_concentrated) {
      score -= 0.2;
    }

    if (engagementPattern.repeated_accounts) {
      score -= 0.3;
    }

    if (engagementPattern.low_retention) {
      score -= 0.2;
    }

    return Math.max(score, 0);
  },

  /**
   * REPLICATED FROM PYTHON: def validate_engagement(trust_score)
   * Precisely follows the thresholds: 0.7 -> VALID, 0.4 -> PARTIAL, else INVALID.
   */
  validateEngagement(trustScore: number): 'VALID' | 'PARTIAL' | 'INVALID' {
    if (trustScore >= 0.7) {
      return "VALID";
    } else if (trustScore >= 0.4) {
      return "PARTIAL";
    } else {
      return "INVALID";
    }
  },

  /**
   * REPLICATED FROM PYTHON: def generate_creator_dashboard(creator, platform_revenue, creator_share)
   */
  generateCreatorDashboard(user: User, platformRevenue: number, creatorShare: number): CreatorDashboardSnapshot {
    const level = this.getMonetizationLevel(user);
    const followers = user.followers || 0;
    const totalViews = user.viewsLastYear || 0;

    let nextGoal = "";
    let progress = 0;
    let remaining = 0;
    let goalUnit = "";

    if (user.username === 'CarlinOficial' || user.profileType === 'developer') {
      nextGoal = "Conta de Autoridade Ativa";
      progress = 0; // Exibir 0 para estética Clean UI absoluta
      remaining = 0;
    } else if (followers < 1000) {
      nextGoal = "Alcançar 1.000 seguidores";
      progress = (followers / 1000) * 100;
      remaining = 1000 - followers;
      goalUnit = "seguidores";
    } else if (totalViews < 100000) {
      nextGoal = "Alcançar 100.000 visualizações";
      progress = (totalViews / 100000) * 100;
      remaining = 100000 - totalViews;
      goalUnit = "visualizações";
    } else if (totalViews < 300000) {
      nextGoal = "Alcançar 300.000 visualizações";
      progress = (totalViews / 300000) * 100;
      remaining = 300000 - totalViews;
      goalUnit = "visualizações";
    } else if (totalViews < 500000) {
      nextGoal = "Alcançar 500.000 visualizações em até 12 meses";
      progress = (totalViews / 500000) * 100;
      remaining = 500000 - totalViews;
      goalUnit = "visualizações";
    } else {
      nextGoal = "Monetização total alcançada 🎉";
      progress = 100;
      remaining = 0;
      goalUnit = "";
    }

    let estimatedRevenue = 0;
    if (user.username !== 'CarlinOficial' && user.profileType !== 'developer' && ["PARTIAL_MONETIZATION", "ADVANCED_PARTIAL_MONETIZATION", "FULL_MONETIZATION"].includes(level)) {
      const baseRevenue = this.calculateCreatorRevenue(platformRevenue, creatorShare);
      const bonus = this.calculateEngagementBonus(user.points || 0);
      estimatedRevenue = this.applyEngagementBonus(baseRevenue, bonus);
    }

    // Trust Scoring Simulation
    const simulatedViewPattern: ViewPattern = { is_spike: followers < 100 && totalViews > 50000 && user.username !== 'CarlinOficial' };
    const simulatedEngPattern: EngagementPattern = { 
      too_concentrated: false, 
      repeated_accounts: (user.points || 0) > 8500, 
      low_retention: followers > 0 && totalViews / followers < 2 
    };

    const trustScore = (user.username === 'CarlinOficial' || user.profileType === 'developer') ? 1.0 : this.calculateTrustScore(simulatedViewPattern, simulatedEngPattern);
    const engagementStatus = this.validateEngagement(trustScore);

    return {
      creator_id: user.id,
      followers: followers,
      total_views: totalViews,
      views_last_12_months: totalViews,
      monetization_level: level,
      estimated_revenue: parseFloat(estimatedRevenue.toFixed(2)),
      next_goal: nextGoal,
      remaining_to_goal: remaining,
      goal_unit: goalUnit,
      progress_percentage: parseFloat(progress.toFixed(2)),
      trust_score: trustScore,
      engagement_status: engagementStatus,
      trust_details: {
        view_pattern: simulatedViewPattern,
        engagement_pattern: simulatedEngPattern
      },
      last_update: new Date().toISOString()
    };
  },

  /**
   * REPLICATED FROM PYTHON: def generate_monthly_stats(creator, views_this_month, platform_revenue, creator_share)
   */
  generateMonthlyStats(user: User, viewsThisMonth: number, platformRevenue: number, creatorShare: number): MonthlyCreatorStats {
    const level = this.getMonetizationLevel(user);

    let estimatedRevenue = 0;
    if (user.username !== 'CarlinOficial' && user.profileType !== 'developer' && ["PARTIAL_MONETIZATION", "ADVANCED_PARTIAL_MONETIZATION", "FULL_MONETIZATION"].includes(level)) {
      const baseRevenue = this.calculateCreatorRevenue(platformRevenue, creatorShare);
      const bonus = this.calculateEngagementBonus(user.points || 0);
      estimatedRevenue = this.applyEngagementBonus(baseRevenue, bonus);
    }

    const now = new Date();

    return {
      creator_id: user.id,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      followers: user.followers || 0,
      views_in_month: viewsThisMonth,
      total_views: user.viewsLastYear || 0,
      monetization_level: level,
      estimated_revenue: parseFloat(estimatedRevenue.toFixed(2)),
      created_at: now.toISOString()
    };
  },

  /**
   * REPLICATED FROM PYTHON: def monthly_stats_to_json(stats: MonthlyCreatorStats)
   */
  monthlyStatsToJSON(stats: MonthlyCreatorStats) {
    return {
      "year": stats.year,
      "month": stats.month,
      "followers": stats.followers,
      "views_in_month": stats.views_in_month,
      "total_views": stats.total_views,
      "monetization_level": stats.monetization_level,
      "estimated_revenue": stats.estimated_revenue,
      "generated_at": stats.created_at, 
      "disclaimer": "Valores estimados. Sem garantia de renda."
    };
  },

  /**
   * REPLICATED FROM PYTHON: def save_monthly_stats(monthly_stats: MonthlyCreatorStats)
   */
  saveMonthlyStats(monthly_stats: MonthlyCreatorStats): void {
    impactRepository.saveMonthlyStat(monthly_stats);
  },

  /**
   * REPLICATED FROM PYTHON: class MonthlyCreatorStats implementation
   */
  getMonthlyStats(user: User): MonthlyCreatorStats[] {
    const userStats = impactRepository.getCreatorMonthlyHistory(user.id);
    
    if (userStats.length > 0) {
      return userStats;
    }

    if (user.username === 'CarlinOficial' || user.profileType === 'developer') return []; // Histórico zerado para dev

    // Fallback: Generate and save mock historical data if none exists
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const generated: MonthlyCreatorStats[] = [];

    for (let i = 0; i < 6; i++) {
      let m = currentMonth - i;
      let y = currentYear;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }

      const factor = 1 - (i * 0.1);
      const viewsInMonth = Math.floor(15000 * factor);
      const totalViewsAtPoint = Math.max(0, user.viewsLastYear - (i * 15000));
      const followersAtPoint = Math.max(0, user.followers - (i * 50));
      
      const tempUser = { ...user, viewsLastYear: totalViewsAtPoint, followers: followersAtPoint };
      const levelAtPoint = this.getMonetizationLevel(tempUser);
      const benefitsAtPoint = this.getCreatorBenefits(levelAtPoint);
      const creatorShare = benefitsAtPoint.revenue_share_percentage || 0;
      const platformRevAtPoint = 150000 * (1 - (i * 0.05));

      const snapshot = this.generateMonthlyStats(tempUser, viewsInMonth, platformRevAtPoint, creatorShare);
      snapshot.year = y;
      snapshot.month = m;
      snapshot.created_at = new Date(y, m - 1, 28).toISOString();

      this.saveMonthlyStats(snapshot);
      generated.push(snapshot);
    }

    return generated;
  },

  /**
   * REPLICATED FROM PYTHON: def dashboard_to_json(dashboard: CreatorDashboard)
   */
  dashboardToJSON(dashboard: CreatorDashboardSnapshot): CreatorDashboardSnapshot {
    return {
      ...dashboard,
      disclaimer: "Valores estimados. A monetização depende do faturamento da plataforma."
    };
  },

  getCreatorBenefits(level: MonetizationLevel): CreatorBenefits {
    const benefits: Record<MonetizationLevel, CreatorBenefits> = {
      "NOT_ELIGIBLE": {
        message: "Atinga 1.000 seguidores para entrar no Programa de Criadores.",
        badge: false,
        highlight: false,
        revenue_share: false,
        bonus: false,
        revenue_share_percentage: 0
      },
      "CREATOR_PROGRAM": {
        badge: true,
        highlight: true,
        revenue_share: false,
        bonus: false,
        revenue_share_percentage: 5
      },
      "PARTIAL_MONETIZATION": {
        badge: true,
        highlight: true,
        revenue_share: true,
        bonus: false,
        revenue_share_percentage: 20
      },
      "ADVANCED_PARTIAL_MONETIZATION": {
        badge: true,
        highlight: true,
        revenue_share: true,
        bonus: true,
        revenue_share_percentage: 35
      },
      "FULL_MONETIZATION": {
        badge: true,
        highlight: true,
        revenue_share: true,
        bonus: true,
        priority_campaigns: true,
        revenue_share_percentage: 50
      }
    };

    return benefits[level] || benefits["NOT_ELIGIBLE"];
  },

  calculateCreatorProjection(user: User): CreatorGrowthProjection {
    const currentViews = user.viewsLastYear || 0;
    const currentFollowers = user.followers || 0;
    const targetViews = 500000;
    const monthlyGrowthRate = (user.username === 'CarlinOficial' || user.profileType === 'developer') ? 0 : 17500; 
    const remainingViews = Math.max(0, targetViews - currentViews);
    const monthsToGoal = monthlyGrowthRate > 0 ? remainingViews / monthlyGrowthRate : 0;
    
    return {
      currentStatus: user.isMonetizationSuspended ? "Suspenso" : ((user.username === 'CarlinOficial' || user.profileType === 'developer') ? "Autoridade Ativa" : (currentViews >= targetViews ? "Monetizado" : "Em Escala")),
      daysToMonetization: Math.ceil(monthsToGoal * 30),
      estimatedFollowers12m: 0,
      monthlyRevenuePotential: (monthlyGrowthRate / 1000) * GROWTH_SIM_DEFAULTS.cpmmedio,
      scalingEfficiency: (user.username === 'CarlinOficial' || user.profileType === 'developer') ? 0 : (currentFollowers > 0 ? Math.min(100, Math.floor((currentViews / Math.max(1, currentFollowers)) * 10)) : 0)
    };
  },

  validateLiveSession(isForeground: boolean, isOnline: boolean): { safe: boolean; reason?: string } {
    if (!isOnline) return { safe: false, reason: "Offline: Acúmulo suspenso." };
    if (!isForeground) return { safe: false, reason: "Em background: Pausado." };
    return { safe: true };
  },

  calculateAdsConfig(boost: number): LiveAdsConfig {
    const isBoostAlto = boost >= 15;
    return {
      frequencyMinutes: isBoostAlto ? 10 : 5,
      allowedFormats: ["Banner", "Overlay"],
      experienceMode: isBoostAlto ? "Optimized" : "Standard",
      retentionFocus: isBoostAlto
    };
  },

  async getAdsImpact(post: Post, user: User): Promise<AdsDistributionImpact> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const boostVal = Math.min(GROWTH_SIM_DEFAULTS.tetoBoost, post.liveEngagementBoost || 0);
    const multiplier = 1 + (boostVal / 100);
    const isEligible = this.isCreatorEligible(user) && (user.viewsLastYear || 0) >= 500000;
    
    let priority: "Normal" | "Elevada" | "Máxima" = "Normal";
    if (boostVal >= 20) priority = "Máxima";
    else if (boostVal >= 10) priority = "Elevada";

    const baseReach = (user.username === 'CarlinOficial' || user.profileType === 'developer') ? 0 : (GROWTH_SIM_DEFAULTS.viewersIniciais + (GROWTH_SIM_DEFAULTS.novosViewersPorMinuto * GROWTH_SIM_DEFAULTS.tempoLiveMinutos));
    const finalReach = Math.floor(baseReach * multiplier);
    const revenue = (finalReach / 1000) * GROWTH_SIM_DEFAULTS.cpmmedio;

    return {
      priorityLevel: priority,
      reachMultiplier: multiplier,
      isAdsEligible: isEligible,
      algorithmNote: "Precision Engine Active v9.9",
      apiPath: `/api/v1/live/${post.id}/ads/impact`,
      scalingLogic: {
        growthDrivers: ["Active Community", "Retention Strategy", "Ethical Content"],
        expectedOutcome: boostVal >= 15 ? "Optimized distribution for high-value targets." : "Standard organic-first reach."
      },
      estimatedMetrics: {
        baseReach,
        finalReach,
        adsViews: Math.floor(finalReach * 0.4),
        donationsCount: boostVal,
        revenue: { cpm: GROWTH_SIM_DEFAULTS.cpmmedio, amount: revenue, currency: "BRL" },
        monthlyProjection: {
          livesPerMonth: 20,
          monthlyViews: finalReach * 20,
          yearlyViews: finalReach * 20 * 12,
          monetizationStatus: isEligible ? "Ativa" : "Pendente"
        }
      }
    };
  },

  calculateAdsImpact(post: Post, user: User): AdsDistributionImpact {
    const boost = Math.min(MAX_LIVE_BOOST_PERCENT, post.liveEngagementBoost || 0);
    const multiplier = 1 + (boost / 100);
    let priority: "Normal" | "Elevada" | "Máxima" = "Normal";
    if (boost >= 20) priority = "Máxima";
    else if (boost >= 10) priority = "Elevada";

    return {
      priorityLevel: priority,
      reachMultiplier: multiplier,
      isAdsEligible: this.isCreatorEligible(user),
      algorithmNote: "Precision Engine Active.",
      apiPath: `/api/v1/live/${post.id}/ads/impact`
    };
  },

  async getLiveStatus(post: Post): Promise<LiveStatusResponse> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const user = JSON.parse(localStorage.getItem('carlin_id_local') || '{}') as User;
    const boostVal = post.liveEngagementBoost || 0;
    return {
      liveId: post.id,
      currentBoost: `${boostVal}%`,
      maxBoost: `${MAX_LIVE_BOOST_PERCENT}%`,
      pointsReceived: boostVal * 300,
      boostActive: boostVal > 0,
      estimatedReachIncrease: boostVal >= 20 ? "Alto" : "Médio",
      viewerCount: 1200 + (boostVal * 15),
      isLive: true,
      monetization: {
        isAccelerated: boostVal > 0,
        tier: boostVal > 15 ? "PREMIUM" : "STARTER",
        accelerationFactor: boostVal > 15 ? "2.0x" : "1.0x"
      },
      adsImpact: this.calculateAdsImpact(post, user),
      adsConfig: this.calculateAdsConfig(boostVal),
      serverTimestamp: new Date().toISOString(),
      apiPath: `/api/v1/live/${post.id}/status`
    };
  },

  async getLivePointsStatus(user: User, post: Post, currentSeconds: number): Promise<LivePointsStatus> {
    const remaining = LIVE_POINTS_CYCLE_SECONDS - currentSeconds;
    const currentBoost = post.liveEngagementBoost || 0;
    return {
      userId: user.id,
      liveId: post.id,
      pointsAvailable: user.points || 0,
      nextPointsIn: `${Math.floor(remaining / 60)}m`,
      pointsPerCycle: LIVE_POINTS_PER_CYCLE,
      canDonate: (user.points || 0) >= MIN_POINTS_FOR_DONATION && currentBoost < MAX_LIVE_BOOST_PERCENT,
      currentEngagementBoost: currentBoost,
      isBoostCapped: currentBoost >= MAX_LIVE_BOOST_PERCENT
    };
  },

  /**
   * REPLICATED FROM PYTHON: def calculate_engagement_bonus(points: int) -> float
   */
  calculateEngagementBonus(points: number): number {
    let bonusPercentage = Math.floor(points / 300);
    if (bonusPercentage > 30) {
      bonusPercentage = 30;
    }
    return bonusPercentage / 100; 
  },

  /**
   * Replicates Scale: 300 points = +1% boost. Max 30%.
   */
  async donatePointsToLive(user: User, post: Post, points: number) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentBoost = post.liveEngagementBoost || 0;
    const requestedBoost = Math.floor(points / 300);
    
    const roomLeft = MAX_LIVE_BOOST_PERCENT - currentBoost;
    
    if (roomLeft <= 0) {
      return { status: "CAPPED", message: "Limite de impulso de 30% já atingido para esta live." };
    }
    
    const actualBoostApplied = Math.min(requestedBoost, roomLeft);
    const actualPointsConsumed = actualBoostApplied * 300;
    const newBoost = currentBoost + actualBoostApplied;
    
    return {
      status: "SUCCESS",
      boostApplied: `${actualBoostApplied}%`,
      currentBoost: `${newBoost}%`,
      pointsConsumed: actualPointsConsumed,
      _newBalance: (user.points || 0) - actualPointsConsumed,
      _newBoost: newBoost,
      acceleratedViews: actualBoostApplied * 150,
      message: "Sucesso"
    };
  },

  getUnlockedFeatures(user: User) {
    if (user.username === 'CarlinOficial' || user.profileType === 'developer') {
      return { 
        canPost: true, 
        canLive: true, 
        canSeeBasicAnalytics: true, 
        advancedEditing: true, 
        hasGrowthBadge: false, 
        canEnrolMembership: true, 
        canEnrolAds: true 
      };
    }
    const followers = user.followers || 0;
    const isEligible = this.isCreatorEligible(user);
    const level = this.getMonetizationLevel(user);
    return { 
      canPost: true, 
      canLive: followers >= 50, 
      canSeeBasicAnalytics: followers >= 50, 
      advancedEditing: followers >= 50, 
      hasGrowthBadge: followers >= 50 && followers < 1000, 
      canEnrolMembership: isEligible, 
      canEnrolAds: level === 'FULL_MONETIZATION' || level === 'ADVANCED_PARTIAL_MONETIZATION' 
    };
  },

  async suspendMonetization(user: User, reason: string) {
    const updatedUser = { ...user, isMonetizationSuspended: true, suspensionReason: reason, isActive: false };
    localStorage.setItem('carlin_id_local', JSON.stringify(updatedUser));
    return { status: "SUSPENDED", message: `Suspensa: ${reason}`, updatedUser };
  },

  async getPayoutHistory(user: User) { return { payouts: user.withdrawalHistory || [] }; },

  async requestPayout(user: User, amount: number, method: PaymentMethod, dest: PayoutDestination) {
    if (user.isMonetizationSuspended) return { success: false, status: 'REJECTED', message: "Monetização suspensa." };
    if (amount < MIN_WITHDRAWAL_AMOUNT) return { success: false, status: 'REJECTED', message: `Mínimo R$ ${MIN_WITHDRAWAL_AMOUNT}.` };
    const req: WithdrawalRequest = { id: `p_${Date.now()}`, amount, method, status: 'PROCESSING', date: new Date().toISOString().split('T')[0], destination: dest };
    return { success: true, status: 'PROCESSING', message: "Sucesso", request: req };
  },

  createMembershipTier(user: User, name: string, price: number, benefits: string[]) {
    if (!name) return { sucesso: false, motivo: "Nome obrigatório." };
    const tier: MembershipTier = { id: `t_${Date.now()}`, name, price, benefits, subscriberCount: 0 };
    return { sucesso: true, tier };
  },

  calculateMembershipPayout(amount: number) {
    const taxa = amount * MEMBERSHIP_FEE_RATE;
    return { valorFinal: amount - taxa, taxa };
  },

  /**
   * REPLICATED FROM PYTHON: Synchronized with engagement_bonus logic
   */
  calculateMonetization(post: Post, user: User): MonetizationResult {
    const features = this.getUnlockedFeatures(user);
    if (user.isMonetizationSuspended || !features.canEnrolAds) return { aprovado: false, totalGanho: 0 };
    
    // Base revenue calculation
    const baseTotal = 1.0 * ((post.views || 0) / 10000);
    
    // Apply Engagement Bonus Logic from Python Snippet
    const engagementBonus = this.calculateEngagementBonus(user.points || 0);
    const finalRevenue = this.applyEngagementBonus(baseTotal, engagementBonus);
    
    return { 
      aprovado: true, 
      totalGanho: parseFloat(finalRevenue.toFixed(2)) 
    };
  },

  calculateUserImpact(user: User): ImpactResult {
    const revenue = user.totalRevenue || 0;
    return { 
      reinvestment: revenue * 0.3, socialImpact: revenue * 0.1, founderIncome: revenue * 0.2, reserve: revenue * 0.4, 
      totalValueGenerated: revenue, peopleReached: 0, ecoScore: (user.username === 'CarlinOficial' || user.profileType === 'developer') ? 0 : Math.min(100, Math.floor(revenue * 0.5)), 
      donations: impactRepository.getAll() 
    };
  }
};