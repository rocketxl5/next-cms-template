import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.settings.findMany()

        return Response.json(settings)
    } catch (error) {
        return Response.json({error: "Failed to fetch products"}, {status: 500})
    }
}