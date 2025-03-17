import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const createCustomerSchema = z.object({
  name: z.string(),
  contactPerson: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  creditLimit: z.number(),
});

export async function POST(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    try {
      const body = await req.json();
      const data = createCustomerSchema.parse(body);

      const customer = await prisma.customer.create({
        data: {
          ...data,
          companyId,
          status: "ACTIVE",
        },
      });

      return successResponse(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to create customer");
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

    const where = {
      companyId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          orders: {
            select: {
              id: true,
              orderNumber: true,
              totalAmount: true,
              status: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
          _count: {
            select: {
              orders: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return successResponse({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
} 