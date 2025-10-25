import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/db';
import { and, count, eq, gte, lte, desc, sql } from 'drizzle-orm';
import { auditLogs, users, subscriptions } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);

    // Get current date for change percentage calculation
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    const sixtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    sixtyDaysAgo.setDate(currentDate.getDate() - 60);

    // Fetch summary data with actual database queries
    const [
      currentUsersResult,
      previousUsersResult,
      activeSubscriptionsResult,
      previousSubscriptionsResult
    ] = await Promise.all([
      // Current total users count
      db.select({ count: count() })
        .from(users)
        .where(and(
          eq(users.companyId, companyId),
          eq(users.isActive, true)
        )),

      // Previous period users count for comparison
      db.select({ count: count() })
        .from(users)
        .where(and(
          eq(users.companyId, companyId),
          eq(users.isActive, true),
          lte(users.createdAt, thirtyDaysAgo)
        )),

      // Current active subscriptions count
      db.select({ count: count() })
        .from(subscriptions)
        .where(and(
          eq(subscriptions.companyId, companyId),
          eq(subscriptions.isActive, true)
        )),

      // Previous period subscriptions count
      db.select({ count: count() })
        .from(subscriptions)
        .where(and(
          eq(subscriptions.companyId, companyId),
          eq(subscriptions.isActive, true),
          lte(subscriptions.createdAt, thirtyDaysAgo)
        ))
    ]);

    // Calculate change percentages
    const calculateChangePercentage = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return parseFloat(((current - previous) / previous * 100).toFixed(1));
    };

    const totalUsersCount = {
      count: Number(currentUsersResult[0]?.count ?? 0),
      changePercentage: calculateChangePercentage(
        Number(currentUsersResult[0]?.count ?? 0),
        Number(previousUsersResult[0]?.count ?? 0)
      )
    };

    const activeSubscriptionsCount = {
      count: Number(activeSubscriptionsResult[0]?.count ?? 0),
      changePercentage: calculateChangePercentage(
        Number(activeSubscriptionsResult[0]?.count ?? 0),
        Number(previousSubscriptionsResult[0]?.count ?? 0)
      )
    };

    // Fetch real recent activities from audit logs
    const recentActivitiesData = await db.select({
      id: auditLogs.id,
      action: auditLogs.action,
      entityType: auditLogs.entityType,
      entityId: auditLogs.entityId,
      createdAt: auditLogs.createdAt,
      userId: auditLogs.userId
    })
    .from(auditLogs)
    .innerJoin(users, eq(auditLogs.userId, users.id))
    .where(eq(auditLogs.companyId, companyId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(5);

    // Map audit logs to readable activities
    const recentActivities = await Promise.all(recentActivitiesData.map(async (activity) => {
      const user = await db.select({ name: users.name })
        .from(users)
        .where(eq(users.id, activity.userId))
        .limit(1);

      const mapEntityTypeToSection = {
        'USER': 'User Management',
        'COMPANY': 'Company',
        'SUBSCRIPTION': 'Subscription',
        'PAYMENT': 'Billing',
        'API_KEY': 'API Management'
      };

      const mapEntityTypeToLink = {
        'USER': '/users',
        'COMPANY': '/settings/company',
        'SUBSCRIPTION': '/settings/subscription',
        'PAYMENT': '/billing/payments',
        'API_KEY': '/settings/api-keys'
      };

      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      const type = mapEntityTypeToSection[activity.entityType as keyof typeof mapEntityTypeToSection] || 'System';
      const link = mapEntityTypeToLink[activity.entityType as keyof typeof mapEntityTypeToLink] || '/dashboard';

      return {
        id: activity.id,
        description: `${activity.action.charAt(0) + activity.action.slice(1).toLowerCase()} ${activity.entityType.toLowerCase().replace('_', ' ')}`,
        type,
        user: user[0]?.name || 'System',
        date: formatDate(activity.createdAt),
        status: activity.action === 'DELETE' ? 'Failed' : 'Completed',
        link
      };
    }));

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalUsers: {
            count: totalUsersCount.count,
            changePercentage: totalUsersCount.changePercentage
          },
          activeSubscriptions: {
            count: activeSubscriptionsCount.count,
            changePercentage: activeSubscriptionsCount.changePercentage
          },
          auditLogs: {
            count: recentActivitiesData.length,
            changePercentage: 0
          }
        },
        recentActivities,
        alerts: []
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}