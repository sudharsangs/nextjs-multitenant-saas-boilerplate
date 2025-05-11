import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const customerSchema = z.object({
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
  creditLimit: z.number().optional(),
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

    const customersList = await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.companyId, companyId),
        eq(customers.isActive, true)
      ));

    return NextResponse.json(customersList);
  } catch (err) {
    console.error('Error in GET customers:', err);
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
    const customerData = customerSchema.parse(body);

    // Verify that the user is creating a customer for their own company
    if (customerData.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized to create customers for other companies' },
        { status: 403 }
      );
    }

    // Check if customer with email already exists
    const [existingCustomer] = await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.email, customerData.email),
        eq(customers.companyId, companyId)
      ))
      .limit(1);

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 400 }
      );
    }

    const [createdCustomer] = await db
      .insert(customers)
      .values({
        ...customerData,
        creditLimit: customerData.creditLimit !== undefined ? customerData.creditLimit.toString() : null,
        isActive: true,
      })
      .returning();

    return NextResponse.json(createdCustomer);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST customers:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}