import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

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

    // TODO: Implement product variants table and return variants
    // For now, return empty array as variants are not implemented yet
    return NextResponse.json([]);
  } catch (err) {
    console.error('Error in GET product variants:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 