// Users endpoint tests

import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return Response.json(users);
  } catch (error) {
    return Response.json('Error fetching users', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newUser = await prisma.user.create({ data });

    return Response.json(newUser);
  } catch (error) {
    return Response.json('Error creating user', { status: 500 });
  }
}
