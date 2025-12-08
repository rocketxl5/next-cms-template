import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/role";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Only admin or super-admin can list users
  await requireRole(["ADMIN", "SUPER_ADMIN"]);

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  return NextResponse.json(users);
}