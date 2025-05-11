import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { batches } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getToken } from '@/lib/server-cookies';

const batchSchema = z.object({
  companyId: z.string(),
  batchNumber: z.string().min(1),
  productId: z.string(),
  manufacturingDate: z.string().transform(str => new Date(str)),
  expiryDate: z.string().transform(str => new Date(str)).optional(),
  quantity: z.number().int().positive(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'RECALLED']).default('ACTIVE'),
});

export async function GET(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const productId = searchParams.get('productId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const whereConditions = [eq(batches.companyId, companyId)];
    
    if (productId) {
      whereConditions.push(eq(batches.productId, productId));
    }

    const batchesList = await db
      .select()
      .from(batches)
      .where(and(...whereConditions));

    return NextResponse.json(batchesList);
  } catch (err) {
    console.error('Error in GET batches:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const batchData = batchSchema.parse(body);

    // Check if batch number is unique
    const [existingBatch] = await db
      .select()
      .from(batches)
      .where(eq(batches.batchNumber, batchData.batchNumber))
      .limit(1);

    if (existingBatch) {
      return NextResponse.json(
        { error: 'Batch number already exists' },
        { status: 400 }
      );
    }

    const [batch] = await db
      .insert(batches)
      .values(batchData)
      .returning();

    return NextResponse.json(batch);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST batches:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
