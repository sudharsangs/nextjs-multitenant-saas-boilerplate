import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { manufacturingUnits } from '@/db/schema';
import { getAuthUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

const unitSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['ASSEMBLY', 'MACHINING', 'PACKAGING']),
  capacity: z.number().positive(),
  status: z.enum(['ACTIVE', 'MAINTENANCE', 'INACTIVE']),
  locationId: z.string(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const units = await db
      .select()
      .from(manufacturingUnits)
      .where(eq(manufacturingUnits.companyId, companyId));
    return NextResponse.json({ success: true, data: units });
  } catch (err) {
    console.error('Error in GET manufacturing units:', err);
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
    const validatedData = unitSchema.parse(body);
    
    const [unit] = await db
      .insert(manufacturingUnits)
      .values({
        ...validatedData,
        companyId,
      })
      .returning();
      
    return NextResponse.json({ success: true, data: unit });
  } catch (err) {
    console.error('Error in POST manufacturing unit:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
