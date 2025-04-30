import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

// Define public paths that don't require authentication
const publicPaths = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh-token'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for non-API routes
  if (!pathname.startsWith('/api/v1')) {
    return NextResponse.next();
  }

  // Allow access to public paths without authentication
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // If token doesn't exist, return 401 Unauthorized
  if (!token) {
    return NextResponse.json(
      { 
        success: false,
        message: 'Authentication required',
        error: 'Unauthorized access - no valid token provided' 
      },
      { status: 401 }
    );
  }

  try {
    // Verify JWT token
    const decodedToken = await verifyJwt(token);
    
    // Add the user info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decodedToken.userId);
    requestHeaders.set('x-company-id', decodedToken.companyId ? String(decodedToken.companyId) : '');
    
    // Clone the request with the new headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch {
    // Return 401 Unauthorized for invalid tokens
    return NextResponse.json(
      { 
        success: false,
        message: 'Authentication failed',
        error: 'Invalid or expired token' 
      },
      { status: 401 }
    );
  }
}

// Configure which paths should use this middleware
export const config = {
  matcher: ['/api/v1/:path*'],
};