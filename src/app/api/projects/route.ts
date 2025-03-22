import { NextRequest, NextResponse } from 'next/server';
import { query, initDatabase } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';

// Initialize the database on the first request
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await initDatabase();
    isInitialized = true;
  }
}

// GET /api/projects - Get all projects
export async function GET() {
  try {
    await ensureInitialized();
    
    const result = await query(`
      SELECT 
        p.*,
        u.name as creator_name
      FROM 
        projects p
      JOIN 
        users u ON p.user_id = u.id 
      ORDER BY 
        p.created_at DESC
    `);
    
    return NextResponse.json({ projects: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();
    
    // Check authentication
    const jwtPayload = await getCurrentUser();
    
    if (!jwtPayload || !jwtPayload.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'goal_amount'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Set default status to 'draft' if not provided
    const status = body.status || 'draft';
    
    // Insert the new project
    const result = await query(
      `INSERT INTO projects 
        (title, description, goal_amount, current_amount, image_url, user_id, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        body.title,
        body.description,
        body.goal_amount,
        body.current_amount || 0,
        body.image_url || null,
        jwtPayload.userId,
        status
      ]
    );
    
    // Get creator name for the response
    const userResult = await query('SELECT name FROM users WHERE id = $1', [jwtPayload.userId]);
    const creatorName = userResult.rows[0]?.name || 'Unknown';
    
    const project = {
      ...result.rows[0],
      creator_name: creatorName
    };
    
    return NextResponse.json(
      { 
        project,
        message: 'Project created successfully'
      }, 
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 