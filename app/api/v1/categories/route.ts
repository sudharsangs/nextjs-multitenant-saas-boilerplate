import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getToken } from '@/lib/server-cookies';

const categorySchema = z.object({
  companyId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
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
    const categoryData = categorySchema.parse(body);

    const [category] = await db
      .insert(categories)
      .values(categoryData)
      .returning();

    return NextResponse.json(category);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST categories:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
