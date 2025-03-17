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

    // Get the start of the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get the start of last month
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const [currentMonthOrders, lastMonthOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          companyId: session.user.companyId,
          createdAt: {
            gte: startOfMonth,
          },
        },
        select: {
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: {
          companyId: session.user.companyId,
          createdAt: {
            gte: startOfLastMonth,
            lt: startOfMonth,
          },
        },
        select: {
          totalAmount: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate revenue for current and last month
    const currentMonthRevenue = currentMonthOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

    // Calculate revenue growth
    const revenueGrowth = lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    return NextResponse.json({
      currentMonthRevenue,
      lastMonthRevenue,
      revenueGrowth,
      orders: currentMonthOrders,
    });
  } catch (error) {
    console.error("Overview error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 