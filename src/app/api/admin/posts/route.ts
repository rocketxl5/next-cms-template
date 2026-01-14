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
 *   - /lib/auth/withRole.ts → withRole()
 *   - /lib/prisma.ts     → Prisma instance
 *   - prisma/schema.prisma → ContentItem model
 * -------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import { withRole } from '@/lib/server/withRole';
import prisma from '@/lib/prisma';

// -------------------------------------------------------
// GET — List all posts
// -------------------------------------------------------
export const GET = withRole(['ADMIN', 'SUPER_ADMIN'], async (req) => {
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
});

// -------------------------------------------------------
// POST — Create a new post
// Expects JSON body with title, slug, body, status
// -------------------------------------------------------
export const POST = withRole(['ADMIN', 'SUPER_ADMIN'], async (req) => {
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
});

// -------------------------------------------------------
// PUT — Update a post
// Requires post ID in query parameter and body data
// -------------------------------------------------------
export const PUT = withRole(['ADMIN', 'SUPER_ADMIN'], async (req) => {
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
});

// -------------------------------------------------------
// DELETE — Remove a post
// Requires post ID in query parameter
// -------------------------------------------------------
export const DELETE = withRole(['ADMIN', 'SUPER_ADMIN'], async (req) => {
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
});
