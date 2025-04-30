import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { orders, orderItems, customers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

const orderSchema = z.object({
  companyId: z.string(),
  customerId: z.string(),
  items: z.array(orderItemSchema).min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status') as 'DRAFT' | 'CONFIRMED' | 'PICKING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | null;

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

    const whereConditions = [eq(orders.companyId, companyId)];
    
    if (customerId) {
      whereConditions.push(eq(orders.customerId, customerId));
    }
    
    if (status) {
      whereConditions.push(eq(orders.status, status));
    }

    const ordersList = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerId: orders.customerId,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        customer: {
          id: customers.id,
          name: customers.name,
        }
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .where(and(...whereConditions))
      .orderBy(orders.createdAt);

    return NextResponse.json(ordersList);
  } catch (err) {
    console.error('Error in GET orders:', err);
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
    const orderData = orderSchema.parse(body);

    // Verify that the user is creating an order for their own company
    if (orderData.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized to create orders for other companies' },
        { status: 403 }
      );
    }

    // Check if customer exists and belongs to the company
    const [existingCustomer] = await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.id, orderData.customerId),
        eq(customers.companyId, orderData.companyId),
        eq(customers.isActive, true)
      ))
      .limit(1);

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found or inactive' },
        { status: 400 }
      );
    }

    // Calculate total amount from items
    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice),
      0
    );

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Create order
    return await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          companyId: orderData.companyId,
          orderNumber,
          customerId: orderData.customerId,
          status: 'DRAFT',
          totalAmount: totalAmount.toString(),
        })
        .returning();

      // Create order items
      for (const item of orderData.items) {
        await tx
          .insert(orderItems)
          .values({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            totalPrice: (item.quantity * item.unitPrice).toString(),
          });
      }

      const fullOrder = {
        ...order,
        items: orderData.items
      };

      return NextResponse.json(fullOrder);
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST orders:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}