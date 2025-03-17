import { NextRequest } from "next/server";
import { withFeature } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { Feature } from "@/lib/subscription";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

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

export async function GET(req: NextRequest) {
  return withFeature(req, Feature.ORDER_MATRIX, async (_, companyId) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");

    const where = {
      companyId,
      ...(status && { status }),
      ...(customerId && { customerId }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count({ where }),
    ]);

    return successResponse({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
} 