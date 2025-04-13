import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { query } from '@/app/lib/db';

// POST /api/projects/[id]/contribute - Contribute to a project
export async function POST(
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
        { error: 'Authentication required to contribute' },
        { status: 401 }
      );
    }
    
    // Get the contribution amount from request body
    const { amount } = await request.json();
    
    // Validate amount
    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid contribution amount' },
        { status: 400 }
      );
    }
    
    // Check if test payment system is enabled
    const settingsResult = await query(
      'SELECT value FROM system_settings WHERE key = $1',
      ['test_payment_enabled']
    );
    
    const isPaymentEnabled = settingsResult.rows.length > 0 && 
                           settingsResult.rows[0].value === 'true';
    
    if (!isPaymentEnabled) {
      return NextResponse.json(
        { error: 'Payment system is currently disabled' },
        { status: 403 }
      );
    }
    
    // Check if project exists and is active
    const projectResult = await query(
      'SELECT id, status, current_amount, goal_amount FROM projects WHERE id = $1',
      [projectId]
    );
    
    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    const project = projectResult.rows[0];
    
    if (project.status !== 'active') {
      return NextResponse.json(
        { error: 'This project is not accepting contributions' },
        { status: 400 }
      );
    }
    
    // Begin a transaction
    await query('BEGIN');
    
    try {
      // Insert contribution record
      await query(
        'INSERT INTO contributions (user_id, project_id, amount) VALUES ($1, $2, $3)',
        [jwtPayload.userId, projectId, contributionAmount]
      );
      
      // Update project's current amount
      await query(
        'UPDATE projects SET current_amount = current_amount + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [contributionAmount, projectId]
      );
      
      // Commit the transaction
      await query('COMMIT');
      
      // Get updated project data
      const updatedProjectResult = await query(
        'SELECT id, title, current_amount, goal_amount FROM projects WHERE id = $1',
        [projectId]
      );
      
      const updatedProject = updatedProjectResult.rows[0];
      
      return NextResponse.json({ 
        success: true,
        message: 'Thank you for your contribution!',
        contribution: {
          amount: contributionAmount,
          project_id: projectId,
          user_id: jwtPayload.userId,
          created_at: new Date().toISOString()
        },
        project: {
          id: updatedProject.id,
          title: updatedProject.title,
          current_amount: updatedProject.current_amount,
          goal_amount: updatedProject.goal_amount
        }
      }, { status: 201 });
      
    } catch (error) {
      // If anything fails, roll back the transaction
      await query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('Contribution error:', error);
    return NextResponse.json(
      { error: 'Failed to process contribution' },
      { status: 500 }
    );
  }
} 