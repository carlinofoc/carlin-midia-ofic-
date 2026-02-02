
import { User } from '../types';
// Updated generateJWT to generateSessionToken to match cryptoService.ts
import { encrypt, decrypt, generateIndividualKey, hashPassword, generateSessionToken } from './cryptoService';

/**
 * Database Service - Simulação de Mongoose/Backend
 */

export const dbService = {
  /**
   * Criar Usuário (simulando hook save do Mongoose)
   */
  async criarUsuario(nome: string, email: string, senhaRaw: string): Promise<User> {
    const individualKey = generateIndividualKey();
    const senha_hash = await hashPassword(senhaRaw);
    
    const nome_encrypted = await encrypt(nome, individualKey);
    const email_encrypted = await encrypt(email, individualKey);

    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: nome.toLowerCase().replace(/\s/g, '_'),
      displayName: nome,
      nome_encrypted,
      email_encrypted,
      passwordHash: senha_hash,
      chave: individualKey,
      avatar: 'assets/profile.png',
      followers: 0,
      following: 0,
      email: email,
    };

    return newUser;
  },

  /**
   * Rotacionar Chaves (rotacionarChave)
   */
  async rotacionarChave(user: User): Promise<User> {
    const novaChave = generateIndividualKey();
    
    // Descriptografar com chave antiga
    const nomeClaro = await decrypt(user.nome_encrypted, user.chave);
    const emailClaro = await decrypt(user.email_encrypted, user.chave);

    if (!nomeClaro || !emailClaro) throw new Error("Falha na decriptação para rotação.");

    // Re-encriptar com nova chave
    const novoNomeEnc = await encrypt(nomeClaro, novaChave);
    const novoEmailEnc = await encrypt(emailClaro, novaChave);

    return {
      ...user,
      nome_encrypted: novoNomeEnc,
      email_encrypted: novoEmailEnc,
      chave: novaChave
    };
  },

  /**
   * Verificar JWT (verificarJWT)
   */
  verificarToken(token: string): boolean {
    if (!token) return false;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      return true; // Simulação simplificada
    } catch {
      return false;
    }
  }
};
