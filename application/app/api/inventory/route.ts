import { NextRequest, NextResponse } from "next/server";
import { withFeature } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { Feature } from "@/lib/subscription";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

const adjustInventorySchema = z.object({
  productId: z.string(),
  locationId: z.string(),
  quantity: z.number(),
  type: z.enum(["RECEIPT", "ISSUE", "ADJUSTMENT"]),
  referenceNumber: z.string(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  return withFeature(req, Feature.INVENTORY_AXIS, async (userId, companyId) => {
    try {
      const body = await req.json();
      const data = adjustInventorySchema.parse(body);

      // Check if product and location belong to the company
      const [product, location] = await Promise.all([
        prisma.product.findFirst({
          where: { id: data.productId, companyId },
        }),
        prisma.location.findFirst({
          where: { id: data.locationId, companyId },
        }),
      ]);

      if (!product || !location) {
        return notFoundResponse("Product or location not found");
      }

      // Get current inventory
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId: data.productId,
          locationId: data.locationId,
        },
      });

      if (!inventory) {
        return notFoundResponse("Inventory record not found");
      }

      // Calculate new quantities
      const quantityChange = new Decimal(data.type === "ISSUE" ? -data.quantity : data.quantity);
      const newQuantityOnHand = inventory.quantityOnHand.plus(quantityChange);
      const newQuantityAvailable = newQuantityOnHand.minus(inventory.quantityAllocated);

      if (data.type === "ISSUE" && newQuantityAvailable.lessThan(0)) {
        return errorResponse("Insufficient available quantity");
      }

      // Update inventory and create transaction in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Update inventory
        const updatedInventory = await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            quantityOnHand: newQuantityOnHand,
            quantityAvailable: newQuantityAvailable,
          },
        });

        // Create inventory transaction
        const transaction = await tx.inventoryTransaction.create({
          data: {
            productId: data.productId,
            locationId: data.locationId,
            transactionType: data.type,
            quantity: new Decimal(data.quantity),
            referenceNumber: data.referenceNumber,
            transactionDate: new Date(),
            notes: data.notes,
          },
        });

        return { inventory: updatedInventory, transaction };
      });

      return successResponse(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to adjust inventory");
    }
  });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const locationId = searchParams.get("locationId");
    const lowStock = searchParams.get("lowStock") === "true";

    const where: Prisma.InventoryWhereInput = {
      product: {
        companyId: session.user.companyId,
      },
      ...(locationId && { locationId }),
      ...(lowStock && {
        quantityAvailable: {
          lte: 10, // Assuming low stock threshold
        },
      }),
    };

    const [inventory, total, locations] = await Promise.all([
      prisma.inventory.findMany({
        where,
        include: {
          product: true,
          location: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          product: {
            name: "asc",
          },
        },
      }),
      prisma.inventory.count({ where }),
      prisma.location.findMany({
        where: { companyId: session.user.companyId },
        select: { id: true, name: true },
      }),
    ]);

    return NextResponse.json({
      inventory,
      total,
      locations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 