import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  // Skip authentication for non-API routes or public API endpoints
  if (!request.nextUrl.pathname.startsWith('/api/v1') || 
      request.nextUrl.pathname.startsWith('/api/v1/auth/login') ||
      request.nextUrl.pathname.startsWith('/api/v1/auth/register')) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // Check if token exists
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Verify token
    await verifyJwt(token);
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}

// Configure which paths should use this middleware
export const config = {
  matcher: ['/api/v1/:path*'],
};