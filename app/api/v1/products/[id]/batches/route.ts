import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { products, batches } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const batchSchema = z.object({
  batchNumber: z.string().min(2),
  manufacturingDate: z.string().transform(str => new Date(str)),
  expiryDate: z.string().transform(str => new Date(str)).optional(),
  quantity: z.number().positive(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'RECALLED']).default('ACTIVE'),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const productId = params.id;

    // Verify product exists and belongs to company
    const [product] = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.companyId, companyId),
        eq(products.isActive, true)
      ))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get all batches for the product
    const productBatches = await db
      .select()
      .from(batches)
      .where(and(
        eq(batches.productId, productId),
        eq(batches.companyId, companyId)
      ))
      .orderBy(batches.createdAt);

    return NextResponse.json(productBatches);
  } catch (err) {
    console.error('Error in GET product batches:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const productId = params.id;
    const body = await request.json();
    const batchData = batchSchema.parse(body);

    // Verify product exists and belongs to company
    const [product] = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.companyId, companyId),
        eq(products.isActive, true)
      ))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if batch number already exists for this product
    const [existingBatch] = await db
      .select()
      .from(batches)
      .where(and(
        eq(batches.productId, productId),
        eq(batches.batchNumber, batchData.batchNumber),
        eq(batches.companyId, companyId)
      ))
      .limit(1);

    if (existingBatch) {
      return NextResponse.json(
        { error: 'Batch number already exists for this product' },
        { status: 400 }
      );
    }

    // Create new batch
    const [newBatch] = await db
      .insert(batches)
      .values({
        ...batchData,
        productId,
        companyId,
      })
      .returning();

    return NextResponse.json(newBatch, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST product batch:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 