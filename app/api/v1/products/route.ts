import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getToken } from '@/lib/cookies';
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

const categorySchema = z.object({
  companyId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const query = db
      .select()
      .from(products)
      .where(
        categoryId 
          ? and(
              eq(products.companyId, companyId),
              eq(products.isActive, true),
              eq(products.categoryId, categoryId)
            )
          : and(
              eq(products.companyId, companyId),
              eq(products.isActive, true)
            )
      );

    const productsList = await query;

    return NextResponse.json(productsList);
  } catch (err) {
    console.error('Error in GET products:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const body = await request.json();
    const productData = productSchema.parse(body);

    // Check if product code already exists for the company
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(and(
        eq(products.code, productData.code),
        eq(products.companyId, companyId)
      ))
      .limit(1);

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product code already exists' },
        { status: 400 }
      );
    }

    const [product] = await db
      .insert(products)
      .values({
        ...productData,
        companyId,
        isActive: true,
      })
      .returning();

    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST products:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const productData = productSchema.parse(body);

    const [product] = await db.update(products)
      .set(productData)
      .where(eq(products.id, productId))
      .returning();

    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT products:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await db.delete(products)
      .where(eq(products.id, productId));

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE products:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Categories
export async function GET_CATEGORIES(request: Request) {
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

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const categoriesList = await db
      .select()
      .from(categories)
      .where(eq(categories.companyId, companyId));

    return NextResponse.json(categoriesList);
  } catch (err) {
    console.error('Error in GET categories:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST_CATEGORY(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const categoryData = categorySchema.parse(body);

    const [category] = await db.insert(categories).values(categoryData).returning();

    return NextResponse.json(category);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST category:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT_CATEGORY(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const categoryData = categorySchema.parse(body);

    const [category] = await db.update(categories)
      .set(categoryData)
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(category);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT category:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE_CATEGORY(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    await db.delete(categories)
      .where(eq(categories.id, categoryId));

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE category:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}