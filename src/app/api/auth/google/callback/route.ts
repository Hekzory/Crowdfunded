import { NextRequest, NextResponse } from 'next/server';
import { getGoogleOAuthTokens, getGoogleUser, generateToken, setAuthCookie } from '@/app/lib/auth';
import { query } from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get the code from the query string
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    // Exchange the code for tokens
    const tokens = await getGoogleOAuthTokens(code);
    
    if (!tokens || !tokens.id_token || !tokens.access_token) {
      console.error('Failed to get tokens:', tokens);
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    // Get user info from Google
    const googleUser = await getGoogleUser(tokens.id_token, tokens.access_token);
    
    if (!googleUser || !googleUser.email) {
      console.error('Failed to get Google user:', googleUser);
      return NextResponse.redirect(new URL('/login?error=user_data', request.url));
    }
    
    // Check if user exists in our database
    let result = await query(
      'SELECT * FROM users WHERE email = $1 AND provider = $2',
      [googleUser.email, 'google']
    );
    
    let userId: number;
    
    if (result.rows.length === 0) {
      // User doesn't exist, create a new one
      const newUserResult = await query(
        `INSERT INTO users (email, name, provider, google_id, profile_picture) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`,
        [
          googleUser.email,
          googleUser.name,
          'google',
          googleUser.id,
          googleUser.picture
        ]
      );
      
      userId = newUserResult.rows[0].id;
    } else {
      // User exists, update their info
      const user = result.rows[0];
      userId = user.id;
      
      await query(
        `UPDATE users 
         SET name = $1, google_id = $2, profile_picture = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [googleUser.name, googleUser.id, googleUser.picture, userId]
      );
    }
    
    // Generate JWT token
    const token = await generateToken(userId, googleUser.email, 'google');
    
    // Set auth cookie
    await setAuthCookie(token);
    
    // Get the return_to path and redirect
    const cookieStore = request.cookies;
    const returnTo = cookieStore.get('auth_return_to')?.value || '/';
    
    const response = NextResponse.redirect(new URL(returnTo, request.url));
    
    // Clear the return_to cookie
    response.cookies.delete('auth_return_to');
    
    return response;
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
} 