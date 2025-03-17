import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

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
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Prisma.ProductWhereInput = {
      companyId: session.user.companyId,
      ...(category && { category }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.product.count({ where }),
      prisma.product.groupBy({
        by: ["category"],
        where: { companyId: session.user.companyId },
        _count: true,
        orderBy: { category: "asc" },
      }),
    ]);

    return NextResponse.json({
      products,
      total,
      categories,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 