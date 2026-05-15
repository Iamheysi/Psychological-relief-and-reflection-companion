import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const ALG = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function appKey(): Buffer {
  const raw = process.env.APP_ENCRYPTION_KEY;
  if (!raw) throw new Error("APP_ENCRYPTION_KEY is not set");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    // Derive deterministically if not exactly 32 bytes of base64 — useful for dev only.
    return scryptSync(raw, "mira-app-key", 32);
  }
  return key;
}

function encryptWithKey(plaintext: string, key: Buffer): string {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALG, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

function decryptWithKey(ciphertext: string, key: Buffer): string {
  const buf = Buffer.from(ciphertext, "base64");
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const enc = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALG, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}

export function generateUserKey(): { plain: Buffer; wrapped: string } {
  const userKey = randomBytes(32);
  const wrapped = encryptWithKey(userKey.toString("base64"), appKey());
  return { plain: userKey, wrapped };
}

export function unwrapUserKey(wrapped: string): Buffer {
  const plainB64 = decryptWithKey(wrapped, appKey());
  return Buffer.from(plainB64, "base64");
}

export function encryptForUser(plaintext: string, userKey: Buffer): string {
  return encryptWithKey(plaintext, userKey);
}

export function decryptForUser(ciphertext: string, userKey: Buffer): string {
  return decryptWithKey(ciphertext, userKey);
}
