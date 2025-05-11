import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { purchaseOrders, poItems, vendors } from '@/db/schema';
import {PoStatusEnum} from '@/lib/types'
import { eq, and } from 'drizzle-orm';

import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const poItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

const purchaseOrderSchema = z.object({
  companyId: z.string(),
  vendorId: z.string(),
  items: z.array(poItemSchema).min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = getAuthUser(request)?.companyId;
    const vendorId = searchParams.get('vendorId');
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

    const whereConditions = [eq(purchaseOrders.companyId, companyId)];
    
    if (vendorId) {
      whereConditions.push(eq(purchaseOrders.vendorId, vendorId));
    }
    
    if (status) {
      if (['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'PARTIALLY_RECEIVED', 'FULLY_RECEIVED', 'CLOSED', 'CANCELLED'].includes(status)) {
        whereConditions.push(eq(purchaseOrders.status, status as PoStatusEnum));   
      }
    }

    const poList = await db
      .select({
        id: purchaseOrders.id,
        poNumber: purchaseOrders.poNumber,
        vendorId: purchaseOrders.vendorId,
        status: purchaseOrders.status,
        totalAmount: purchaseOrders.totalAmount,
        createdAt: purchaseOrders.createdAt,
        updatedAt: purchaseOrders.updatedAt,
        vendor: {
          id: vendors.id,
          name: vendors.name,
        }
      })
      .from(purchaseOrders)
      .leftJoin(vendors, eq(purchaseOrders.vendorId, vendors.id))
      .where(and(...whereConditions))
      .orderBy(purchaseOrders.createdAt);

    return NextResponse.json(poList);
  } catch (err) {
    console.error('Error in GET purchase orders:', err);
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
    const poData = purchaseOrderSchema.parse(body);

    // Verify that the user is creating a PO for their own company
    if (poData.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized to create purchase orders for other companies' },
        { status: 403 }
      );
    }

    // Check if vendor exists and belongs to the company
    const [existingVendor] = await db
      .select()
      .from(vendors)
      .where(and(
        eq(vendors.id, poData.vendorId),
        eq(vendors.companyId, poData.companyId),
        eq(vendors.isActive, true)
      ))
      .limit(1);

    if (!existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found or inactive' },
        { status: 400 }
      );
    }

    // Calculate total amount from items
    const totalAmount = poData.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice),
      0
    );

    // Generate PO number
    const poNumber = `PO-${Date.now().toString().slice(-6)}`;

    // Create purchase order
    return await db.transaction(async (tx) => {
      const [purchaseOrder] = await tx
        .insert(purchaseOrders)
        .values({
          companyId: poData.companyId,
          poNumber,
          vendorId: poData.vendorId,
          status: 'DRAFT',
          totalAmount: totalAmount.toString(),
        })
        .returning();

      // Create PO items
      for (const item of poData.items) {
        await tx
          .insert(poItems)
          .values({
            poId: purchaseOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            totalPrice: (item.quantity * item.unitPrice).toString(),
          });
      }

      const fullPO = {
        ...purchaseOrder,
        items: poData.items
      };

      return NextResponse.json(fullPO);
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST purchase orders:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}