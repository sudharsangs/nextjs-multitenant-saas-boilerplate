import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { taxRates } from '@/db/schema';
import { eq, and, not } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const updateTaxRateSchema = z.object({
  hsnCode: z.string().min(1).optional(),
  type: z.enum(['GST', 'IGST', 'CGST', 'SGST', 'CESS']).optional(),
  rate: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const taxRateId = params.id;

    const [taxRate] = await db
      .select()
      .from(taxRates)
      .where(and(
        eq(taxRates.id, taxRateId),
        eq(taxRates.companyId, companyId)
      ))
      .limit(1);

    if (!taxRate) {
      return NextResponse.json(
        { error: 'Tax rate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(taxRate);
  } catch (err) {
    console.error('Error in GET tax rate:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const taxRateId = params.id;
    const body = await request.json();
    const updateData = updateTaxRateSchema.parse(body);

    // Verify tax rate exists and belongs to company
    const [existingTaxRate] = await db
      .select()
      .from(taxRates)
      .where(and(
        eq(taxRates.id, taxRateId),
        eq(taxRates.companyId, companyId)
      ))
      .limit(1);

    if (!existingTaxRate) {
      return NextResponse.json(
        { error: 'Tax rate not found' },
        { status: 404 }
      );
    }

    // If updating HSN code or type, check for duplicates
    if (updateData.hsnCode || updateData.type) {
      const [duplicateTaxRate] = await db
        .select()
        .from(taxRates)
        .where(and(
          eq(taxRates.hsnCode, updateData.hsnCode || existingTaxRate.hsnCode),
          eq(taxRates.type, updateData.type || existingTaxRate.type),
          eq(taxRates.companyId, companyId),
          not(eq(taxRates.id, taxRateId))
        ))
        .limit(1);

      if (duplicateTaxRate) {
        return NextResponse.json(
          { error: 'Tax rate already exists for this HSN code and type' },
          { status: 400 }
        );
      }
    }

    const [updatedTaxRate] = await db
      .update(taxRates)
      .set({
        hsnCode: updateData.hsnCode,
        type: updateData.type,
        rate: updateData.rate?.toString(),
        description: updateData.description,
        isActive: updateData.isActive,
        updatedAt: new Date(),
      })
      .where(and(
        eq(taxRates.id, taxRateId),
        eq(taxRates.companyId, companyId)
      ))
      .returning();

    return NextResponse.json(updatedTaxRate);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT tax rate:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const taxRateId = params.id;

    // Verify tax rate exists and belongs to company
    const [existingTaxRate] = await db
      .select()
      .from(taxRates)
      .where(and(
        eq(taxRates.id, taxRateId),
        eq(taxRates.companyId, companyId)
      ))
      .limit(1);

    if (!existingTaxRate) {
      return NextResponse.json(
        { error: 'Tax rate not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await db
      .update(taxRates)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(and(
        eq(taxRates.id, taxRateId),
        eq(taxRates.companyId, companyId)
      ));

    return NextResponse.json(
      { message: 'Tax rate deleted successfully' }
    );
  } catch (err) {
    console.error('Error in DELETE tax rate:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 