import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { productionSchedule } from '@/db/schema';
import { getAuthUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

const scheduleSchema = z.object({
  productionOrderId: z.string(),
  manufacturingUnitId: z.string(),
  startTime: z.string().transform(str => new Date(str)),
  endTime: z.string().transform(str => new Date(str)),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  resources: z.array(z.object({
    type: z.string(),
    quantity: z.number(),
  })),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const schedule = await db
      .select()
      .from(productionSchedule)
      .where(eq(productionSchedule.companyId, companyId));
    return NextResponse.json({ success: true, data: schedule });
  } catch (err) {
    console.error('Error in GET production schedule:', err);
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
    const validatedData = scheduleSchema.parse(body);
    
    const [entry] = await db
      .insert(productionSchedule)
      .values({
        ...validatedData,
        companyId,
      })
      .returning();
      
    return NextResponse.json({ success: true, data: entry });
  } catch (err) {
    console.error('Error in POST production schedule:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 