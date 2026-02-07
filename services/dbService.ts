
import { User, ProfileLink, VerificationLevel } from '../types';
import { 
  encrypt, 
  decrypt, 
  generateMasterKey, 
  hashPassword, 
  generateSessionToken,
} from './cryptoService';
import { antiFakeEngine } from './antiFakeEngine';

export type SecurityStatus = 'OK' | 'FAKE_PROFILE' | 'IDENTITY_THEFT' | 'SIMILARITY_DETECTED';

export const dbService = {
  verificarIdentidadeLocal(): User | null {
    const saved = localStorage.getItem('carlin_id_local');
    return saved ? JSON.parse(saved) : null;
  },

  isIdentidadeRegistradaNoBackend(): boolean {
    return localStorage.getItem('carlin_id_synced') === 'true';
  },

  /**
   * Replicates: function checkDuplicate(vector)
   * Usa o AntiFakeEngine para validar similaridade técnica.
   */
  async verificarDuplicata(biometricHash: string): Promise<{ status: SecurityStatus, originalUserId?: string }> {
    return new Promise((resolve) => {
      const globalRegistry = JSON.parse(localStorage.getItem('carlin_biometric_registry') || '[]');
      
      // Simulação de busca vetorial por similaridade
      const match = globalRegistry.find((entry: { hash: string }) => entry.hash === biometricHash);
      
      // Simulação de score de similaridade (neste mock, se houver match exato de hash, similarity = 1.0)
      const simulatedSimilarity = match ? 1.0 : Math.random() * 0.5;

      setTimeout(() => {
        if (antiFakeEngine.checkSimilarity(simulatedSimilarity)) {
          // Se o engine de similaridade disparar (>= 0.95)
          resolve({ status: 'SIMILARITY_DETECTED', originalUserId: match?.userId });
        } else {
          resolve({ status: 'OK' });
        }
      }, 1200);
    });
  },

  async salvarBiometria(userId: string, biometricHash: string, level: VerificationLevel): Promise<User | null> {
    const localUser = this.verificarIdentidadeLocal();
    if (localUser && localUser.id === userId) {
      const updatedUser: User = { 
        ...localUser, 
        isFaciallyVerified: true,
        verificationLevel: level,
        level: level,
        biometricHash: biometricHash 
      };
      localStorage.setItem('carlin_id_local', JSON.stringify(updatedUser));
      
      const globalRegistry = JSON.parse(localStorage.getItem('carlin_biometric_registry') || '[]');
      if (!globalRegistry.some((e: any) => e.hash === biometricHash)) {
        globalRegistry.push({ userId, hash: biometricHash });
        localStorage.setItem('carlin_biometric_registry', JSON.stringify(globalRegistry));
      }

      return updatedUser;
    }
    return null;
  },

  async criarIdentidade(nome: string, email: string, passwordRaw: string, initialLevel: VerificationLevel = VerificationLevel.BRONZE): Promise<User> {
    const masterKey = generateMasterKey();
    const pwHash = await hashPassword(passwordRaw);
    
    const nome_encrypted = await encrypt(nome, masterKey);
    const email_encrypted = await encrypt(email, masterKey);

    const newUser: User = {
      id: `carlin_usr_${crypto.randomUUID().slice(0, 8)}`,
      username: nome.toLowerCase().replace(/\s/g, '.'),
      displayName: nome,
      name: nome, // UserAccount.kt
      nome_encrypted,
      email_encrypted,
      passwordHash: pwHash,
      chave: masterKey, 
      avatar: `https://picsum.photos/seed/${nome}/200/200`,
      followers: 0,
      following: 0,
      // Added missing properties viewsLastYear and monetizationEnrolled
      viewsLastYear: 0,
      // Added missing required property
      averageViewsPerVideo: 0,
      monetizationEnrolled: false,
      email: email, // UserAccount.kt
      interests: [],
      viewedContent: [],
      totalRevenue: 0,
      verificationLevel: initialLevel, 
      level: initialLevel, // UserAccount.kt
      consentAccepted: true, // UserAccount.kt
      links: []
    };

    localStorage.setItem('carlin_id_local', JSON.stringify(newUser));
    return newUser;
  },

  async registrarNoBackend(user: User): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('carlin_id_synced', 'true');
        resolve();
      }, 1000);
    });
  },

  async trackLinkClick(userId: string, linkId: string): Promise<void> {
    const localUser = this.verificarIdentidadeLocal();
    if (localUser && localUser.links) {
      let revenueIncrement = 0;
      const updatedLinks = localUser.links.map(l => {
        if (l.id === linkId) {
          if (l.type === 'monetized') revenueIncrement = 0.15;
          return { ...l, clicks: (l.clicks || 0) + 1 };
        }
        return l;
      });
      localStorage.setItem('carlin_id_local', JSON.stringify({ 
        ...localUser, 
        links: updatedLinks,
        totalRevenue: (localUser.totalRevenue || 0) + revenueIncrement
      }));
    }
  },

  async rotacionarChave(user: User): Promise<User> {
    const newMK = generateMasterKey();
    const nome = await decrypt(user.nome_encrypted, user.chave);
    const email = await decrypt(user.email_encrypted, user.chave);
    if (!nome || !email) throw new Error("Vault corruption.");
    const newNomeEnc = await encrypt(nome, newMK);
    const newEmailEnc = await encrypt(email, newMK);
    const updatedUser = { ...user, nome_encrypted: newNomeEnc, email_encrypted: newEmailEnc, chave: newMK };
    localStorage.setItem('carlin_id_local', JSON.stringify(updatedUser));
    return updatedUser;
  }
};
