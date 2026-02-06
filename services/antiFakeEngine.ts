
/**
 * Replicates Kotlin: object AntiFakeEngine
 */
export const antiFakeEngine = {
  /**
   * Verifica se a similaridade atinge o limiar crítico.
   * Replicates: fun checkSimilarity(similarity: Double): Boolean
   */
  checkSimilarity(similarity: number): boolean {
    return similarity >= 0.95;
  },

  /**
   * Retorna a mensagem de alerta padrão para detecção de duplicatas.
   * Replicates: fun alertMessage(): String
   */
  alertMessage(): string {
    return "Detectamos um perfil possivelmente usando sua identidade. Deseja revisar?";
  }
};
