import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/role";

// Admin-only Posts API stub
export async function GET() {
  // Only admins can access
  await requireRole(["ADMIN", "SUPER_ADMIN"]);

   const posts = [
    { id: '1', title: 'First Post' },
    { id: '2', title: 'Second Post' },
  ];

  return NextResponse.json(posts);
}
