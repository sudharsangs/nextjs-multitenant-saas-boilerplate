import crypto from 'crypto';

// Utilities to generate and hash API keys securely

export type ApiKeyPermissions = string[] | Record<string, unknown> | null;

// Generate a URL-safe random string
function randomString(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function generateApiKeyId() {
  // Public identifier for an API key; not secret
  return `fk_${randomString(9)}`; // ~12 chars url-safe
}

export function generateApiSecret() {
  // Secret part that is shown once
  return `sk_${randomString(24)}`; // ~32 chars url-safe
}

export function composeToken(keyId: string, secret: string) {
  // Single bearer token value clients can use
  return `${keyId}.${secret}`;
}

export function hashSecret(secret: string) {
  // HMAC-SHA256 with dedicated API_KEY_SECRET (fallback to JWT_SECRET)
  const pepper = process.env.API_KEY_SECRET || process.env.JWT_SECRET || '';
  const hmac = crypto.createHmac('sha256', pepper);
  hmac.update(secret);
  return hmac.digest('hex');
}

export function verifySecret(secret: string, hash: string) {
  const computed = hashSecret(secret);
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
}

export function maskKeyId(keyId: string) {
  if (!keyId) return '';
  const visible = keyId.slice(-4);
  return `${keyId.slice(0, 3)}…${visible}`; // fk_…abcd
}
