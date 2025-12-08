import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/role";

// Admin-only Products API stub
export async function GET() {
  // Only admins can access
  await requireRole(["ADMIN", "SUPER_ADMIN"]);

  const products = [
    { id: "1", title: "Admin Product 1", price: 19.99 },
    { id: "2", title: "Admin Product 2", price: 29.99 },
  ];

  return NextResponse.json(products);
}