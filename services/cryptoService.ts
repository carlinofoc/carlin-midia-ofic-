
import { EncryptedPayload } from '../types';

/**
 * CryptoService Carlin v4.6 (Mongoose Ready)
 * Implementação de chaves individuais e rotação
 */

const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const hexToUint8Array = (hex: string): Uint8Array => {
  const matches = hex.match(/.{1,2}/g);
  return new Uint8Array(matches ? matches.map(byte => parseInt(byte, 16)) : []);
};

/**
 * Gera uma chave AES individual (gerarChaveUsuario)
 */
export const generateIndividualKey = (): string => {
  const key = crypto.getRandomValues(new Uint8Array(32));
  return bufferToHex(key);
};

/**
 * Hash de Senha (hashSenha)
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hash);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  const newHash = await hashPassword(password);
  return newHash === hash;
};

/**
 * Criptografia AES-256-GCM com Chave Individual (encrypt)
 */
export const encrypt = async (text: string, hexKey: string): Promise<EncryptedPayload> => {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const rawKey = hexToUint8Array(hexKey);
  
  const key = await crypto.subtle.importKey(
    'raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt']
  );

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, encoder.encode(text)
  );

  const fullBytes = new Uint8Array(encryptedBuffer);
  const tagBytes = fullBytes.slice(-16);
  const encryptedBytes = fullBytes.slice(0, -16);

  return {
    encrypted: bufferToHex(encryptedBytes),
    iv: bufferToHex(iv),
    tag: bufferToHex(tagBytes)
  };
};

/**
 * Descriptografia AES-256-GCM (decrypt)
 */
export const decrypt = async (payload: EncryptedPayload, hexKey: string): Promise<string | null> => {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const rawKey = hexToUint8Array(hexKey);
    
    const key = await crypto.subtle.importKey(
      'raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt']
    );

    const encryptedBytes = hexToUint8Array(payload.encrypted);
    const tagBytes = hexToUint8Array(payload.tag);
    const iv = hexToUint8Array(payload.iv);

    const combined = new Uint8Array(encryptedBytes.length + tagBytes.length);
    combined.set(encryptedBytes);
    combined.set(tagBytes, encryptedBytes.length);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, key, combined
    );

    return decoder.decode(decryptedBuffer);
  } catch (e) {
    return null;
  }
};

/**
 * Simulação de Geração de Session Token (antigo JWT)
 * Renamed to generateSessionToken to fix import error in Login.tsx
 */
export const generateSessionToken = async (userId: string): Promise<string> => {
  const header = bufferToHex(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const payload = bufferToHex(new TextEncoder().encode(JSON.stringify({ id: userId, exp: Date.now() + 7200000 })));
  const signature = await hashPassword(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
};
