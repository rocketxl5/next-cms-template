import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/role";

// Admin-only settings API
export async function GET() {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);

  // Placeholder settings
  const settings = {
    siteName: "CMS + E-commerce Template",
    contactEmail: "admin@example.com",
    theme: "light",
  };

  return NextResponse.json(settings);
}

// Later, you can add POST / PUT to update settings
