
import { User } from '../types';
import { 
  encrypt, 
  decrypt, 
  generateMasterKey, 
  hashPassword, 
  generateSessionToken,
} from './cryptoService';

/**
 * Database & Identity Orchestrator v5.2
 * Managing local identities and encrypted vaults.
 */

export const dbService = {
  verificarIdentidadeLocal(): User | null {
    const saved = localStorage.getItem('carlin_id_local');
    return saved ? JSON.parse(saved) : null;
  },

  isIdentidadeRegistradaNoBackend(): boolean {
    return localStorage.getItem('carlin_id_synced') === 'true';
  },

  /**
   * Flow: New Device -> Create Identity -> Register Backend -> Link Master Key
   */
  async criarIdentidade(nome: string, email: string, passwordRaw: string): Promise<User> {
    // 1. Generate 256-bit Master Key
    const masterKey = generateMasterKey();
    const pwHash = await hashPassword(passwordRaw);
    
    // 2. Encrypt Identity Fields with Master Key (Envelope Encryption)
    const nome_encrypted = await encrypt(nome, masterKey);
    const email_encrypted = await encrypt(email, masterKey);

    const newUser: User = {
      id: `carlin_usr_${crypto.randomUUID().slice(0, 8)}`,
      username: nome.toLowerCase().replace(/\s/g, '.'),
      displayName: nome,
      nome_encrypted,
      email_encrypted,
      passwordHash: pwHash,
      chave: masterKey, 
      avatar: `https://picsum.photos/seed/${nome}/200/200`,
      followers: 0,
      following: 0,
      email: email,
      interests: [],
      viewedContent: [],
    };

    localStorage.setItem('carlin_id_local', JSON.stringify(newUser));
    return newUser;
  },

  async registrarNoBackend(user: User): Promise<void> {
    return new Promise((resolve) => {
      // Simulate backend registration handshake
      setTimeout(() => {
        localStorage.setItem('carlin_id_synced', 'true');
        console.log(`[Carlin] Device ${user.id} registered on cloud.`);
        resolve();
      }, 1500);
    });
  },

  /**
   * Rotation Logic: Re-encrypt all fields with a new Master Key
   */
  async rotacionarChave(user: User): Promise<User> {
    const newMK = generateMasterKey();
    
    // Decrypt fields with old key
    const nome = await decrypt(user.nome_encrypted, user.chave);
    const email = await decrypt(user.email_encrypted, user.chave);

    if (!nome || !email) throw new Error("Vault corruption detected during rotation.");

    // Re-encrypt fields with new key
    const newNomeEnc = await encrypt(nome, newMK);
    const newEmailEnc = await encrypt(email, newMK);

    const updatedUser = {
      ...user,
      nome_encrypted: newNomeEnc,
      email_encrypted: newEmailEnc,
      chave: newMK
    };

    localStorage.setItem('carlin_id_local', JSON.stringify(updatedUser));
    return updatedUser;
  }
};
