import { NextResponse } from 'next/server';
import { db } from '@/db';
import { taxRates } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { hsnCode: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const { hsnCode } = params;

    const rates = await db
      .select()
      .from(taxRates)
      .where(and(
        eq(taxRates.hsnCode, hsnCode),
        eq(taxRates.companyId, companyId),
        eq(taxRates.isActive, true)
      ));

    return NextResponse.json(rates);
  } catch (err) {
    console.error('Error in GET tax rates by HSN:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 