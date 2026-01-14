import { NextResponse } from "next/server";

// GET /api/products
export async function GET() {
  // Placeholder response
  const products = [
    { id: "1", title: "Sample Product 1", price: 19.99 },
    { id: "2", title: "Sample Product 2", price: 29.99 },
  ];

  return NextResponse.json(products);
}
