import { createHmac } from 'crypto';

const getSecret = () => process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export function createMagicToken(username: string): string {
  const payload = JSON.stringify({
    sub: username,
    exp: Date.now() + TOKEN_EXPIRY_MS,
  });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = createHmac('sha256', getSecret()).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyMagicToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expectedSig = createHmac('sha256', getSecret()).update(encoded).digest('base64url');
    if (sig !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (!payload.sub || !payload.exp) return null;
    if (payload.exp < Date.now()) return null;
    return payload.sub;
  } catch {
    return null;
  }
}
