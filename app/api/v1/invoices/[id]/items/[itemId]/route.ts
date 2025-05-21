import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { invoices, invoiceItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const updateItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
  unitPrice: z.number().positive().optional(),
  taxRate: z.number().min(0).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const { id, itemId } = params;
    const body = await request.json();
    const updateData = updateItemSchema.parse(body);

    // Verify the invoice exists and belongs to the company
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(
        eq(invoices.id, id),
        eq(invoices.companyId, companyId)
      ))
      .limit(1);

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if invoice is in DRAFT status
    if (invoice.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Items can only be modified in draft invoices' },
        { status: 400 }
      );
    }

    // Get the invoice item
    const [item] = await db
      .select()
      .from(invoiceItems)
      .where(and(
        eq(invoiceItems.id, itemId),
        eq(invoiceItems.invoiceId, id)
      ))
      .limit(1);

    if (!item) {
      return NextResponse.json(
        { error: 'Invoice item not found' },
        { status: 404 }
      );
    }

    // Calculate new values
    const quantity = updateData.quantity !== undefined ? updateData.quantity : parseInt(String(item.quantity));
    const unitPrice = updateData.unitPrice !== undefined ? updateData.unitPrice : parseFloat(item.unitPrice);
    const taxRate = updateData.taxRate !== undefined ? updateData.taxRate : parseFloat(item.taxRate);
    
    const subtotal = quantity * unitPrice;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalPrice = subtotal + taxAmount;

    // Update the item
    const [updatedItem] = await db
      .update(invoiceItems)
      .set({
        quantity: quantity,
        unitPrice: unitPrice.toString(),
        taxRate: taxRate.toString(),
        taxAmount: taxAmount.toString(),
        totalPrice: totalPrice.toString(),
      })
      .where(eq(invoiceItems.id, itemId))
      .returning();

    // Update invoice totals
    await updateInvoiceTotals(id);

    return NextResponse.json(updatedItem);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT invoice item:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const { id, itemId } = params;

    // Verify the invoice exists and belongs to the company
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(
        eq(invoices.id, id),
        eq(invoices.companyId, companyId)
      ))
      .limit(1);

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if invoice is in DRAFT status
    if (invoice.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Items can only be removed from draft invoices' },
        { status: 400 }
      );
    }

    // Check if item exists
    const [item] = await db
      .select()
      .from(invoiceItems)
      .where(and(
        eq(invoiceItems.id, itemId),
        eq(invoiceItems.invoiceId, id)
      ))
      .limit(1);

    if (!item) {
      return NextResponse.json(
        { error: 'Invoice item not found' },
        { status: 404 }
      );
    }

    // Delete the item
    await db
      .delete(invoiceItems)
      .where(eq(invoiceItems.id, itemId));

    // Update invoice totals
    await updateInvoiceTotals(id);

    return NextResponse.json(
      { message: 'Invoice item deleted successfully' }
    );
  } catch (err) {
    console.error('Error in DELETE invoice item:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateInvoiceTotals(invoiceId: string) {
  // Get all items for the invoice
  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, invoiceId));

  // Calculate totals
  let subtotal = 0;
  let totalTaxAmount = 0;

  items.forEach(item => {
    subtotal += parseFloat(item.totalPrice) - parseFloat(item.taxAmount);
    totalTaxAmount += parseFloat(item.taxAmount);
  });

  // Get invoice to check discount
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .limit(1);

  // Apply discount
  let discountAmount = 0;
  if (invoice) {
    discountAmount = parseFloat(invoice.discountAmount);
  }

  const totalAmount = subtotal + totalTaxAmount - discountAmount;
  const paidAmount = invoice ? parseFloat(invoice.paidAmount) : 0;
  const balanceAmount = totalAmount - paidAmount;

  // Update invoice
  await db
    .update(invoices)
    .set({
      totalAmount: totalAmount.toString(),
      taxAmount: totalTaxAmount.toString(),
      balanceAmount: balanceAmount.toString(),
      updatedAt: new Date(),
    })
    .where(eq(invoices.id, invoiceId));
}
