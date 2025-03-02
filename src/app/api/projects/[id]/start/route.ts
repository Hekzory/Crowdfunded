import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// PUT /api/projects/[id]/start - Start a project (change status from 'draft' to 'active')
export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    // First, check if the project exists and what its current status is
    const checkResult = await query('SELECT status FROM projects WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const currentStatus = checkResult.rows[0].status;
    
    // Only allow starting if the project is in 'draft' status
    if (currentStatus !== 'draft') {
      return NextResponse.json(
        { error: `Project cannot be started because it is already in '${currentStatus}' status` },
        { status: 400 }
      );
    }
    
    // Update the project status to 'active'
    const result = await query(
      'UPDATE projects SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['active', id]
    );
    
    return NextResponse.json({ 
      project: result.rows[0],
      message: 'Project started successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error starting project:', error);
    return NextResponse.json(
      { error: 'Failed to start project' },
      { status: 500 }
    );
  }
} 