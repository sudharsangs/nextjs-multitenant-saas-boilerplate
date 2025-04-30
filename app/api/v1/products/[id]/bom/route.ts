import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, boms, bomComponents } from '@/db/schema';
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

    // Get active BOM for the product
    const [bom] = await db
      .select()
      .from(boms)
      .where(and(
        eq(boms.productId, productId),
        eq(boms.companyId, companyId),
        eq(boms.isActive, true)
      ))
      .limit(1);

    if (!bom) {
      return NextResponse.json(
        { error: 'No active BOM found for this product' },
        { status: 404 }
      );
    }

    // Get BOM components
    const components = await db
      .select({
        id: bomComponents.id,
        productId: bomComponents.productId,
        quantity: bomComponents.quantity,
        product: {
          id: products.id,
          name: products.name,
          code: products.code,
          unit: products.unit,
        },
      })
      .from(bomComponents)
      .leftJoin(products, eq(bomComponents.productId, products.id))
      .where(eq(bomComponents.bomId, bom.id));

    return NextResponse.json({
      ...bom,
      components,
    });
  } catch (err) {
    console.error('Error in GET product BOM:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 