import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export function getToken(): string | undefined {
  const cookieStore: ReadonlyRequestCookies = cookies();
  const token = cookieStore.get('token');
  return token?.value;
}

export async function setToken(token: string): Promise<void> {
  const cookieStore: ReadonlyRequestCookies = cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function deleteToken(): Promise<void> {
  const cookieStore: ReadonlyRequestCookies = cookies();
  cookieStore.delete('token');
} 