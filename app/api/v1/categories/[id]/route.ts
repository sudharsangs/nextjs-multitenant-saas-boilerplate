import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getToken } from '@/lib/cookies';

const categoryUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categoryId = params.id;

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (err) {
    console.error('Error in GET category by id:', err);
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
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categoryId = params.id;
    const body = await request.json();
    const categoryData = categoryUpdateSchema.parse(body);

    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        ...categoryData,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, categoryId))
      .returning();

    return NextResponse.json(updatedCategory);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT category by id:', err);
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
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categoryId = params.id;

    // Check if category exists
    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete category (physical deletion)
    await db
      .delete(categories)
      .where(eq(categories.id, categoryId));

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE category by id:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
