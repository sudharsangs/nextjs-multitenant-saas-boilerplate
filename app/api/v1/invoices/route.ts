import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { invoices, invoiceItems, customers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const invoiceItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  taxRate: z.number().min(0),
});

const invoiceSchema = z.object({
  companyId: z.string(),
  customerId: z.string(),
  orderId: z.string().optional(),
  quoteId: z.string().optional(),
  issueDate: z.string(), // Date in ISO format
  dueDate: z.string(), // Date in ISO format
  currency: z.string().default('INR'),
  discountAmount: z.number().default(0),
  discountPercentage: z.number().default(0),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = getAuthUser(request)?.companyId;
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');

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

    const whereConditions = [eq(invoices.companyId, companyId)];
    
    if (customerId) {
      whereConditions.push(eq(invoices.customerId, customerId));
    }
    
    if (status) {
      if (['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'PARTIALLY_PAID'].includes(status)) {
        whereConditions.push(eq(invoices.status, status as 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'PARTIALLY_PAID'));
      }
    }

    const invoicesList = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        customerId: invoices.customerId,
        status: invoices.status,
        issueDate: invoices.issueDate,
        dueDate: invoices.dueDate,
        totalAmount: invoices.totalAmount,
        paidAmount: invoices.paidAmount,
        balanceAmount: invoices.balanceAmount,
        createdAt: invoices.createdAt,
        updatedAt: invoices.updatedAt,
        customer: {
          id: customers.id,
          name: customers.name,
        }
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .where(and(...whereConditions))
      .orderBy(invoices.createdAt);

    return NextResponse.json(invoicesList);
  } catch (err) {
    console.error('Error in GET invoices:', err);
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
    const invoiceData = invoiceSchema.parse(body);

    // Verify that the user is creating an invoice for their own company
    if (invoiceData.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized to create invoices for other companies' },
        { status: 403 }
      );
    }

    // Check if customer exists and belongs to the company
    const [existingCustomer] = await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.id, invoiceData.customerId),
        eq(customers.companyId, invoiceData.companyId),
        eq(customers.isActive, true)
      ))
      .limit(1);

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found or inactive' },
        { status: 400 }
      );
    }

    // Calculate totals from items
    let subtotal = 0;
    let totalTaxAmount = 0;

    for (const item of invoiceData.items) {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemTaxAmount = (itemSubtotal * item.taxRate) / 100;
      
      subtotal += itemSubtotal;
      totalTaxAmount += itemTaxAmount;
    }

    // Apply discount if applicable
    let discountAmount = 0;
    if (invoiceData.discountPercentage > 0) {
      discountAmount = (subtotal * invoiceData.discountPercentage) / 100;
    } else if (invoiceData.discountAmount > 0) {
      discountAmount = invoiceData.discountAmount;
    }

    const totalAmount = subtotal + totalTaxAmount - discountAmount;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    // Create invoice with items
    return await db.transaction(async (tx) => {
      const [invoice] = await tx
        .insert(invoices)
        .values({
          companyId: invoiceData.companyId,
          invoiceNumber,
          customerId: invoiceData.customerId,
          orderId: invoiceData.orderId,
          quoteId: invoiceData.quoteId,
          status: 'DRAFT',
          issueDate: new Date(invoiceData.issueDate),
          dueDate: new Date(invoiceData.dueDate),
          currency: invoiceData.currency,
          totalAmount: totalAmount.toString(),
          taxAmount: totalTaxAmount.toString(),
          discountAmount: discountAmount.toString(),
          discountPercentage: invoiceData.discountPercentage.toString(),
          paidAmount: '0',
          balanceAmount: totalAmount.toString(),
          billingAddress: invoiceData.billingAddress,
          shippingAddress: invoiceData.shippingAddress,
          paymentTerms: invoiceData.paymentTerms,
          notes: invoiceData.notes,
          termsAndConditions: invoiceData.termsAndConditions,
        })
        .returning();

      // Create invoice items
      const createdItems = [];
      for (const item of invoiceData.items) {
        const itemSubtotal = item.quantity * item.unitPrice;
        const itemTaxAmount = (itemSubtotal * item.taxRate) / 100;
        const itemTotal = itemSubtotal + itemTaxAmount;

        const [createdItem] = await tx
          .insert(invoiceItems)
          .values({
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            taxRate: item.taxRate.toString(),
            taxAmount: itemTaxAmount.toString(),
            totalPrice: itemTotal.toString(),
          })
          .returning();
        
        createdItems.push(createdItem);
      }

      const fullInvoice = {
        ...invoice,
        items: createdItems
      };

      return NextResponse.json(fullInvoice);
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST invoices:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
