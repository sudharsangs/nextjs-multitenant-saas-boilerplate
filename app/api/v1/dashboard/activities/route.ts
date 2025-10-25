import { NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs, users } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent activities with user information
    const activities = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        changes: auditLogs.changes,
        createdAt: auditLogs.createdAt,
        user: {
          name: users.name,
          email: users.email
        }
      })
      .from(auditLogs)
      .leftJoin(users, sql`${users.id} = ${auditLogs.userId}`)
      .where(sql`${auditLogs.companyId} = ${companyId}`)
      .orderBy(sql`${auditLogs.createdAt} DESC`)
      .limit(10);

    // Format activities for the frontend
    const formattedActivities = activities.map(activity => {
      const timeAgo = getTimeAgo(activity.createdAt);
      let action = '';
      let status = '';

      // Format action and status based on entity type and action
      switch (activity.entityType) {
        case 'product':
          action = `Product ${activity.action.toLowerCase()}d`;
          status = activity.entityId;
          break;
        case 'stock':
          action = `Stock ${activity.action.toLowerCase()}d`;
          status = activity.entityId;
          break;
        case 'order':
          action = `Order ${activity.action.toLowerCase()}d`;
          status = `Order #${activity.entityId}`;
          break;
        case 'batch':
          action = `Batch ${activity.action.toLowerCase()}d`;
          status = activity.entityId;
          break;
        default:
          action = `${activity.entityType} ${activity.action.toLowerCase()}d`;
          status = activity.entityId;
      }

      return {
        id: activity.id,
        action,
        user: activity.user?.name || 'System',
        time: timeAgo,
        status
      };
    });

    return NextResponse.json(formattedActivities);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
} 