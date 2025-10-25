import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

// Define public paths that don't require authentication
const publicPaths = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh-token'
];

// Define paths that are always accessible (demo, auth, landing page)
const publicFrontendPaths = [
  '/demo',
  '/auth',
  '/'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API routes
  if (pathname.startsWith('/api/v1')) {
    // Allow access to public API paths without authentication
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
    } catch(err) {
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
  
  // Handle frontend protected routes
  // Skip middleware for public frontend paths
  if (publicFrontendPaths.some(path => pathname.startsWith(path)) || pathname === '/') {
    return NextResponse.next();
  }
  
  // Check for token for protected frontend routes
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    // Redirect to login page if no token is found
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  try {
    // Verify JWT token for frontend routes
    await verifyJwt(token);
    return NextResponse.next();
  } catch {
    // Redirect to login page if token is invalid
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
}

// Configure which paths should use this middleware
export const config = {
  matcher: [
    '/api/v1/:path*',
    '/((?!demo|auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
