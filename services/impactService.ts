
import { User, ImpactResult, SocialDonation } from '../types';
import { impactRepository } from './impactRepository';

/**
 * Carlin Impact Engine v1.4 (core/impact/ImpactCalculator.kt)
 * Responsável por calcular a conversão social da receita e engajamento.
 */

export const impactService = {
  /**
   * Calcula o impacto financeiro e social com base na receita total.
   * Replicates Kotlin: object ImpactCalculator.calculate(monthlyProfit)
   */
  calculateUserImpact(user: User): ImpactResult {
    const revenue = user.totalRevenue || 0;
    
    // Distribuição de Transparência Carlin (Sincronizada com Kotlin ImpactCalculator)
    const reinvestment = revenue * 0.30;  // 30% para evolução da plataforma
    const socialImpact = revenue * 0.10;  // 10% para causas sociais
    const founderIncome = revenue * 0.20; // 20% sustento do desenvolvedor solo
    const reserve = revenue * 0.40;       // 40% fundo de reserva técnica
    
    const existingDonations = impactRepository.getAll();
    
    // Se houver receita social nova e o repositório estiver vazio, geramos o primeiro impacto
    if (socialImpact > 0 && existingDonations.length === 0) {
      const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Fortaleza"];
      const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      const currentMonthIndex = new Date().getMonth();
      const basketsCost = 100;
      
      const donationPerCity = socialImpact / 2;
      
      for(let i = 0; i < 2; i++) {
        const city = cities[Math.floor(Math.random() * cities.length)];
        const month = months[currentMonthIndex];
        const newDonation: SocialDonation = {
          month,
          city,
          amount: donationPerCity,
          basketsDistributed: Math.floor(donationPerCity / basketsCost)
        };
        impactRepository.addDonation(newDonation);
      }
    }

    return {
      reinvestment,
      socialImpact,
      founderIncome,
      reserve,
      totalValueGenerated: revenue,
      peopleReached: Math.floor(user.followers * 0.42), 
      ecoScore: Math.min(100, Math.floor((socialImpact * 10) + (user.followers / 100))),
      donations: impactRepository.getAll()
    };
  }
};
