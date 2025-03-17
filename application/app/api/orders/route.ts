import { NextRequest, NextResponse } from "next/server";
import { withFeature } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { Feature } from "@/lib/subscription";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const createOrderSchema = z.object({
  customerId: z.string(),
  orderDate: z.string(),
  shippingAddress: z.string(),
  billingAddress: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
    })
  ),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  return withFeature(req, Feature.ORDER_MATRIX, async (userId, companyId) => {
    try {
      const body = await req.json();
      const data = createOrderSchema.parse(body);

      const orderNumber = `ORD-${Date.now()}`;
      const items = data.items;

      const order = await prisma.order.create({
        data: {
          companyId,
          customerId: data.customerId,
          userId,
          orderNumber,
          orderDate: new Date(data.orderDate),
          status: "PENDING",
          subtotal: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
          taxAmount: 0,
          shippingCost: 0,
          totalAmount: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
          paymentStatus: "UNPAID",
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress,
          notes: data.notes,
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          orderItems: true,
          customer: true,
        },
      });

      return successResponse(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to create order");
    }
  });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 