import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getToken } from '@/lib/server-cookies';

const orderUpdateSchema = z.object({
  customerId: z.string(),
  orderNumber: z.string(),
  items: z.array(z.object({
    id: z.string(),
    productId: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
  })),
  totalAmount: z.number().positive(),
  notes: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await db.query.orders.findFirst({
      where: (orders) => eq(orders.id, params.id),
      with: {
        customer: true,
        items: {
          with: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error('Error in GET order:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First check if order exists and its status
    const existingOrder = await db.query.orders.findFirst({
      where: (orders) => eq(orders.id, params.id)
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only allow editing of draft orders
    if (existingOrder.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Only draft orders can be edited' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData = orderUpdateSchema.parse(body);

    // Start a transaction to update order and items
    return await db.transaction(async (tx) => {
      // Update order details
      await tx
        .update(orders)
        .set({
          customerId: updateData.customerId,
          orderNumber: updateData.orderNumber,
          totalAmount: updateData.totalAmount.toString(),
          updatedAt: new Date(),
        })
        .where(eq(orders.id, params.id));

      // Delete existing items
      await tx
        .delete(orderItems)
        .where(eq(orderItems.orderId, params.id));

      // Insert new items
      const orderItemsData = updateData.items.map(item => ({
        orderId: params.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(), // Convert to string for PostgreSQL decimal
        totalPrice: (item.quantity * item.unitPrice).toString(), // Convert to string for PostgreSQL decimal
      }));

      await tx.insert(orderItems).values(orderItemsData);

      // Return updated order with items
      const updatedOrder = await db.query.orders.findFirst({
        where: (orders) => eq(orders.id, params.id),
        with: {
          customer: true,
          items: {
            with: {
              product: true
            }
          }
        }
      });

      return NextResponse.json(updatedOrder);
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT order:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Start a transaction to delete order items first, then the order
    await db.transaction(async (tx) => {
      // Delete order items
      await tx
        .delete(orderItems)
        .where(eq(orderItems.orderId, params.id));

      // Delete order
      const [deletedOrder] = await tx
        .delete(orders)
        .where(eq(orders.id, params.id))
        .returning();

      if (!deletedOrder) {
        throw new Error('Order not found');
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE order:', err);
    if (err instanceof Error && err.message === 'Order not found') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}