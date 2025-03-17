import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

const createSalesOrderSchema = z.object({
  customerId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
      expectedDelivery: z.string().datetime().optional(),
    })
  ),
  expectedDeliveryDate: z.string().datetime(),
  shippingAddress: z.string(),
  billingAddress: z.string(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(req, async (userId, companyId) => {
    try {
      const body = await req.json();
      const data = createSalesOrderSchema.parse(body);

      // Verify customer belongs to company
      const customer = await prisma.customer.findFirst({
        where: {
          id: data.customerId,
          companyId,
        },
      });

      if (!customer) {
        return errorResponse("Invalid customer");
      }

      // Verify all products belong to company
      const productIds = data.items.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          companyId,
        },
      });

      if (products.length !== productIds.length) {
        return errorResponse("One or more invalid products");
      }

      // Generate SO number
      const lastSO = await prisma.order.findFirst({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        select: { orderNumber: true },
      });

      const orderNumber = lastSO
        ? `SO${String(parseInt(lastSO.orderNumber.slice(2)) + 1).padStart(6, "0")}`
        : "SO000001";

      // Calculate total amount
      const subtotal = data.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      // Apply tax and shipping (you may want to make these configurable)
      const taxRate = 0.1; // 10%
      const shippingCost = 10;
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount + shippingCost;

      // Check inventory availability
      const inventoryChecks = await Promise.all(
        data.items.map(async (item) => {
          const availableQuantity = await prisma.inventory.aggregate({
            where: {
              productId: item.productId,
            },
            _sum: {
              quantityAvailable: true,
            },
          });

          const available = availableQuantity._sum?.quantityAvailable || new Decimal(0);
          return {
            productId: item.productId,
            requested: new Decimal(item.quantity),
            available,
          };
        })
      );

      const insufficientInventory = inventoryChecks.filter(
        (check) => check.available.lessThan(check.requested)
      );

      if (insufficientInventory.length > 0) {
        return errorResponse(
          `Insufficient inventory for products: ${insufficientInventory
            .map((item) => item.productId)
            .join(", ")}`
        );
      }

      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: data.customerId,
          companyId,
          userId,
          orderDate: new Date(),
          status: "PENDING",
          subtotal: new Decimal(subtotal),
          taxAmount: new Decimal(taxAmount),
          shippingCost: new Decimal(shippingCost),
          totalAmount: new Decimal(totalAmount),
          paymentStatus: "UNPAID",
          shippingAddress: data.shippingAddress,
          billingAddress: data.billingAddress,
          notes: data.notes,
          orderItems: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: new Decimal(item.quantity),
              unitPrice: new Decimal(item.unitPrice),
              totalPrice: new Decimal(item.quantity * item.unitPrice),
              notes: item.expectedDelivery
                ? `Expected delivery: ${item.expectedDelivery}`
                : undefined,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      });

      return successResponse(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to create sales order");
    }
  });
}

export async function GET(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");

    const where = {
      companyId,
      ...(status && { status }),
      ...(customerId && { customerId }),
      ...(search && {
        OR: [
          { orderNumber: { contains: search } },
          { customer: { name: { contains: search } } },
        ],
      }),
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