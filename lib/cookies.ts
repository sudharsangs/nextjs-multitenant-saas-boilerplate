// Client-side cookie management utilities
// For server-side cookie utilities, use server-cookies.ts

/**
 * Get a cookie value by name (client-side)
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const cookies = document.cookie.split(';');
  const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));

  if (!cookie) return undefined;

  return cookie.split('=')[1];
}

/**
 * Set a cookie (client-side)
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    expires?: Date | number;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void {
  if (typeof document === 'undefined') return;

  const { expires, path = '/', secure = true, sameSite = 'strict' } = options;

  let cookieString = `${name}=${value}; path=${path}`;

  if (expires) {
    if (typeof expires === 'number') {
      const days = expires;
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
  }

  if (secure) cookieString += '; secure';
  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
}

/**
 * Remove a cookie (client-side)
 */
export function removeCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
}

/**
 * Get auth token from cookies (client-side)
 */
export function getToken(): string | undefined {
  return getCookie('token');
}

/**
 * Set auth token in cookies (client-side)
 */
export function setToken(token: string): void {
  setCookie('token', token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: 7, // 7 days
  });
}

/**
 * Delete auth token from cookies (client-side)
 */
export function deleteToken(): void {
  removeCookie('token');
}