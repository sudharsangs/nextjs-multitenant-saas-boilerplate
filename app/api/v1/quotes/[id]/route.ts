import { NextResponse } from 'next/server';
import { db } from '@/db';
import { quotes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

interface GetParams {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: GetParams }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const quote = await db.query.quotes.findFirst({
      where: and(
        eq(quotes.id, params.id),
        eq(quotes.companyId, user.companyId)
      ),
      with: {
        customer: true,
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: GetParams }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const json = await request.json();

    const [quote] = await db.update(quotes)
      .set(json)
      .where(and(
        eq(quotes.id, params.id),
        eq(quotes.companyId, user.companyId)
      ))
      .returning();

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
