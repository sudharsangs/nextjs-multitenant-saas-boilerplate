import { NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const companyID = getAuthUser(request)?.companyId;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!companyID) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Verify that the user has access to the requested company
    if (companyID !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized access to company data' },
        { status: 403 }
      );
    }

    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.companyId, companyId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ success: true, data: logs });
  } catch (err) {
    console.error('Error in GET audit logs:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
