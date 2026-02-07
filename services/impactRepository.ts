import { SocialDonation, MonthlyCreatorStats } from '../types';

/**
 * Carlin Impact Repository v1.3
 * Gerencia a persistência local para doações e histórico de performance do criador.
 */
class ImpactRepository {
  private donations: SocialDonation[] = [];
  private monthlyHistoryDB: MonthlyCreatorStats[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const savedDonations = localStorage.getItem('carlin_donations_history');
    if (savedDonations) {
      this.donations = JSON.parse(savedDonations);
    }

    const savedHistory = localStorage.getItem('carlin_monthly_history_db');
    if (savedHistory) {
      this.monthlyHistoryDB = JSON.parse(savedHistory);
    }
  }

  /**
   * REPLICATED FROM PYTHON: monthly_history_db.append(monthly_stats)
   */
  public saveMonthlyStat(stat: MonthlyCreatorStats): void {
    this.monthlyHistoryDB.push(stat);
    localStorage.setItem('carlin_monthly_history_db', JSON.stringify(this.monthlyHistoryDB));
  }

  /**
   * REPLICATED FROM PYTHON: def get_creator_monthly_history(creator_id)
   */
  public getCreatorMonthlyHistory(creatorId: string): MonthlyCreatorStats[] {
    return this.monthlyHistoryDB.filter(stats => stats.creator_id === creatorId);
  }

  /**
   * Retorna o histórico completo de performance (todas as entradas).
   */
  public getMonthlyHistory(): MonthlyCreatorStats[] {
    return [...this.monthlyHistoryDB];
  }

  /**
   * Adiciona uma nova doação ao histórico.
   */
  public addDonation(donation: SocialDonation): void {
    this.donations.push(donation);
    localStorage.setItem('carlin_donations_history', JSON.stringify(this.donations));
  }

  /**
   * Retorna todas as doações registradas.
   */
  public getAll(): SocialDonation[] {
    return [...this.donations];
  }
}

export const impactRepository = new ImpactRepository();