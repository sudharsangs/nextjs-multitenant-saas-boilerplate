import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, inventory, orders } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total products count
    const totalProducts = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(sql`${products.companyId} = ${companyId}`)
      .then(res => res[0].count);

    // Get low stock items count (items below reorder point)
    const lowStockItems = await db
      .select({ count: sql<number>`count(*)` })
      .from(inventory)
      .where(sql`
        ${inventory.companyId} = ${companyId}
        AND ${inventory.quantity} <= ${products.reorderPoint}
      `)
      .then(res => res[0].count);

    // Get pending orders count
    const pendingOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(sql`
        ${orders.companyId} = ${companyId}
        AND ${orders.status} IN ('CONFIRMED', 'PICKING', 'PACKED')
      `)
      .then(res => res[0].count);

    // Get this month's revenue
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthlyRevenue = await db
      .select({ total: sql<number>`sum(${orders.totalAmount})` })
      .from(orders)
      .where(sql`
        ${orders.companyId} = ${companyId}
        AND ${orders.status} = 'DELIVERED'
        AND ${orders.createdAt} >= ${firstDayOfMonth}
        AND ${orders.createdAt} <= ${lastDayOfMonth}
      `)
      .then(res => res[0].total || 0);

    return NextResponse.json({
      totalProducts,
      lowStockItems,
      pendingOrders,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard overview' },
      { status: 500 }
    );
  }
} 