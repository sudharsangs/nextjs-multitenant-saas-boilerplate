import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Require JWT_SECRET to be set in the environment; fail fast if missing
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error('JWT_SECRET is not set. Please configure it in your environment.');
}
const secret = new TextEncoder().encode(rawSecret);

interface JwtPayload {
  userId: string;
  [key: string]: string | number | boolean;
}

export async function signJwt(payload: JwtPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  return token;
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
  } catch {
    throw new Error('Invalid token');
  }
}

export async function getJwtFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
} 
