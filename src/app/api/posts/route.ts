import { NextResponse } from 'next/server';

// GET /api/posts
export async function GET() {
  // Placeholder response
  const posts = [
    { id: '1', title: 'First Post' },
    { id: '2', title: 'Second Post' },
  ];

  return NextResponse.json(posts);
}
