import type { SupabaseClient } from '@supabase/supabase-js';

const ALGO = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

const SENSITIVE_FIELDS = [
  'account_number',
  'routing_number',
  'policy_number',
  'folio_number',
  'notes',
] as const;

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(str: string): Uint8Array {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(raw: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', raw, { name: ALGO }, false, [
    'encrypt',
    'decrypt',
  ]);
}

async function encryptValue(key: CryptoKey, plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: ALGO, iv }, key, encoded);
  return toBase64(iv) + ':' + toBase64(ciphertext);
}

async function decryptValue(key: CryptoKey, encrypted: string): Promise<string> {
  const [ivB64, cipherB64] = encrypted.split(':');
  if (!ivB64 || !cipherB64) return encrypted;
  try {
    const iv = fromBase64(ivB64);
    const ciphertext = fromBase64(cipherB64);
    const decrypted = await crypto.subtle.decrypt({ name: ALGO, iv }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
  } catch {
    return encrypted;
  }
}

export async function getOrCreateVaultKey(
  client: SupabaseClient,
): Promise<CryptoKey> {
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const metadata = user.user_metadata;
  let rawKey: Uint8Array;

  if (metadata?.vault_key) {
    rawKey = fromBase64(metadata.vault_key);
  } else {
    rawKey = crypto.getRandomValues(new Uint8Array(KEY_LENGTH / 8));
    await client.auth.updateUser({
      data: { vault_key: toBase64(rawKey) },
    });
  }

  return importKey(rawKey);
}

export async function encryptSensitiveFields<T extends Record<string, any>>(
  key: CryptoKey,
  record: T,
): Promise<T> {
  const result = { ...record };
  for (const field of SENSITIVE_FIELDS) {
    if (result[field] && typeof result[field] === 'string') {
      (result as any)[field] = await encryptValue(key, result[field]);
    }
  }
  return result;
}

export async function decryptSensitiveFields<T extends Record<string, any>>(
  key: CryptoKey,
  record: T,
): Promise<T> {
  const result = { ...record };
  for (const field of SENSITIVE_FIELDS) {
    if (result[field] && typeof result[field] === 'string' && result[field].includes(':')) {
      (result as any)[field] = await decryptValue(key, result[field]);
    }
  }
  return result;
}

export async function decryptSensitiveFieldsArray<T extends Record<string, any>>(
  key: CryptoKey,
  records: T[],
): Promise<T[]> {
  return Promise.all(records.map((r) => decryptSensitiveFields(key, r)));
}
