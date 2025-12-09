/**
 * ADMIN PRODUCTS API — CRUD
 * -------------------------------------------------------
 * Purpose:
 *   Centralized API for managing PRODUCT-type ContentItems
 *   in the CMS database. Supports full CRUD operations.
 *
 * Routes / Methods:
 *   GET    : List all products
 *   POST   : Create a new product
 *   PUT    : Update an existing product by ID
 *   DELETE : Remove a product by ID
 *
 * Auth:
 *   - Requires valid access token (handled by middleware)
 *   - Role: ADMIN or SUPER_ADMIN (requireRole())
 *
 * Implementation Notes:
 *   - Uses Prisma ContentItem model where type = "PRODUCT"
 *   - Returns only essential fields (id, title, price, status)
 *   - Errors are caught and returned as JSON with HTTP 500
 *   - POST/PUT expects `title`, `slug`, `price`, `status`
 *   - DELETE expects `id` as query parameter
 *
 * Related Files:
 *   - /lib/auth/role.ts → requireRole()
 *   - /lib/prisma.ts    → Prisma instance
 *   - prisma/schema.prisma
 *
 * Usage (Postman / Frontend):
 *   - GET    /api/admin/products
 *   - POST   /api/admin/products  → JSON body { title, slug, price, status }
 *   - PUT    /api/admin/products?id=<id>  → JSON body { title?, price?, status? }
 *   - DELETE /api/admin/products?id=<id>
 *   Headers: Authorization: Bearer <access_token>
 * -------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/role';
import prisma from '@/lib/prisma';

// --------------------
// GET — Fetch all products (admin only)
// --------------------
export async function GET() {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  try {
    const products = await prisma.contentItem.findMany({
      where: { type: 'PRODUCT' },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// --------------------
// POST — Create new product
// --------------------
export async function POST(req: Request) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const data = await req.json();

  try {
    const newProduct = await prisma.contentItem.create({
      data: {
        title: data.title,
        slug: data.slug,
        price: data.price,
        status: data.status ?? 'DRAFT',
        type: 'PRODUCT',
        authorId: data.authorId, // optionally assign author
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// --------------------
// PUT — Update existing product
// --------------------
export async function PUT(req: Request) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id)
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

  const data = await req.json();

  try {
    const updatedProduct = await prisma.contentItem.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        price: data.price,
        status: data.status,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// --------------------
// DELETE — Remove product
// --------------------
export async function DELETE(req: Request) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id)
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

  try {
    await prisma.contentItem.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
