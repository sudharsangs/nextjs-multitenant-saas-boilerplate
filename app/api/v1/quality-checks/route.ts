import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { qualityChecks } from '@/db/schema';
import { getAuthUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

const qualityCheckSchema = z.object({
  productionOrderId: z.string(),
  batchId: z.string(),
  type: z.enum(['INCOMING', 'IN_PROCESS', 'FINAL']),
  status: z.enum(['PENDING', 'PASSED', 'FAILED']),
  parameters: z.array(z.object({
    name: z.string(),
    value: z.number(),
    unit: z.string(),
    min: z.number(),
    max: z.number(),
  })),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const checks = await db
      .select()
      .from(qualityChecks)
      .where(eq(qualityChecks.companyId, companyId));
    return NextResponse.json({ success: true, data: checks });
  } catch (err) {
    console.error('Error in GET quality checks:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const body = await request.json();
    const validatedData = qualityCheckSchema.parse(body);
    
    const [check] = await db
      .insert(qualityChecks)
      .values({
        ...validatedData,
        companyId,
      })
      .returning();
      
    return NextResponse.json({ success: true, data: check });
  } catch (err) {
    console.error('Error in POST quality check:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
