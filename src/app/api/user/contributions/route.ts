import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { query } from '@/app/lib/db';

// GET /api/user/contributions - Get user's contributions
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
    
    // Get all contributions with project details
    const contributionsResult = await query(`
      SELECT 
        c.id, 
        c.amount, 
        c.created_at, 
        p.id as project_id, 
        p.title as project_title, 
        p.image_url as project_image,
        p.status as project_status
      FROM 
        contributions c
      JOIN 
        projects p ON c.project_id = p.id
      WHERE 
        c.user_id = $1
      ORDER BY 
        c.created_at DESC
    `, [jwtPayload.userId]);
    
    return NextResponse.json(contributionsResult.rows);
  } catch (error) {
    console.error('Get contributions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    );
  }
} 