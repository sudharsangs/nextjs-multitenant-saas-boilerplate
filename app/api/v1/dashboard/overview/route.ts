import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, subscriptions } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total users count for the company
    const totalUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.companyId} = ${companyId} AND ${users.isActive} = true`)
      .then(res => Number(res[0]?.count) || 0);

    // Get subscription status
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.companyId, companyId))
      .limit(1)
      .then(res => res[0]);

    // Get active users count (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

    const activeUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`
        ${users.companyId} = ${companyId}
        AND ${users.isActive} = true
        AND ${users.lastLoginAt} >= ${thirtyDaysAgoStr}
      `)
      .then(res => Number(res[0]?.count) || 0);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      subscriptionPlan: subscription?.plan || 'FREE',
      subscriptionStatus: subscription?.isActive ? 'active' : 'inactive'
    });
  } catch (error) {
    // TODO: Replace with proper logging system
    if (process.env.NODE_ENV === 'development') {
      console.error('Dashboard overview error:', error);
    }
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard overview',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
} 