
import { SocialDonation } from '../types';

/**
 * Replicates Kotlin: object ImpactRepository
 * Gerenciador de persistência para o histórico de doações.
 */
class ImpactRepository {
  private donations: SocialDonation[] = [];

  /**
   * Adiciona uma nova doação ao histórico.
   * Replicates: fun addDonation(donation: SocialDonation)
   */
  public addDonation(donation: SocialDonation): void {
    this.donations.push(donation);
    // Persistência leve para manter o estado entre navegações
    localStorage.setItem('carlin_donations_history', JSON.stringify(this.donations));
  }

  /**
   * Retorna todas as doações registradas.
   * Replicates: fun getAll(): List<SocialDonation>
   */
  public getAll(): SocialDonation[] {
    if (this.donations.length === 0) {
      const saved = localStorage.getItem('carlin_donations_history');
      if (saved) {
        this.donations = JSON.parse(saved);
      }
    }
    return [...this.donations];
  }
}

export const impactRepository = new ImpactRepository();
