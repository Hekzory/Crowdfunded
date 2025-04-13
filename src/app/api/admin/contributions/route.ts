import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { query } from '@/app/lib/db';

// GET /api/admin/contributions - Get all contributions (admin only)
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
    
    // Get all contributions with project and user details
    const contributionsResult = await query(`
      SELECT 
        c.id, 
        c.amount, 
        c.created_at, 
        p.id as project_id, 
        p.title as project_title,
        p.status as project_status,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
      FROM 
        contributions c
      JOIN 
        projects p ON c.project_id = p.id
      JOIN 
        users u ON c.user_id = u.id
      ORDER BY 
        c.created_at DESC
    `);
    
    return NextResponse.json(contributionsResult.rows);
  } catch (error) {
    console.error('Admin contributions error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 