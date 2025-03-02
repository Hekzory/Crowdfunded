import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  const params = await context.params;
  const name = params.name;
  
  return NextResponse.json({ 
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  }, 
  { status: 200 });
} 