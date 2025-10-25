import { NextResponse } from 'next/server';
import { db } from '@/db';
import { payments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

// GET /api/v1/payments - Get payment history
export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const paymentHistory = await db
      .select()
      .from(payments)
      .where(eq(payments.companyId, companyId))
      .orderBy(desc(payments.paymentDate))
      .limit(50);

    return NextResponse.json({
      success: true,
      data: paymentHistory,
    });
  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch payments',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
