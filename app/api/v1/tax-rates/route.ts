import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { taxRates } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const taxRateSchema = z.object({
  hsnCode: z.string().min(1),
  type: z.enum(['GST', 'IGST', 'CGST', 'SGST', 'CESS']),
  rate: z.number().min(0).max(100),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const hsnCode = searchParams.get('hsnCode');

    // Create base conditions array
    const conditions = [
      eq(taxRates.companyId, companyId),
      eq(taxRates.isActive, true)
    ];
    
    // Add hsnCode condition if provided
    if (hsnCode) {
      conditions.push(eq(taxRates.hsnCode, hsnCode));
    }

    // Execute query with all conditions
    const taxRatesList = await db
      .select()
      .from(taxRates)
      .where(and(...conditions));

    return NextResponse.json(taxRatesList);
  } catch (err) {
    console.error('Error in GET tax rates:', err);
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
    const taxRateData = taxRateSchema.parse(body);

    // Check if tax rate already exists for the HSN code and type
    const [existingTaxRate] = await db
      .select()
      .from(taxRates)
      .where(and(
        eq(taxRates.hsnCode, taxRateData.hsnCode),
        eq(taxRates.type, taxRateData.type),
        eq(taxRates.companyId, companyId)
      ))
      .limit(1);

    if (existingTaxRate) {
      return NextResponse.json(
        { error: 'Tax rate already exists for this HSN code and type' },
        { status: 400 }
      );
    }

    const [taxRate] = await db
      .insert(taxRates)
      .values({
        companyId,
        hsnCode: taxRateData.hsnCode,
        type: taxRateData.type,
        rate: taxRateData.rate.toString(),
        description: taxRateData.description,
        isActive: taxRateData.isActive
      })
      .returning();

    return NextResponse.json(taxRate, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST tax rate:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}