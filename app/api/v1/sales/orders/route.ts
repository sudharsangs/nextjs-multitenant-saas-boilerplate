import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { orders, orderItems, products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getToken } from '@/lib/server-cookies';

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

const orderSchema = z.object({
  companyId: z.string(),
  customerId: z.string(),
  orderNumber: z.string(),
  status: z.enum(['DRAFT', 'CONFIRMED', 'PICKING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']).default('DRAFT'),
  totalAmount: z.number().positive(),
  items: z.array(orderItemSchema),
});

export async function GET(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const ordersList = await db.select().from(orders)
      .where(eq(orders.companyId, companyId))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .orderBy(desc(orders.createdAt));

    type FormattedOrder = {
      id: string;
      companyId: string;
      customerId: string;
      orderNumber: string;
      status: string;
      totalAmount: string;
      createdAt: Date;
      updatedAt: Date;
      items: Array<{
        id: string;
        orderId: string;
        productId: string;
        quantity: number;
        unitPrice: string;
        totalPrice: string;
        product: typeof products.$inferSelect | null;
      }>;
    };

    const formattedOrders = ordersList.reduce((acc, order) => {
      const existingOrder = acc.find(o => o.id === order.orders.id);
      if (!existingOrder) {
        acc.push({
          ...order.orders,
          items: order.order_items ? [{
            ...order.order_items,
            product: order.products
          }] : []
        });
      } else if (order.order_items) {
        existingOrder.items.push({
          ...order.order_items,
          product: order.products
        });
      }
      return acc;
    }, [] as FormattedOrder[]);

    return NextResponse.json(formattedOrders);
  } catch (err) {
    console.error('Error in GET orders:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const orderData = orderSchema.parse(body);

    // Start a transaction
    const [order] = await db.transaction(async (tx) => {
      // Create order
      const [newOrder] = await tx
        .insert(orders)
        .values({
          companyId: orderData.companyId,
          customerId: orderData.customerId,
          orderNumber: orderData.orderNumber,
          status: orderData.status,
          totalAmount: orderData.totalAmount.toString(),
        })
        .returning();

      // Create order items
      const orderItemsData = orderData.items.map(item => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(), // Convert to string for DB storage
        totalPrice: item.totalPrice.toString(), // Convert to string for DB storage
      }));

      await tx.insert(orderItems).values(orderItemsData);

      // Update product stock levels
      for (const item of orderData.items) {
        const [product] = await tx
          .select()
          .from(products)
          .where(eq(products.id, item.productId));

        if (product) {
          // Here you would typically update the inventory table
          // This is a simplified example
          console.log(`Updating stock for product ${product.id}`);
        }
      }

      return [newOrder];
    });

    return NextResponse.json(order);
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