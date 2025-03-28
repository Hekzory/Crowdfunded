import { NextRequest, NextResponse } from 'next/server';
import { getGoogleOAuthURL } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const url = getGoogleOAuthURL();
    
    // Add return_to param to redirect back to the original page after auth
    const searchParams = request.nextUrl.searchParams;
    const returnTo = searchParams.get('returnTo') || '/';
    
    // Store returnTo in a cookie to access it after the OAuth flow
    const response = NextResponse.redirect(url);
    response.cookies.set('auth_return_to', returnTo, {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10, // 10 minutes
    });
    
    return response;
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 