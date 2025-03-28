import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { query } from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get current user from JWT
    const jwtPayload = await getCurrentUser();
    
    if (!jwtPayload || !jwtPayload.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify the user is an admin
    const userResult = await query(
      'SELECT name FROM users WHERE id = $1',
      [jwtPayload.userId]
    );
    
    if (userResult.rows.length === 0 || userResult.rows[0].name !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get all projects with user information
    const projectsResult = await query(`
      SELECT p.*, u.name as user_name 
      FROM projects p 
      LEFT JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    
    // Return projects
    return NextResponse.json(projectsResult.rows);
  } catch (error) {
    console.error('Admin projects error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 