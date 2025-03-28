import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { query } from '@/app/lib/db';

export async function DELETE(
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
    
    // Delete the project
    await query(
      'DELETE FROM projects WHERE id = $1',
      [projectId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
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
    
    // Get project data with user information
    const projectResult = await query(`
      SELECT p.*, u.name as user_name 
      FROM projects p 
      LEFT JOIN users u ON p.user_id = u.id 
      WHERE p.id = $1
    `, [projectId]);
    
    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(projectResult.rows[0]);
  } catch (error) {
    console.error('Get project error:', error);
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
    const { title, description, goal_amount, status, image_url } = await request.json();
    
    // Validate required fields
    if (!title || !description || !goal_amount || !status) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }
    
    // Update the project
    await query(
      `UPDATE projects SET 
       title = $1, 
       description = $2, 
       goal_amount = $3, 
       status = $4, 
       image_url = $5,
       updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6`,
      [title, description, goal_amount, status, image_url, projectId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 