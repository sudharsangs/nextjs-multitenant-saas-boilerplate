import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const productSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  hsnCode: z.string().optional(),
  unit: z.enum(['PIECE', 'KG', 'LITER', 'METER', 'SQUARE_METER', 'CUBIC_METER']).default('PIECE'),
  reorderPoint: z.number().optional(),
  safetyStock: z.number().optional(),
  leadTime: z.number().optional(),
  shelfLife: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const productId = params.id;

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

    return NextResponse.json(product);
  } catch (err) {
    console.error('Error in GET product:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const productId = params.id;
    const body = await request.json();
    const productData = productSchema.parse(body);

    // Check if product exists and belongs to the company
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.companyId, companyId)
      ))
      .limit(1);

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // If code is being changed, check if new code already exists
    if (productData.code !== existingProduct.code) {
      const [duplicateProduct] = await db
        .select()
        .from(products)
        .where(and(
          eq(products.code, productData.code),
          eq(products.companyId, companyId)
        ))
        .limit(1);

      if (duplicateProduct) {
        return NextResponse.json(
          { error: 'Product code already exists' },
          { status: 400 }
        );
      }
    }

    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(and(
        eq(products.id, productId),
        eq(products.companyId, companyId)
      ))
      .returning();

    return NextResponse.json(updatedProduct);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT product:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const productId = params.id;

    // Check if product exists and belongs to the company
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, productId),
        eq(products.companyId, companyId)
      ))
      .limit(1);

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await db
      .update(products)
      .set({ isActive: false })
      .where(and(
        eq(products.id, productId),
        eq(products.companyId, companyId)
      ));

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE product:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 