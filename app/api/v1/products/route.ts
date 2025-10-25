import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

// GET /api/v1/products - List all products for the company
export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productsList = await db
      .select()
      .from(products)
      .where(eq(products.companyId, companyId))
      .orderBy(desc(products.createdAt));

    return NextResponse.json({
      success: true,
      data: productsList,
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/v1/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, price, stock, sku } = body;

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Create product
    const [newProduct] = await db
      .insert(products)
      .values({
        companyId,
        name,
        description: description || null,
        category: category || 'OTHER',
        price: price.toString(),
        stock: stock || 0,
        sku: sku || null,
        isActive: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
