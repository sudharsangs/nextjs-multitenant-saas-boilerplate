import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { invoices, invoiceItems, customers, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const updateInvoiceSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'PARTIALLY_PAID']).optional(),
  issueDate: z.string().optional(), // Date in ISO format
  dueDate: z.string().optional(), // Date in ISO format
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  paidAmount: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const { id } = params;

    // Find the invoice
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

    // Get the invoice items
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

    // Get customer details
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, invoice.customerId))
      .limit(1);

    const fullInvoice = {
      ...invoice,
      items,
      customer
    };

    return NextResponse.json(fullInvoice);
  } catch (err) {
    console.error('Error in GET invoice by ID:', err);
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
    const { id } = params;
    const body = await request.json();
    const updateData = updateInvoiceSchema.parse(body);

    // Check if invoice exists and belongs to the company
    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(and(
        eq(invoices.id, id),
        eq(invoices.companyId, companyId)
      ))
      .limit(1);

    if (!existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Prepare update values
    const updateValues: Partial<typeof existingInvoice> = {};

    if (updateData.status) {
      updateValues.status = updateData.status;
    }

    if (updateData.issueDate) {
      updateValues.issueDate = new Date(updateData.issueDate);
    }

    if (updateData.dueDate) {
      updateValues.dueDate = new Date(updateData.dueDate);
    }

    if (updateData.billingAddress !== undefined) {
      updateValues.billingAddress = updateData.billingAddress;
    }

    if (updateData.shippingAddress !== undefined) {
      updateValues.shippingAddress = updateData.shippingAddress;
    }
    
    if (updateData.paymentTerms !== undefined) {
      updateValues.paymentTerms = updateData.paymentTerms;
    }
    
    if (updateData.notes !== undefined) {
      updateValues.notes = updateData.notes;
    }
    
    if (updateData.termsAndConditions !== undefined) {
      updateValues.termsAndConditions = updateData.termsAndConditions;
    }

    // Handle payment updates
    if (updateData.paidAmount !== undefined) {
      const paidAmount = updateData.paidAmount;
      const totalAmount = parseFloat(existingInvoice.totalAmount);
      
      updateValues.paidAmount = paidAmount.toString();
      updateValues.balanceAmount = (totalAmount - paidAmount).toString();
      
      // Update status based on payment
      if (paidAmount >= totalAmount) {
        updateValues.status = 'PAID';
      } else if (paidAmount > 0) {
        updateValues.status = 'PARTIALLY_PAID';
      }
    }

    // Update the invoice
    const [updatedInvoice] = await db
      .update(invoices)
      .set({
        ...updateValues,
        updatedAt: new Date()
      })
      .where(eq(invoices.id, id))
      .returning();

    return NextResponse.json(updatedInvoice);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT invoice:', err);
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
    const { id } = params;

    // Check if invoice exists and belongs to the company
    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(and(
        eq(invoices.id, id),
        eq(invoices.companyId, companyId)
      ))
      .limit(1);

    if (!existingInvoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if invoice is in DRAFT status
    if (existingInvoice.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Only draft invoices can be deleted' },
        { status: 400 }
      );
    }

    // Delete invoice items first
    await db
      .delete(invoiceItems)
      .where(eq(invoiceItems.invoiceId, id));

    // Delete the invoice
    await db
      .delete(invoices)
      .where(eq(invoices.id, id));

    return NextResponse.json(
      { message: 'Invoice deleted successfully' }
    );
  } catch (err) {
    console.error('Error in DELETE invoice:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
