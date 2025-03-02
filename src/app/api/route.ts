import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    name: 'Crowdfunded API',
    version: '0.1.0',
    description: 'Backend API for the Crowdfunded platform',
    endpoints: [
      {
        path: '/api',
        description: 'This endpoint - API information',
        method: 'GET'
      },
      {
        path: '/api/routes',
        description: 'Information about available routes in the application',
        method: 'GET'
      },
      {
        path: '/api/hello/[name]',
        description: 'Greets the user with the provided name parameter',
        method: 'GET'
      }
    ]
  }, 
  { status: 200 });
} 