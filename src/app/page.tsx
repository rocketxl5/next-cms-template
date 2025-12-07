import { prisma } from '@/lib/prisma';

export default async function Home() {
  const userCount = await prisma.user.count();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Prisma Connected</h1>
      <p>Users in database: {userCount}</p>
    </main>
  );
}
