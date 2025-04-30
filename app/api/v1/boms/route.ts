import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { boms, bomComponents, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const componentSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
});

const bomSchema = z.object({
  companyId: z.string(),
  productId: z.string(),
  version: z.string(),
  components: z.array(componentSchema).min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');
    const productId = searchParams.get('productId');

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Verify that the user has access to the requested company
    if (requestedCompanyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized access to company data' },
        { status: 403 }
      );
    }

    const whereConditions = [
      eq(boms.companyId, companyId),
      eq(boms.isActive, true)
    ];
    
    if (productId) {
      whereConditions.push(eq(boms.productId, productId));
    }

    const bomsList = await db
      .select({
        id: boms.id,
        productId: boms.productId,
        version: boms.version,
        isActive: boms.isActive,
        createdAt: boms.createdAt,
        updatedAt: boms.updatedAt,
        product: {
          id: products.id,
          name: products.name,
          code: products.code,
        }
      })
      .from(boms)
      .leftJoin(products, eq(boms.productId, products.id))
      .where(and(...whereConditions));

    return NextResponse.json(bomsList);
  } catch (err) {
    console.error('Error in GET BOMs:', err);
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
    const bomData = bomSchema.parse(body);

    // Verify that the user is creating a BOM for their own company
    if (bomData.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized to create BOMs for other companies' },
        { status: 403 }
      );
    }

    // Check if product exists and belongs to the company
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, bomData.productId),
        eq(products.companyId, bomData.companyId),
        eq(products.isActive, true)
      ))
      .limit(1);

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 400 }
      );
    }

    // Check if there's already an active BOM for this product
    const [existingBom] = await db
      .select()
      .from(boms)
      .where(and(
        eq(boms.productId, bomData.productId),
        eq(boms.companyId, bomData.companyId),
        eq(boms.isActive, true),
        eq(boms.version, bomData.version)
      ))
      .limit(1);

    if (existingBom) {
      return NextResponse.json(
        { error: 'An active BOM with this version already exists for this product' },
        { status: 400 }
      );
    }

    // Create BOM and components
    return await db.transaction(async (tx) => {
      const [createdBom] = await tx
        .insert(boms)
        .values({
          companyId: bomData.companyId,
          productId: bomData.productId,
          version: bomData.version,
          isActive: true,
        })
        .returning();

      // Create BOM components
      for (const component of bomData.components) {
        await tx
          .insert(bomComponents)
          .values({
            bomId: createdBom.id,
            productId: component.productId,
            quantity: component.quantity.toString(),
          });
      }

      const fullBom = {
        ...createdBom,
        components: bomData.components
      };

      return NextResponse.json(fullBom);
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST BOM:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}