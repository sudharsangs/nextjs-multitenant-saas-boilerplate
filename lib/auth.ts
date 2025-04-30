import { NextRequest } from 'next/server';

export interface AuthUser {
  userId: string;
  companyId: string;
}

export function getAuthUser(request: NextRequest): AuthUser {
  const userId = request.headers.get('x-user-id');
  const companyId = request.headers.get('x-company-id') || '';

  if (!userId) {
    throw new Error('User ID not found in request headers');
  }

  return {
    userId,
    companyId
  };
} 