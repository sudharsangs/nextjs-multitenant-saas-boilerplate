import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

// GET /api/v1/products/:id - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, params.id), eq(products.companyId, companyId)))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/v1/products/:id - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, price, stock, sku, isActive } = body;

    // Check if product exists and belongs to company
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, params.id), eq(products.companyId, companyId)))
      .limit(1);

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    const [updatedProduct] = await db
      .update(products)
      .set({
        name: name || existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        category: category || existingProduct.category,
        price: price ? price.toString() : existingProduct.price,
        stock: stock !== undefined ? stock : existingProduct.stock,
        sku: sku !== undefined ? sku : existingProduct.sku,
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, params.id), eq(products.companyId, companyId)))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/products/:id - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if product exists and belongs to company
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, params.id), eq(products.companyId, companyId)))
      .limit(1);

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product
    await db
      .delete(products)
      .where(and(eq(products.id, params.id), eq(products.companyId, companyId)));

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
