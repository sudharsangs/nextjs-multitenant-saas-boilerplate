import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { invoices, payments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const paymentSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.string(),
  paymentGateway: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
  paymentMetadata: z.record(z.any()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const { id } = params;

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

    // Get all payments for the invoice
    const paymentsList = await db
      .select()
      .from(payments)
      .where(and(
        eq(payments.invoiceId, id),
        eq(payments.companyId, companyId)
      ))
      .orderBy(payments.paymentDate);

    return NextResponse.json(paymentsList);
  } catch (err) {
    console.error('Error in GET invoice payments:', err);
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
    const paymentData = paymentSchema.parse(body);

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

    // Check if invoice is not in DRAFT or CANCELLED status
    if (invoice.status === 'DRAFT' || invoice.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot accept payments for draft or cancelled invoices' },
        { status: 400 }
      );
    }

    // Check if payment amount is valid
    const currentBalance = parseFloat(invoice.balanceAmount);
    if (paymentData.amount > currentBalance) {
      return NextResponse.json(
        { error: 'Payment amount exceeds the balance due' },
        { status: 400 }
      );
    }

    return await db.transaction(async (tx) => {
      // Create the payment record
      const [payment] = await tx
        .insert(payments)
        .values({
          companyId,
          invoiceId: id,
          amount: paymentData.amount.toString(),
          currency: invoice.currency,
          paymentDate: new Date(),
          paymentMethod: paymentData.paymentMethod,
          paymentGateway: paymentData.paymentGateway,
          status: 'COMPLETED',
          referenceNumber: paymentData.referenceNumber,
          notes: paymentData.notes,
          paymentMetadata: paymentData.paymentMetadata,
        })
        .returning();

      // Update invoice payment status
      const paidAmount = parseFloat(invoice.paidAmount) + paymentData.amount;
      const balanceAmount = parseFloat(invoice.totalAmount) - paidAmount;
      
      let status = invoice.status;
      if (balanceAmount <= 0) {
        status = 'PAID';
      } else if (paidAmount > 0) {
        status = 'PARTIALLY_PAID';
      }

      // Update the invoice
      const [updatedInvoice] = await tx
        .update(invoices)
        .set({
          paidAmount: paidAmount.toString(),
          balanceAmount: balanceAmount.toString(),
          status,
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, id))
        .returning();

      return NextResponse.json({
        payment,
        invoice: updatedInvoice,
      });
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST invoice payment:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
