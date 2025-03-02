import { NextRequest, NextResponse } from 'next/server';

// Handler for GET requests
export async function GET(request: NextRequest) {
  // Simple example of routes information
  const routes = [
    { path: '/', description: 'Home page', method: 'GET' },
    { path: '/about', description: 'About page', method: 'GET' },
    { path: '/api', description: 'API information endpoint', method: 'GET' },
    { path: '/api/routes', description: 'This API endpoint - returns information about available routes', method: 'GET' },
    { path: '/api/hello/[name]', description: 'Greets the user with the provided name parameter', method: 'GET' },
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