
/**
 * Replicates Kotlin: object ConsentManager
 */
export const consentService = {
  /**
   * Valida se o consentimento foi aceito.
   * @throws Error se o consentimento não for aceito.
   */
  validate(consentAccepted: boolean): void {
    if (!consentAccepted) {
      // Replicates: throw IllegalStateException("Consentimento obrigatório para verificação facial")
      throw new Error("Consentimento obrigatório para verificação facial");
    }
  }
};
