import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const createProductSchema = z.object({
  sku: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  costPrice: z.number(),
  sellingPrice: z.number(),
  unitOfMeasure: z.string(),
  weight: z.number(),
  attributes: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    try {
      const body = await req.json();
      const data = createProductSchema.parse(body);

      // Check if SKU already exists for the company
      const existingProduct = await prisma.product.findFirst({
        where: {
          companyId,
          sku: data.sku,
        },
      });

      if (existingProduct) {
        return errorResponse("SKU already exists");
      }

      const product = await prisma.product.create({
        data: {
          ...data,
          companyId,
          attributes: data.attributes || {},
        },
      });

      return successResponse(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message);
      }
      return errorResponse("Failed to create product");
    }
  });
}

export async function GET(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const where = {
      companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          inventory: {
            include: {
              location: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
} 