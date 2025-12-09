/**
 * ADMIN POSTS API
 * -------------------------------------------------------
 * Purpose:
 *   Provides admin access to manage posts (CMS content type POST)
 *
 * Route:
 *   GET    /api/admin/posts       — List all posts
 *   POST   /api/admin/posts       — Create a new post
 *   PUT    /api/admin/posts/:id   — Update a post
 *   DELETE /api/admin/posts/:id   — Delete a post
 *
 * Auth:
 *   - Requires valid access token
 *   - Requires role: ADMIN or SUPER_ADMIN
 *
 * Notes:
 *   - Only post fields safe to return or update are included
 *   - Errors are caught and returned as JSON
 *
 * Related Files:
 *   - /lib/auth/role.ts → requireRole()
 *   - /lib/prisma.ts     → Prisma instance
 *   - prisma/schema.prisma → ContentItem model
 * -------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/role';
import prisma from '@/lib/prisma';

// -------------------------------------------------------
// GET — List all posts
// -------------------------------------------------------
export async function GET() {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  try {
    const posts = await prisma.contentItem.findMany({
      where: { type: 'POST' },
      select: {
        id: true,
        title: true,
        slug: true,
        body: true,
        status: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('❌ DB error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------
// POST — Create a new post
// Expects JSON body with title, slug, body, status
// -------------------------------------------------------
export async function POST(req: Request) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  try {
    const data = await req.json();

    // Create a new post with the current admin as author
    const newPost = await prisma.contentItem.create({
      data: {
        title: data.title,
        slug: data.slug,
        body: data.body,
        status: data.status || 'DRAFT',
        type: 'POST',
        authorId: data.authorId, // pass the admin/editor ID
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('❌ DB error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------
// PUT — Update a post
// Requires post ID in query parameter and body data
// -------------------------------------------------------
export async function PUT(req: Request) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  try {
    const { id } = Object.fromEntries(new URL(req.url).searchParams) as {
      id: string;
    };
    const data = await req.json();

    const updatedPost = await prisma.contentItem.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        body: data.body,
        status: data.status,
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error('❌ DB error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------
// DELETE — Remove a post
// Requires post ID in query parameter
// -------------------------------------------------------
export async function DELETE(req: Request) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  try {
    const { id } = Object.fromEntries(new URL(req.url).searchParams) as {
      id: string;
    };

    await prisma.contentItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Post deleted' }, { status: 200 });
  } catch (error) {
    console.error('❌ DB error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
