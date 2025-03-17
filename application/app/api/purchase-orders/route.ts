import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const createPurchaseOrderSchema = z.object({
  supplierId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
      expectedDelivery: z.string().datetime().optional(),
    })
  ),
  expectedDeliveryDate: z.string().datetime(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(req, async (userId, companyId) => {
    try {
      const body = await req.json();
      const data = createPurchaseOrderSchema.parse(body);

      // Verify supplier belongs to company
      const supplier = await prisma.supplier.findFirst({
        where: {
          id: data.supplierId,
          companyId,
        },
      });

      if (!supplier) {
        return errorResponse("Invalid supplier");
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

      // Generate PO number
      const lastPO = await prisma.purchaseOrder.findFirst({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        select: { poNumber: true },
      });

      const poNumber = lastPO
        ? `PO${String(parseInt(lastPO.poNumber.slice(2)) + 1).padStart(6, "0")}`
        : "PO000001";

      // Calculate total amount
      const totalAmount = data.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          poNumber,
          supplierId: data.supplierId,
          companyId,
          userId,
          status: "PENDING",
          totalAmount,
          poDate: new Date(),
          expectedDelivery: new Date(data.expectedDeliveryDate),
          notes: data.notes,
          poItems: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
              status: "PENDING",
              expectedDelivery: new Date(item.expectedDelivery || data.expectedDeliveryDate),
            })),
          },
        },
        include: {
          poItems: {
            include: {
              product: true,
            },
          },
          supplier: true,
        },
      });

      return successResponse(purchaseOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to create purchase order");
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
    const supplierId = searchParams.get("supplierId");

    const where = {
      companyId,
      ...(status && { status }),
      ...(supplierId && { supplierId }),
      ...(search && {
        OR: [
          { poNumber: { contains: search } },
          { supplier: { name: { contains: search } } },
        ],
      }),
    };

    const [purchaseOrders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          supplier: true,
          poItems: {
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
      prisma.purchaseOrder.count({ where }),
    ]);

    return successResponse({
      purchaseOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
} 