import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.companyId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const lowStockItems = await prisma.inventory.findMany({
      where: {
        product: {
          companyId: session.user.companyId,
        },
        quantityAvailable: {
          lte: 10, // Assuming low stock threshold
        },
      },
      include: {
        product: true,
        location: true,
      },
      orderBy: {
        quantityAvailable: "asc",
      },
      take: 5,
    });

    return NextResponse.json(lowStockItems);
  } catch (error) {
    console.error("Inventory alerts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 