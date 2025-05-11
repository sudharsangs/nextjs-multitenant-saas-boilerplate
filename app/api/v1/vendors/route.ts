import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { vendors } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const vendorSchema = z.object({
  companyId: z.string(),
  name: z.string().min(2),
  gstin: z.string().optional(),
  contactPerson: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const requestedCompanyId = getAuthUser(request)?.companyId;

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Verify that the user has access to the requested company
    if (requestedCompanyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized access to company data' },
        { status: 403 }
      );
    }

    const vendorsList = await db
      .select()
      .from(vendors)
      .where(and(
        eq(vendors.companyId, companyId),
        eq(vendors.isActive, true)
      ));

    return NextResponse.json(vendorsList);
  } catch (err) {
    console.error('Error in GET vendors:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const body = await request.json();
    const vendorData = vendorSchema.parse(body);

    // Verify that the user is creating a vendor for their own company
    if (vendorData.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized to create vendors for other companies' },
        { status: 403 }
      );
    }

    // Check if vendor with email already exists
    const [existingVendor] = await db
      .select()
      .from(vendors)
      .where(and(
        eq(vendors.email, vendorData.email),
        eq(vendors.companyId, companyId)
      ))
      .limit(1);

    if (existingVendor) {
      return NextResponse.json(
        { error: 'Vendor with this email already exists' },
        { status: 400 }
      );
    }

    const [createdVendor] = await db
      .insert(vendors)
      .values({
        ...vendorData,
        isActive: true,
      })
      .returning();

    return NextResponse.json(createdVendor);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST vendors:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}