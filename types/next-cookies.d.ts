import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

declare module 'next/headers' {
  export function cookies(): ReadonlyRequestCookies;
} 