import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

const createInvoiceSchema = z.object({
  orderId: z.string(),
  dueDate: z.string().datetime(),
  paymentTerms: z.string(),
});

const updateInvoiceSchema = z.object({
  status: z.enum(["UNPAID", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"]).optional(),
  amountPaid: z.number().optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    try {
      const body = await req.json();
      const data = createInvoiceSchema.parse(body);

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

      // Check if invoice already exists for this order
      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          orderId: data.orderId,
        },
      });

      if (existingInvoice) {
        return errorResponse("Invoice already exists for this order");
      }

      // Generate invoice number
      const lastInvoice = await prisma.invoice.findFirst({
        where: {
          order: {
            companyId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          invoiceNumber: true,
        },
      });

      const invoiceNumber = lastInvoice
        ? `INV${String(parseInt(lastInvoice.invoiceNumber.slice(3)) + 1).padStart(6, "0")}`
        : "INV000001";

      const invoice = await prisma.invoice.create({
        data: {
          orderId: data.orderId,
          invoiceNumber,
          invoiceDate: new Date(),
          dueDate: new Date(data.dueDate),
          status: "UNPAID",
          amount: order.totalAmount,
          amountPaid: new Decimal(0),
          paymentTerms: data.paymentTerms,
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

      return successResponse(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to create invoice");
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
          { invoiceNumber: { contains: search } },
          { order: { customer: { name: { contains: search } } } },
        ],
      }),
      ...(startDate &&
        endDate && {
          invoiceDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
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
      prisma.invoice.count({ where }),
    ]);

    return successResponse({
      invoices,
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
        return errorResponse("Invoice ID is required");
      }

      const body = await req.json();
      const data = updateInvoiceSchema.parse(body);

      // Verify invoice belongs to company
      const invoice = await prisma.invoice.findFirst({
        where: {
          id,
          order: {
            companyId,
          },
        },
      });

      if (!invoice) {
        return errorResponse("Invalid invoice");
      }

      // Update invoice
      const updatedInvoice = await prisma.invoice.update({
        where: {
          id,
        },
        data: {
          ...(data.status && { status: data.status }),
          ...(data.amountPaid !== undefined && { amountPaid: new Decimal(data.amountPaid) }),
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

      return successResponse(updatedInvoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to update invoice");
    }
  });
} 