import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { batches } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getToken } from '@/lib/server-cookies';

const batchUpdateSchema = z.object({
  expiryDate: z.string().transform(str => new Date(str)).optional(),
  quantity: z.number().int().positive().optional(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'RECALLED']).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken();;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const batchId = params.id;

    const [batch] = await db
      .select()
      .from(batches)
      .where(eq(batches.id, batchId))
      .limit(1);

    if (!batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(batch);
  } catch (err) {
    console.error('Error in GET batch by id:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken();;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const batchId = params.id;
    const body = await request.json();
    const batchData = batchUpdateSchema.parse(body);

    const [existingBatch] = await db
      .select()
      .from(batches)
      .where(eq(batches.id, batchId))
      .limit(1);

    if (!existingBatch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    const [updatedBatch] = await db
      .update(batches)
      .set({
        ...batchData,
        updatedAt: new Date(),
      })
      .where(eq(batches.id, batchId))
      .returning();

    return NextResponse.json(updatedBatch);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT batch by id:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken();;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const batchId = params.id;

    // Check if batch exists
    const [existingBatch] = await db
      .select()
      .from(batches)
      .where(eq(batches.id, batchId))
      .limit(1);

    if (!existingBatch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    // Delete batch
    await db
      .delete(batches)
      .where(eq(batches.id, batchId));

    return NextResponse.json({ message: 'Batch deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE batch by id:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
