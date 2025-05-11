import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { orders, orderItems, products, customers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getToken } from '@/lib/cookies';

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

    const ordersList = await db.query.orders.findMany({
      where: eq(orders.companyId, companyId),
      with: {
        customer: true,
        items: {
          with: {
            product: true
          }
        }
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)]
    });

    return NextResponse.json(ordersList);
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
          totalAmount: orderData.totalAmount,
        })
        .returning();

      // Create order items
      const orderItemsData = orderData.items.map(item => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
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