import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

const createInventoryTransactionSchema = z.object({
  productId: z.string(),
  locationId: z.string(),
  orderId: z.string().optional(),
  poId: z.string().optional(),
  transactionType: z.enum([
    "RECEIPT",
    "ISSUE",
    "ADJUSTMENT",
    "TRANSFER_IN",
    "TRANSFER_OUT",
  ]),
  quantity: z.number(),
  referenceNumber: z.string(),
  transactionDate: z.string().datetime(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    try {
      const body = await req.json();
      const data = createInventoryTransactionSchema.parse(body);

      // Verify product belongs to company
      const product = await prisma.product.findFirst({
        where: {
          id: data.productId,
          companyId,
        },
      });

      if (!product) {
        return errorResponse("Invalid product");
      }

      // Verify location belongs to company
      const location = await prisma.location.findFirst({
        where: {
          id: data.locationId,
          companyId,
        },
      });

      if (!location) {
        return errorResponse("Invalid location");
      }

      // Get current inventory
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId: data.productId,
          locationId: data.locationId,
        },
      });

      if (!inventory) {
        return errorResponse("No inventory record found for this product at this location");
      }

      // Calculate new quantities based on transaction type
      const quantityDecimal = new Decimal(data.quantity);
      let quantityOnHand = inventory.quantityOnHand;
      let quantityAvailable = inventory.quantityAvailable;

      switch (data.transactionType) {
        case "RECEIPT":
          quantityOnHand = quantityOnHand.plus(quantityDecimal);
          quantityAvailable = quantityAvailable.plus(quantityDecimal);
          break;
        case "ISSUE":
          if (quantityAvailable.lessThan(quantityDecimal)) {
            return errorResponse("Insufficient available quantity");
          }
          quantityOnHand = quantityOnHand.minus(quantityDecimal);
          quantityAvailable = quantityAvailable.minus(quantityDecimal);
          break;
        case "ADJUSTMENT":
          const difference = quantityDecimal.minus(quantityOnHand);
          quantityOnHand = quantityDecimal;
          quantityAvailable = quantityAvailable.plus(difference);
          break;
        case "TRANSFER_IN":
          quantityOnHand = quantityOnHand.plus(quantityDecimal);
          quantityAvailable = quantityAvailable.plus(quantityDecimal);
          break;
        case "TRANSFER_OUT":
          if (quantityAvailable.lessThan(quantityDecimal)) {
            return errorResponse("Insufficient available quantity");
          }
          quantityOnHand = quantityOnHand.minus(quantityDecimal);
          quantityAvailable = quantityAvailable.minus(quantityDecimal);
          break;
      }

      // Create transaction and update inventory in a transaction
      const result = await prisma.$transaction([
        prisma.inventoryTransaction.create({
          data: {
            productId: data.productId,
            locationId: data.locationId,
            orderId: data.orderId,
            poId: data.poId,
            transactionType: data.transactionType,
            quantity: quantityDecimal,
            referenceNumber: data.referenceNumber,
            transactionDate: new Date(data.transactionDate),
            notes: data.notes,
          },
          include: {
            product: true,
            location: true,
          },
        }),
        prisma.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            quantityOnHand,
            quantityAvailable,
          },
        }),
      ]);

      return successResponse(result[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to create inventory transaction");
    }
  });
}

export async function GET(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const productId = searchParams.get("productId");
    const locationId = searchParams.get("locationId");
    const transactionType = searchParams.get("transactionType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where = {
      product: {
        companyId,
      },
      ...(productId && { productId }),
      ...(locationId && { locationId }),
      ...(transactionType && { transactionType }),
      ...(startDate &&
        endDate && {
          transactionDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    const [transactions, total] = await Promise.all([
      prisma.inventoryTransaction.findMany({
        where,
        include: {
          product: true,
          location: true,
          order: true,
          purchaseOrder: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          transactionDate: "desc",
        },
      }),
      prisma.inventoryTransaction.count({ where }),
    ]);

    return successResponse({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
} 