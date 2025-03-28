import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { query } from '@/app/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id, 10);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
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
    const { status } = await request.json();
    
    // Validate status
    const validStatuses = ['draft', 'active', 'completed', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Check if project exists
    const projectCheckResult = await query(
      'SELECT id FROM projects WHERE id = $1',
      [projectId]
    );
    
    if (projectCheckResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Update the project status
    await query(
      'UPDATE projects SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, projectId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update project status error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 