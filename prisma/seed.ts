/**
 * SEED SCRIPT
 * -------------------------------------------------------
 * Purpose:
 *   - Create super admin, editor, author, and regular user
 *   - Seed sample CMS content: products, pages, blog posts
 *   - Mark seed records with isSeed
 *
 * Run:
 *   npx prisma db seed
 */

import { PrismaClient, Role, ContentType, ContentStatus } from '@prisma/client';
import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // ----------------------------
  // 1️⃣ Seed Users
  // ----------------------------
  const users = [
    { name: 'Super Admin', email: 'admin@example.com', role: Role.ADMIN },
    { name: 'Editor User', email: 'editor@example.com', role: Role.EDITOR },
    { name: 'Author User', email: 'author@example.com', role: Role.AUTHOR },
    { name: 'Regular User', email: 'user@example.com', role: Role.USER },
  ];

  const createdUsers: Record<string, User> = {};

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        isVerified: true,
        isSeed: true,
      },
    });
    createdUsers[u.role] = user; // store for authorId references
  }

  // ----------------------------
  // 2️⃣ Seed ContentItems
  // ----------------------------
  const contentItems = [
    {
      title: 'Sample Product 1',
      slug: 'sample-product-1',
      description: 'This is a demo product.',
      price: 19.99,
      type: ContentType.PRODUCT,
      status: ContentStatus.PUBLISHED,
      authorId: createdUsers[Role.ADMIN].id,
    },
    {
      title: 'Hello World Blog',
      slug: 'hello-world-blog',
      body: { text: 'This is a demo blog post.' },
      type: ContentType.POST,
      status: ContentStatus.PUBLISHED,
      authorId: createdUsers[Role.AUTHOR].id,
    },
  ];

  for (const item of contentItems) {
    await prisma.contentItem.upsert({
      where: { slug: item.slug! },
      update: {
        title: item.title,
        body: item.body,
        description: item.description,
        price: item.price,
        status: item.status,
        type: item.type,
        authorId: item.authorId,
      },
      create: {
        title: item.title,
        slug: item.slug,
        body: item.body,
        description: item.description,
        price: item.price,
        status: item.status,
        type: item.type,
        authorId: item.authorId,
        isSeed: true,
      },
    });
  }

  // ----------------------------
  // 3️⃣ Seed Global Settings
  // ----------------------------
  await prisma.settings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      siteName: 'CMS Template',
      contactEmail: 'admin@example.com',
      theme: 'light',
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
