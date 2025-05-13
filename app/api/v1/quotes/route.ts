import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { quotes, quoteItems } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const quoteItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

const quoteSchema = z.object({
  customerId: z.string(),
  validUntil: z.string(),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z.array(quoteItemSchema).min(1),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const quotesWithData = await db.query.quotes.findMany({
      where: eq(quotes.companyId, user.companyId),
      with: {
        customer: true,
      },
      orderBy: (quotes, { desc }) => [desc(quotes.createdAt)],
    });

    return NextResponse.json({
      success: true,
      data: quotesWithData
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const json = await request.json();
    const validatedData = quoteSchema.parse(json);

    // Calculate totals
    const items = validatedData.items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = totalAmount * 0.18; // Assuming 18% GST

    // Generate quote number
    const quoteCount = await db.select({ 
      count: sql<number>`cast(count(*) as integer)`
    })
    .from(quotes)
    .where(eq(quotes.companyId, user.companyId));
    
    const quoteNumber = `QT-${new Date().getFullYear()}-${(quoteCount[0].count + 1).toString().padStart(4, '0')}`;

    // Create quote with proper schema fields
    const [quote] = await db.insert(quotes).values({
      companyId: user.companyId,
      quoteNumber: quoteNumber,
      customerId: validatedData.customerId,
      status: 'DRAFT',
      validUntil: new Date(validatedData.validUntil),
      totalAmount: totalAmount,
      taxAmount: taxAmount,
      notes: validatedData.notes || null,
      termsAndConditions: validatedData.termsAndConditions || null,
    }).returning();

    // Create quote items with tax rates and tax amounts
    await db.insert(quoteItems).values(
      items.map(item => ({
        quoteId: quote.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        taxRate: "18.00", // 18% GST
        taxAmount: ((item.quantity * item.unitPrice) * 0.18).toString(),
        totalPrice: (item.quantity * item.unitPrice).toString(),
      } as typeof quoteItems.$inferInsert))
    );

    return NextResponse.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
