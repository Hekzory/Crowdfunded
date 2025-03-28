import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { query } from '@/app/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Get current user from JWT
    const jwtPayload = await getCurrentUser();
    
    if (!jwtPayload || !jwtPayload.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify the user is an admin
    const adminResult = await query(
      'SELECT name FROM users WHERE id = $1',
      [jwtPayload.userId]
    );
    
    if (adminResult.rows.length === 0 || adminResult.rows[0].name !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Prevent deleting the admin user
    if (userId === jwtPayload.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const userCheckResult = await query(
      'SELECT id FROM users WHERE id = $1',
      [userId]
    );
    
    if (userCheckResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete related projects first (due to foreign key constraints)
    await query(
      'DELETE FROM projects WHERE user_id = $1',
      [userId]
    );
    
    // Delete the user
    await query(
      'DELETE FROM users WHERE id = $1',
      [userId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Get current user from JWT
    const jwtPayload = await getCurrentUser();
    
    if (!jwtPayload || !jwtPayload.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify the user is an admin
    const adminResult = await query(
      'SELECT name FROM users WHERE id = $1',
      [jwtPayload.userId]
    );
    
    if (adminResult.rows.length === 0 || adminResult.rows[0].name !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get user data
    const userResult = await query(
      'SELECT id, name, email, provider, created_at, profile_picture FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(userResult.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Get current user from JWT
    const jwtPayload = await getCurrentUser();
    
    if (!jwtPayload || !jwtPayload.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify the user is an admin
    const adminResult = await query(
      'SELECT name FROM users WHERE id = $1',
      [jwtPayload.userId]
    );
    
    if (adminResult.rows.length === 0 || adminResult.rows[0].name !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get the request body
    const { name, email } = await request.json();
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Update the user
    await query(
      'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [name, email, userId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 