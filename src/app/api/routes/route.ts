import { NextRequest, NextResponse } from 'next/server';

// Handler for GET requests
export async function GET() {
  // Simple example of routes information
  const routes = [
    { path: '/', description: 'Home page', method: 'GET' },
    { path: '/about', description: 'About page', method: 'GET' },
    { path: '/api', description: 'API information endpoint', method: 'GET' },
    { path: '/api/routes', description: 'This API endpoint - returns information about available routes', method: 'GET' },
    { path: '/api/projects', description: 'Get all projects', method: 'GET' },
    { path: '/api/projects', description: 'Create a new project', method: 'POST' },
    { path: '/api/projects/[id]', description: 'Get a single project by ID', method: 'GET' },
    { path: '/api/projects/[id]/start', description: 'Start a project by ID', method: 'PUT' },
  ];

  // Return response with status 200 and JSON data
  return NextResponse.json(
    { 
      success: true, 
      data: routes,
      message: 'Available routes in the application'
    }, 
    { status: 200 }
  );
} 