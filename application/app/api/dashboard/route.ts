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

    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
      include: {
        subscription: {
          include: {
            features: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Fetch other dashboard data
    const [totalOrders, totalCustomers, totalProducts] = await Promise.all([
      prisma.order.count({
        where: { companyId: session.user.companyId },
      }),
      prisma.customer.count({
        where: { companyId: session.user.companyId },
      }),
      prisma.product.count({
        where: { companyId: session.user.companyId },
      }),
    ]);

    return NextResponse.json({
      company,
      stats: {
        totalOrders,
        totalCustomers,
        totalProducts,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 