import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const customerUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  gstin: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  creditLimit: z.number().optional(),
  isActive: z.boolean().optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const customerId = params.id;

    const [customer] = await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.id, customerId),
        eq(customers.companyId, companyId)
      ))
      .limit(1);

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (err) {
    console.error('Error in GET customer by ID:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const customerId = params.id;
    const body = await request.json();
    const updateData = customerUpdateSchema.parse(body);

    // Check if customer exists and belongs to the company
    const [existingCustomer] = await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.id, customerId),
        eq(customers.companyId, companyId)
      ))
      .limit(1);

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // If email is being updated, check if it already exists
    if (updateData.email && updateData.email !== existingCustomer.email) {
      const [emailExists] = await db
        .select()
        .from(customers)
        .where(and(
          eq(customers.email, updateData.email),
          eq(customers.companyId, companyId),
          eq(customers.isActive, true)
        ))
        .limit(1);

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use by another customer' },
          { status: 400 }
        );
      }
    }

    const [updatedCustomer] = await db
      .update(customers)
      .set({
        ...updateData,
        creditLimit: updateData.creditLimit?.toString(),
        updatedAt: new Date()
      })
      .where(and(
        eq(customers.id, customerId),
        eq(customers.companyId, companyId)
      ))
      .returning();

    return NextResponse.json(updatedCustomer);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT customer:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { companyId } = getAuthUser(request);
    const customerId = params.id;

    // Check if customer exists and belongs to the company
    const [existingCustomer] = await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.id, customerId),
        eq(customers.companyId, companyId)
      ))
      .limit(1);

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Soft delete the customer by setting isActive to false
    await db
      .update(customers)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(and(
        eq(customers.id, customerId),
        eq(customers.companyId, companyId)
      ));

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE customer:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}