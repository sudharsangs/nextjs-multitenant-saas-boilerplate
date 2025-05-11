import { NextResponse } from 'next/server';
import { db } from '@/db';
import { batches } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const productId = params.productId;
    const requestedCompanyId = getAuthUser(request)?.companyId;

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Verify that the user has access to the requested company
    if (requestedCompanyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized access to company data' },
        { status: 403 }
      );
    }

    const batchesList = await db
      .select()
      .from(batches)
      .where(and(
        eq(batches.productId, productId),
        eq(batches.companyId, companyId)
      ));

    return NextResponse.json(batchesList);
  } catch (err) {
    console.error('Error in GET batches by product:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
