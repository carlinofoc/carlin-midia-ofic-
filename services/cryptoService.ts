
import { EncryptedPayload } from '../types';

/**
 * CryptoService Carlin v5.2 - Identity & Vault Specialist
 * Uses Web Crypto API for 256-bit AES-GCM security.
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
 * Generates a 256-bit Master Key (32 bytes)
 */
export const generateMasterKey = (): string => {
  const key = crypto.getRandomValues(new Uint8Array(32));
  return bufferToHex(key);
};

/**
 * Hashes a numerical vector for secure biometric storage.
 * Flow: Vetor facial (números) -> Hash seguro
 */
export const hashFacialVector = async (vector: number[]): Promise<string> => {
  const encoder = new TextEncoder();
  const vectorStr = vector.join(','); // Flatten vector to string
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(vectorStr));
  return bufferToHex(hashBuffer);
};

/**
 * Derives a key from a password using PBKDF2
 */
export const deriveKeyFromPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await crypto.subtle.exportKey('raw', derivedKey);
  return bufferToHex(exported);
};

/**
 * Hashes a password for storage/comparison
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(password));
  return bufferToHex(hash);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  const newHash = await hashPassword(password);
  return newHash === hash;
};

/**
 * Carlin v5.2 Envelope Encryption Flow:
 * 1. Generate 256-bit DEK (Data Encryption Key)
 * 2. Encrypt data with DEK
 * 3. Wrap (Encrypt) DEK with 256-bit Master Key
 */
export const encrypt = async (text: string, hexMasterKey: string): Promise<EncryptedPayload> => {
  const encoder = new TextEncoder();
  const mkRaw = hexToUint8Array(hexMasterKey);
  
  // Step 1: Generate 256-bit DEK
  const dekRaw = crypto.getRandomValues(new Uint8Array(32));
  const dekKey = await crypto.subtle.importKey('raw', dekRaw, { name: 'AES-GCM' }, false, ['encrypt']);
  
  // Step 2: Encrypt Data with DEK
  const dataIv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedDataBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: dataIv }, dekKey, encoder.encode(text)
  );
  
  const fullData = new Uint8Array(encryptedDataBuffer);
  const dataTag = fullData.slice(-16);
  const dataBody = fullData.slice(0, -16);

  // Step 3: Wrap DEK with Master Key
  const mkKey = await crypto.subtle.importKey('raw', mkRaw, { name: 'AES-GCM' }, false, ['encrypt']);
  const dekIv = crypto.getRandomValues(new Uint8Array(12));
  const wrappedDEKBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: dekIv }, mkKey, dekRaw
  );

  const fullDEK = new Uint8Array(wrappedDEKBuffer);
  const dekTag = fullDEK.slice(-16);
  const dekBody = fullDEK.slice(0, -16);

  return {
    encrypted: bufferToHex(dataBody),
    iv: bufferToHex(dataIv),
    tag: bufferToHex(dataTag),
    encryptedDEK: bufferToHex(dekBody),
    dekIv: bufferToHex(dekIv),
    dekTag: bufferToHex(dekTag)
  };
};

/**
 * Unwrap and Decrypt
 */
export const decrypt = async (payload: EncryptedPayload, hexMasterKey: string): Promise<string | null> => {
  try {
    const decoder = new TextDecoder();
    const mkRaw = hexToUint8Array(hexMasterKey);
    const mkKey = await crypto.subtle.importKey('raw', mkRaw, { name: 'AES-GCM' }, false, ['decrypt']);

    // Step 1: Unwrap DEK
    const combinedDEK = new Uint8Array([...hexToUint8Array(payload.encryptedDEK || ""), ...hexToUint8Array(payload.dekTag || "")]);
    const dekRawBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: hexToUint8Array(payload.dekIv || "") }, mkKey, combinedDEK
    );
    const dekRaw = new Uint8Array(dekRawBuffer);

    // Step 2: Decrypt Data with DEK
    const dekKey = await crypto.subtle.importKey('raw', dekRaw, { name: 'AES-GCM' }, false, ['decrypt']);
    const combinedData = new Uint8Array([...hexToUint8Array(payload.encrypted), ...hexToUint8Array(payload.tag)]);
    const decryptedDataBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: hexToUint8Array(payload.iv) }, dekKey, combinedData
    );

    return decoder.decode(decryptedDataBuffer);
  } catch (e) {
    console.error("Vault Access Failed:", e);
    return null;
  }
};

export const generateSessionToken = async (userId: string): Promise<string> => {
  const header = bufferToHex(new TextEncoder().encode(JSON.stringify({ alg: "HS256" })));
  const payload = bufferToHex(new TextEncoder().encode(JSON.stringify({ id: userId, iat: Date.now() })));
  const signature = await hashPassword(`${header}.${payload}.carlin_v5`);
  return `${header}.${payload}.${signature}`;
};
