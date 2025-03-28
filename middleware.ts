import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/lib/auth';

// Paths that require authentication
const protectedPaths = [
  '/projects',
  '/projects/new',
  '/admin',
];

// Paths that are public
const publicPaths = [
  '/',
  '/about',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/google',
  '/api/auth/google/callback',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path needs authentication
  const needsAuth = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Allow public paths
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (!needsAuth || isPublicPath) {
    return NextResponse.next();
  }
  
  // Get auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  
  // If no token, redirect to login
  if (!authToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }
  
  // Verify the token
  const payload = await verifyToken(authToken);
  
  // If token is invalid, redirect to login
  if (!payload) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }
  
  // Token is valid, proceed
  return NextResponse.next();
}

// Configure the matcher to specify which routes this middleware applies to
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth routes (to avoid redirect loops)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /manifest.json (browser files)
     */
    '/((?!_next|static|favicon.ico|manifest.json).*)',
  ],
}; 