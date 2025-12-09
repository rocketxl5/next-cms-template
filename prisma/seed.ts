/**
 * SEED SCRIPT
 * -------------------------------------------------------
 * Creates:
 *   - Super Admin user
 *   - Demo Users (optional)
 *   - Sample CMS content (pages, categories, products)
 *
 * Run:
 *   npx prisma db seed
 *
 * Notes:
 *   Render supports seeds by default as long as
 *   "prisma": { "seed": "ts-node prisma/seed.ts" }
 *   is defined in package.json.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ----------------------------
  // 1️⃣ Create users
  // ----------------------------

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      name: 'Editor User',
      email: 'editor@example.com',
      password: hashedPassword,
      role: 'EDITOR',
      isVerified: true,
    },
  });

  const author = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      name: 'Author User',
      email: 'author@example.com',
      password: hashedPassword,
      role: 'AUTHOR',
      isVerified: true,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'USER',
      isVerified: true,
    },
  });

  // ----------------------------
  // 2️⃣ Create ContentItems
  // ----------------------------
  const product1 = await prisma.contentItem.create({
    data: {
      title: 'Sample Product 1',
      slug: 'sample-product-1',
      description: 'This is a demo product.',
      price: 19.99,
      type: 'PRODUCT',
      status: 'PUBLISHED',
      authorId: admin.id,
    },
  });

  const product2 = await prisma.contentItem.create({
    data: {
      title: 'Sample Product 2',
      slug: 'sample-product-2',
      description: 'Another demo product.',
      price: 29.99,
      type: 'PRODUCT',
      status: 'PUBLISHED',
      authorId: admin.id,
    },
  });

  const blogPost = await prisma.contentItem.create({
    data: {
      title: 'Hello World Blog',
      slug: 'hello-world-blog',
      body: 'This is a demo blog post.',
      type: 'POST',
      status: 'PUBLISHED',
      authorId: author.id,
    },
  });

  const page = await prisma.contentItem.create({
    data: {
      title: 'About Us',
      slug: 'about-us',
      body: 'This is a sample CMS page.',
      type: 'PAGE',
      status: 'PUBLISHED',
      authorId: editor.id,
    },
  });

  console.log('✅ Database seeded successfully');
  console.log({ admin, editor, author, user });
  console.log({ product1, product2, blogPost, page });
}

// Run the seed
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
