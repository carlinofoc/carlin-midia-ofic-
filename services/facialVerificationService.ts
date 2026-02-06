
import { analyzeVerification } from './geminiService';

export type ServerVerificationResult = {
  success: boolean;
  livenessConfirmed: boolean;
  documentDetected: boolean;
  facialVector: number[];
  txId: string;
};

/**
 * Replicates Kotlin: object FacialVerificationManager
 * Centraliza o envio e processamento remoto de biometria.
 */
export const facialVerificationManager = {
  /**
   * Envia a selfie capturada em formato ByteArray (Uint8Array).
   * Replicates: fun sendSelfie(image: ByteArray)
   */
  async sendSelfie(image: Uint8Array): Promise<ServerVerificationResult> {
    console.log(`[CARLIN-HW] FacialVerificationManager: Comprimindo imagem (${image.length} bytes)...`);
    
    // Converte ByteArray de volta para base64 internamente para processamento no "servidor" (Gemini)
    const previewUrl = await new Promise<string>((resolve) => {
      const blob = new Blob([image], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    // O processamento ocorre no servidor (Simulado via IA Carlin)
    const result = await analyzeVerification(previewUrl);

    return {
      success: result.success,
      livenessConfirmed: result.livenessConfirmed,
      documentDetected: result.documentDetected,
      facialVector: result.facialVector,
      txId: `tx_bio_${Math.random().toString(36).substr(2, 9)}`
    };
  }
};
