import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import {
  companies,
  users,
  locations,
  products,
  inventory,
  subscriptions
} from '@/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';
import { getToken } from '@/lib/server-cookies';
import { getAuthUser } from '@/lib/auth';

// Schema validation for company updates
const companyUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  gstin: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  billingAddress: z.string().optional(),
  logo: z.string().optional(),
  theme: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuthUser(request);
    // Special case: if id is "current", get the company for the current user
    if (params.id === "current") {
      const [userCompany] = await db
        .select({
          id: companies.id,
          name: companies.name,
          gstin: companies.gstin,
          address: companies.address,
          city: companies.city,
          state: companies.state,
          country: companies.country,
          pincode: companies.pincode,
          phone: companies.phone,
          email: companies.email,
          website: companies.website,
          billingAddress: companies.billingAddress,
          logo: companies.logo,
          theme: companies.theme,
          settings: companies.settings,
          createdAt: companies.createdAt,
          updatedAt: companies.updatedAt,
          isActive: companies.isActive
        })
        .from(users)
        .leftJoin(companies, eq(users.companyId, companies.id))
        .where(eq(users.id, userId))
        .limit(1);

      if (!userCompany || !userCompany.id) {
        return NextResponse.json(
          { error: 'No company found for current user' },
          { status: 404 }
        );
      }

      return NextResponse.json(userCompany);
    }

    // Regular case: get company by ID
    const companyId = params.id;

    // Get company details
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (err) {
    console.error('Error in GET company by id:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const companyId = params.id;
    const body = await request.json();
    const companyData = companyUpdateSchema.parse(body);

    // Check if company exists
    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Update company details
    const [updatedCompany] = await db
      .update(companies)
      .set({
        ...companyData,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, companyId))
      .returning();

    return NextResponse.json(updatedCompany);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT company by id:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const companyId = params.id;

    // Check if company exists
    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Soft delete company by setting isActive to false
    await db
      .update(companies)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(companies.id, companyId));

    return NextResponse.json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE company by id:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Additional endpoints for company-related operations

// Get company users
export async function GET_USERS(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const companyId = params.id;

    // Check if company exists
    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get all users for the company
    const companyUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        department: users.department,
        isActive: users.isActive,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt
      })
      .from(users)
      .where(and(
        eq(users.companyId, companyId),
        eq(users.isActive, true)
      ));

    return NextResponse.json(companyUsers);
  } catch (err) {
    console.error('Error in GET_USERS for company:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get company subscription details
export async function GET_SUBSCRIPTION(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const companyId = params.id;

    // Check if company exists
    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get subscription details
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.companyId, companyId))
      .limit(1);

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found for this company' },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (err) {
    console.error('Error in GET_SUBSCRIPTION for company:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get company stats
export async function GET_STATS(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const companyId = params.id;

    // Check if company exists
    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get user count
    const [userCount] = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        eq(users.companyId, companyId),
        eq(users.isActive, true)
      ));

    // Get location count
    const [locationCount] = await db
      .select({ count: count() })
      .from(locations)
      .where(and(
        eq(locations.companyId, companyId),
        eq(locations.isActive, true)
      ));

    // Get product count
    const [productCount] = await db
      .select({ count: count() })
      .from(products)
      .where(and(
        eq(products.companyId, companyId),
        eq(products.isActive, true)
      ));

    // Get inventory count (total items)
    const [inventoryCount] = await db
      .select({ count: count() })
      .from(inventory)
      .where(and(
        eq(inventory.companyId, companyId),
        eq(inventory.isActive, true)
      ));

    // Fix for the SUM calculation in the inventory query
    const inventorySumResult = await db
      .select({
        totalQuantity: sql`sum(${inventory.quantity})`
      })
      .from(inventory)
      .where(and(
        eq(inventory.companyId, companyId),
        eq(inventory.isActive, true)
      ));

    const totalInventoryQuantity = inventorySumResult[0]?.totalQuantity ?? 0;

    const stats = {
      userCount: userCount.count,
      locationCount: locationCount.count,
      productCount: productCount.count,
      inventoryItemCount: inventoryCount.count,
      totalInventoryQuantity,
    };

    return NextResponse.json(stats);
  } catch (err) {
    console.error('Error in GET_STATS for company:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get company locations
export async function GET_LOCATIONS(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const companyId = params.id;

    // Check if company exists
    const [existingCompany] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get all locations for the company
    const companyLocations = await db
      .select()
      .from(locations)
      .where(and(
        eq(locations.companyId, companyId),
        eq(locations.isActive, true)
      ));

    return NextResponse.json(companyLocations);
  } catch (err) {
    console.error('Error in GET_LOCATIONS for company:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}