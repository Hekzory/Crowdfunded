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
    
    // Get admin stats
    const totalUsersResult = await query('SELECT COUNT(*) FROM users');
    const totalProjectsResult = await query('SELECT COUNT(*) FROM projects');
    const totalFundingResult = await query('SELECT SUM(current_amount) FROM projects');
    
    const stats = {
      totalUsers: parseInt(totalUsersResult.rows[0].count, 10),
      totalProjects: parseInt(totalProjectsResult.rows[0].count, 10),
      totalFunding: parseFloat(totalFundingResult.rows[0].sum || '0')
    };
    
    // Return the stats
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 