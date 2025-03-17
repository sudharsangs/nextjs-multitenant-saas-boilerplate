import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !('companyId' in session.user)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [
      ordersCount,
      customersCount,
      productsCount,
      suppliersCount,
    ] = await Promise.all([
      prisma.order.count({ where: { companyId: session.user.companyId as string } }),
      prisma.customer.count({ where: { companyId: session.user.companyId as string } }),
      prisma.product.count({ where: { companyId: session.user.companyId as string } }),
      prisma.supplier.count({ where: { companyId: session.user.companyId as string } }),
    ]);


    return NextResponse.json({
      ordersCount,
      customersCount,
      productsCount,
      suppliersCount,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 