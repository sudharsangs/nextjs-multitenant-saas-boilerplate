import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { productionCosts } from '@/db/schema';
import { getAuthUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

const costSchema = z.object({
  productionOrderId: z.string(),
  type: z.enum(['MATERIAL', 'LABOR', 'OVERHEAD']),
  amount: z.number().positive(),
  currency: z.string(),
  date: z.string().transform(str => new Date(str)),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const costs = await db
      .select()
      .from(productionCosts)
      .where(eq(productionCosts.companyId, companyId));
    return NextResponse.json({ success: true, data: costs });
  } catch (err) {
    console.error('Error in GET production costs:', err);
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
    const validatedData = costSchema.parse(body);
    
    const [cost] = await db
      .insert(productionCosts)
      .values({
        ...validatedData,
        companyId,
      })
      .returning();
      
    return NextResponse.json({ success: true, data: cost });
  } catch (err) {
    console.error('Error in POST production cost:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 