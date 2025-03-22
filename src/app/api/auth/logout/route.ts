import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/app/lib/auth';

export async function POST() {
  try {
    // Remove auth cookie
    await removeAuthCookie();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Something went wrong during logout' },
      { status: 500 }
    );
  }
} 