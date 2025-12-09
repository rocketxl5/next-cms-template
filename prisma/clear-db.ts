import { prisma } from '@/lib/prisma';

async function clearDatabase() {
  // ⚡ Delete dependent tables first to avoid foreign key constraints
  await prisma.contentItem.deleteMany({});
  await prisma.user.deleteMany({});

  // ⚡ Delete seed generated fields
  await prisma.contentItem.deleteMany({ where: { isSeed: true } });
  await prisma.user.deleteMany({ where: { isSeed: true } });

  // Add other models if you have them, e.g.:
  // await prisma.category.deleteMany({});
  // await prisma.product.deleteMany({});

  console.log('🗑️ All tables cleared');
}

clearDatabase()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
