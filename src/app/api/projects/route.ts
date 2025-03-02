import { NextRequest, NextResponse } from 'next/server';
import { query, initDatabase } from '@/app/lib/db';

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
    
    const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
    
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
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'goal_amount', 'creator_name'];
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
        (title, description, goal_amount, current_amount, image_url, creator_name, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        body.title,
        body.description,
        body.goal_amount,
        body.current_amount || 0,
        body.image_url || null,
        body.creator_name,
        status
      ]
    );
    
    return NextResponse.json(
      { 
        project: result.rows[0],
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