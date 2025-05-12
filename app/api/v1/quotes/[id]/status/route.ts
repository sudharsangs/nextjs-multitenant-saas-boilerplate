import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { quotes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

interface GetParams {
  id: string;
}

const updateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'])
});

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
    const { status } = updateStatusSchema.parse(json);

    const [quote] = await db.update(quotes)
      .set({ status })
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
    console.error('Error updating quote status:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
