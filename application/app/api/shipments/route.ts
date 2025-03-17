import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

const createShipmentSchema = z.object({
  orderId: z.string(),
  trackingNumber: z.string().optional(),
  carrier: z.string(),
  shipDate: z.string().datetime(),
  weight: z.number().positive(),
  shippingMethod: z.string(),
});

const updateShipmentSchema = z.object({
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  shipDate: z.string().datetime().optional(),
  status: z.enum([
    "PENDING",
    "PICKED",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]).optional(),
  weight: z.number().positive().optional(),
  shippingMethod: z.string().optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    try {
      const body = await req.json();
      const data = createShipmentSchema.parse(body);

      // Verify order belongs to company
      const order = await prisma.order.findFirst({
        where: {
          id: data.orderId,
          companyId,
        },
      });

      if (!order) {
        return errorResponse("Invalid order");
      }

      // Create shipment
      const shipment = await prisma.shipment.create({
        data: {
          orderId: data.orderId,
          trackingNumber: data.trackingNumber,
          carrier: data.carrier,
          shipDate: new Date(data.shipDate),
          status: "PENDING",
          weight: new Decimal(data.weight),
          shippingMethod: data.shippingMethod,
        },
        include: {
          order: {
            include: {
              customer: true,
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      return successResponse(shipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to create shipment");
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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where = {
      order: {
        companyId,
        ...(customerId && { customerId }),
      },
      ...(status && { status }),
      ...(search && {
        OR: [
          { trackingNumber: { contains: search } },
          { carrier: { contains: search } },
          { order: { customer: { name: { contains: search } } } },
        ],
      }),
      ...(startDate &&
        endDate && {
          shipDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          order: {
            include: {
              customer: true,
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.shipment.count({ where }),
    ]);

    return successResponse({
      shipments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
}

export async function PATCH(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return errorResponse("Shipment ID is required");
      }

      const body = await req.json();
      const data = updateShipmentSchema.parse(body);

      // Verify shipment belongs to company
      const shipment = await prisma.shipment.findFirst({
        where: {
          id,
          order: {
            companyId,
          },
        },
      });

      if (!shipment) {
        return errorResponse("Invalid shipment");
      }

      // Update shipment
      const updatedShipment = await prisma.shipment.update({
        where: {
          id,
        },
        data: {
          ...(data.trackingNumber && { trackingNumber: data.trackingNumber }),
          ...(data.carrier && { carrier: data.carrier }),
          ...(data.shipDate && { shipDate: new Date(data.shipDate) }),
          ...(data.status && { status: data.status }),
          ...(data.weight && { weight: new Decimal(data.weight) }),
          ...(data.shippingMethod && { shippingMethod: data.shippingMethod }),
        },
        include: {
          order: {
            include: {
              customer: true,
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      return successResponse(updatedShipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to update shipment");
    }
  });
} 