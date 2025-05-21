import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { invoices, invoiceItems, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const invoiceItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  taxRate: z.number().min(0),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const { id } = params;

    // Verify the invoice belongs to the company
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

    // Get all items for the invoice
    const items = await db
      .select({
        id: invoiceItems.id,
        productId: invoiceItems.productId,
        quantity: invoiceItems.quantity,
        unitPrice: invoiceItems.unitPrice,
        taxRate: invoiceItems.taxRate,
        taxAmount: invoiceItems.taxAmount,
        totalPrice: invoiceItems.totalPrice,
        product: {
          id: products.id,
          name: products.name,
          code: products.code,
          unit: products.unit,
        }
      })
      .from(invoiceItems)
      .leftJoin(products, eq(invoiceItems.productId, products.id))
      .where(eq(invoiceItems.invoiceId, id));

    return NextResponse.json(items);
  } catch (err) {
    console.error('Error in GET invoice items:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const { id } = params;
    const body = await request.json();
    const itemData = invoiceItemSchema.parse(body);

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
        { error: 'Items can only be added to draft invoices' },
        { status: 400 }
      );
    }

    // Verify product exists
    const [product] = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, itemData.productId),
        eq(products.companyId, companyId)
      ))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 400 }
      );
    }

    // Calculate item totals
    const subtotal = itemData.quantity * itemData.unitPrice;
    const taxAmount = (subtotal * itemData.taxRate) / 100;
    const totalPrice = subtotal + taxAmount;

    // Create the invoice item
    const [createdItem] = await db
      .insert(invoiceItems)
      .values({
        invoiceId: id,
        productId: itemData.productId,
        quantity: itemData.quantity,
        unitPrice: itemData.unitPrice.toString(),
        taxRate: itemData.taxRate.toString(),
        taxAmount: taxAmount.toString(),
        totalPrice: totalPrice.toString(),
      })
      .returning();

    // Update invoice totals
    await updateInvoiceTotals(id);

    return NextResponse.json(createdItem);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST invoice item:', err);
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
