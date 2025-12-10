import prisma from "@/lib/prisma";

// GET /api/test/items
export async function GET() {
  try {
    const items = await prisma.contentItem.findMany();
    return Response.json(items);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch content items" },
      { status: 500 }
    );
  }
}

// POST /api/test/items
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const item = await prisma.contentItem.create({
      data: body,
    });

    return Response.json(item);
  } catch (error) {
    return Response.json(
      { error: "Failed to create content item" },
      { status: 500 }
    );
  }
}

// PUT /api/test/items
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id)
      return Response.json({ error: "Missing id" }, { status: 400 });

    const updated = await prisma.contentItem.update({
      where: { id },
      data: updateData,
    });

    return Response.json(updated);
  } catch (error) {
    return Response.json(
      { error: "Failed to update content item" },
      { status: 500 }
    );
  }
}

// DELETE /api/test/items
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id)
      return Response.json({ error: "Missing id" }, { status: 400 });

    const deleted = await prisma.contentItem.delete({
      where: { id },
    });

    return Response.json(deleted);
  } catch (error) {
    return Response.json(
      { error: "Failed to delete content item" },
      { status: 500 }
    );
  }
}
